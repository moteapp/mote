'use client';
import { IndexedDB } from 'mote/base/browser/indexedDB';
import { Emitter } from 'mote/base/common/event';
import { Disposable } from 'mote/base/common/lifecycle';
import { generateUuid } from 'mote/base/common/uuid';
import { InstantiationType, registerSingleton } from 'mote/platform/instantiation/common/extensions';
import { IRecordService } from 'mote/platform/record/common/record';
import { ApplyTransationsRequest, TransactionData } from 'mote/platform/request/common/request';
import { requestService } from 'mote/platform/request/common/requestService';
import { ITransactionService, Transaction } from '../common/transaction';

export class TransactionService extends Disposable implements ITransactionService {
    readonly _serviceBrand: undefined;

    public static TRANSACTION_STORE = 'transaction-store';

    private readonly _onDidApplyTransaction = this._register(
        new Emitter<ApplyTransationsRequest>()
    );
    public readonly onDidApplyTransaction = this._onDidApplyTransaction.event;

    private initialzed = false;
    private userId!: string;
    private database!: IndexedDB;

    constructor(
        @IRecordService private readonly recordService: IRecordService,
    ) {
        super();
    }

    public async createAndCommit(userId: string, callback: (tx: Transaction) => Promise<void>) {
        const tx = Transaction.create(userId, this, this.recordService);
        await callback(tx); 
        tx.commit();
    }

    public async initialize(userId: string) {
        if (this.initialzed) {
            return;
        }
        this.userId = userId;
        // Create the database
        this.database = await IndexedDB.create(
            'mote-db',
            1, // version, need to increase when schema changes
            [TransactionService.TRANSACTION_STORE],
            (tx) => {
                if (!tx) {
                    return;
                }
                const store = tx.objectStore(TransactionService.TRANSACTION_STORE);
                if (!store.indexNames.contains('byTimestamp')) {
                    store.createIndex('byTimestamp', 'timestamp', {
                        unique: false,
                    });
                }
                if (!store.indexNames.contains('byUserId')) {
                    store.createIndex('byUserId', 'userId', { unique: false });
                }
            }
        );
        console.log('TransactionService initialized');
        this.initialzed = true;
    }

    public async applyTransaction(transaction: Transaction) {
        console.log('applyTransaction -> ', transaction.toJSON());
        if (transaction.operations.length === 0) {
            return;
        }

        const data: TransactionData = {
            id: transaction.id,
            userId: transaction.userId,
            operations: transaction.operations,
            timestamp: Date.now(),
        };

        // persist the transaction
        await this.database
            .runInTransaction('transaction-store', 'readwrite', (tx) => {
                return tx.add(data, data.id);
            })
            .catch((err) => console.error(err));

        this.applyTransactions();
    }

    private async applyTransactions() {
        if (!this.initialzed) {
            console.log('TransactionService not initialized');
            return;
        }
        const transactions = await this.getTransactions(this.userId);
        if (!transactions || transactions.length === 0) {
            console.log('No transactions to apply for user:' + this.userId);
            return;
        }
        const request: ApplyTransationsRequest = {
            traceId: generateUuid(),
            transactions,
        };
        await requestService.applyTransactions(request);
        transactions.forEach((tx) => this.cleanTransaction(tx.id));
        this._onDidApplyTransaction.fire(request);
    }

    private async getTransactions(userId: string): Promise<TransactionData[]> {
        const entries = await this.database.getKeyValues<TransactionData>(
            TransactionService.TRANSACTION_STORE,
            isValidTransaction,
            { index: 'byUserId', value: userId, limit: 20 }
        );
        return [...entries.values()];
    }

    /**
     * Clean the transaction once it is applied
     * @param id The transaction id
     */
    public async cleanTransaction(id: string) {
        await this.database.runInTransaction(
            'transaction-store',
            'readwrite',
            (tx) => {
                return tx.delete(id);
            }
        );
    }
}

function isValidTransaction(value: unknown): value is TransactionData {
    return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'userId' in value &&
        'operations' in value &&
        'timestamp' in value
    );
}

registerSingleton(ITransactionService, TransactionService, InstantiationType.Delayed);
import { Event } from 'mote/base/common/event';
import { generateUuid} from 'mote/base/common/uuid';
import { createDecorator } from 'mote/platform/instantiation/common/instantiation';
import { OperationExecutor } from 'mote/platform/record/common/operationExecutor';
import { IRecordService } from 'mote/platform/record/common/record';
import { ApplyTransationsRequest, IOperation, TransactionData } from 'mote/platform/request/common/request';

export const ITransactionService = createDecorator<ITransactionService>('ITransactionService');

export interface ITransactionService {
    readonly _serviceBrand: undefined;

    initialize(userId: string): Promise<void>;

    onDidApplyTransaction: Event<ApplyTransationsRequest>;
    createAndCommit(userId: string, callback: (tx: Transaction) => Promise<void>): void;
    applyTransaction(tx: Transaction): void;
}

export class Transaction {

    static create(
        userId: string, 
        transactionService: ITransactionService,
        recordService: IRecordService,
    ): Transaction {
        return new Transaction(userId, transactionService, recordService);
    }

    public id: string = generateUuid();

    private _operations: IOperation[] = [];
    public get operations(): IOperation[] {
        return this._operations;
    }

    private constructor(
        public readonly userId: string, 
        private readonly transactionService: ITransactionService,
        private readonly recordService: IRecordService,
    ) {}

    public async addOperations(operations: IOperation[]) {
        for (const operation of operations) {
            this._operations.push(operation);
            await this.applyOperation(operation);
        }
    }

    private async applyOperation(operation: IOperation) {
        const record = await OperationExecutor.runOperation(operation, this.recordService);
        this.recordService.updateRecord(operation, record);
    }

    public commit() {
        // commit the transaction
        this.transactionService.applyTransaction(this);
    }

    public toJSON(): TransactionData {
        return {
            id: this.id,
            userId: this.userId,
            operations: this.operations,
            timestamp: Date.now(),
        };
    }
}
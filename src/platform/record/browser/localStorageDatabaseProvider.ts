'use client';
import { Event, Emitter } from "mote/base/common/event";
import { Disposable } from "mote/base/common/lifecycle";
import { ApplyTransationsRequest } from "mote/platform/request/common/request";
import { IDatabaseProvider, IRecord, Pointer, RecordChangeEvent } from "../common/record";
import { ITransactionService } from "../common/transaction";
import { requestService } from "mote/platform/request/common/requestService";


export class LocalStorageDatabaseProvider extends Disposable implements IDatabaseProvider {
    private _onDidChange = new Emitter<RecordChangeEvent>();
    public readonly onDidChange: Event<RecordChangeEvent> = this._onDidChange.event;

    private readonly data: Record<string, any> = {};

    public constructor(
        transactionService: ITransactionService
    ) {
        super();
        this._register(transactionService.onDidApplyTransaction((e) => this.applyTransaction(e)));
    }

    private applyTransaction(request: ApplyTransationsRequest) {
        const transactions = request.transactions;
        transactions.forEach(transaction => {
            transaction.operations.forEach(operation => {
                const record = this.data[operation.id];
                if (!record) {
                    // Maybe the record is existing in previous transactions
                    console.warn('Record not found:', operation.id);
                    return;
                }
                // persist the record when the transaction is applied
                console.log('Persist record:', operation.id, record);
                localStorage.setItem(operation.id, JSON.stringify(record));
            });
        });
    }

    public get<T extends IRecord>(pointer: Pointer): T | null {
        let record = this.data[pointer.id];
        if (!record) {
            let value = localStorage.getItem(pointer.id)
            if (!value) {
                return null;
            }
            record = JSON.parse(value) as T;
        }
        return record;
    }

    public async getAsync<T extends IRecord>(pointer: Pointer): Promise<T|null> {
        const record = this.get(pointer);
        if (record) {
            return Promise.resolve(this.get(pointer));
        }
        const recordAndRole = await requestService.syncRecord(pointer);
        console.log('syncRecord', pointer, recordAndRole);
        if (!recordAndRole || !recordAndRole.block) {
            return null;
        }
        this.set(pointer, recordAndRole.block);
        return recordAndRole.block as unknown as T;
    }

    public async set<T extends IRecord>(pointer: Pointer, value: T): Promise<void> {
        this.data[pointer.id] = value;
        // IMPORTANT: do not persist the record here, instead, persist it when the transaction is applied
        this._onDidChange.fire({ record: value });
    }

    public async delete(pointer: Pointer): Promise<void> {
        localStorage.removeItem(pointer.id);
    }

    public watch(resource: Pointer, opts: any): any {

    }
}
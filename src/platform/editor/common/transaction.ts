import { generateUuid} from 'mote/base/common/uuid';
import { IOperation } from './editor';

export class Transaction {

    static create(userId: string): Transaction {
        return new Transaction(userId);
    }

    static createAndCommit(userId: string, callback: (tx: Transaction) => void) {
        const tx = new Transaction(userId);
        callback(tx);
        tx.commit();
    }

    public id: string = generateUuid();

    private _operations: IOperation[] = [];
    public get operations(): IOperation[] {
        return this._operations;
    }

    private constructor(public readonly userId: string) {}

    public addOperation<T>(operation: IOperation) {
        this.operations.push(operation);
    }

    public commit() {
        // commit the transaction
    }
}
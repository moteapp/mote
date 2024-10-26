import { generateUuid} from 'mote/base/common/uuid';
import { IBlockStore } from 'mote/editor/common/blockCommon';
import { CursorOperation } from 'mote/editor/common/cursor/cursorOperations';
import { IOperation } from './editor';

export class Transaction {

    static create(userId: string, store: IBlockStore): Transaction {
        return new Transaction(userId, store);
    }

    static createAndCommit(userId: string, store: IBlockStore, callback: (tx: Transaction) => void) {
        const tx = new Transaction(userId, store);
        callback(tx);
        tx.commit();
    }

    public id: string = generateUuid();

    private _operations: IOperation[] = [];
    public get operations(): IOperation[] {
        return this._operations;
    }

    private constructor(public readonly userId: string, private readonly store: IBlockStore) {}

    public addOperation<T>(operation: CursorOperation) {
        this.operations.push(operation.toJSON());
        operation.runCommand(this.store);
    }

    public commit() {
        // commit the transaction
    }
}
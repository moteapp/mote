import { generateUuid } from 'vs/base/common/uuid';
import { IOperation } from '@mote/editor/common/recordCommon';

export class Transaction {

    static createAndCommit(perform: (transaction: Transaction) => void) {
        const transaction = new Transaction('user', 'space');
        const result = perform(transaction);
        transaction.commit();
        return {
            transaction,
            result
        };
    }
    
    /**
     * The unique identifier of the transaction.
     */
    id: string;

    /**
     * Whether the transaction is local.
     */
    isLocal = true;

    canUndo = true;

    operations: IOperation[] = [];
    committed = false;

    preSubmitActions:any[] = [];
    postSubmitActions:any[] = [];
    postSubmitCallbacks:any[] = [];

    constructor(
        public readonly userId: string,
        public readonly spaceId: string,
    ) {
        this.id = generateUuid();
    }

    public commit() {

    }

    public addOperation(operation: IOperation) {
       

    }
}
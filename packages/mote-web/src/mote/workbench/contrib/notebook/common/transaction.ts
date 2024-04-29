import { generateUuid } from 'vs/base/common/uuid';
import { IOperation } from '../../../../platform/database/common/recordCommon';

export class Transaction {
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

    public addOperation(operation: IOperation) {
       

    }
}
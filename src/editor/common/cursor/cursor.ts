import { Transaction } from "mote/platform/editor/common/transaction";
import { IBlockStore, ISegment, ITextBlock } from "../blockCommon";
import { ITextSelection } from "../core/selection";
import { BlockModel } from "../model/blockModel";
import { RecordModel } from "../model/recordModel";
import { EnterOperation } from "./cursorTypeEditOperations";
import { TypeOperation } from "./cursorTypeOperations";

export class CursorController {
    public constructor(
        private readonly userId: string,
        private readonly store: IBlockStore,
    ) {

    }

    public type(text: string, model: RecordModel<ISegment[]>) {
        this.executeEditOperation(TypeOperation.type(text, model));
    }

    public lineBreakInsert(block: BlockModel, selection: ITextSelection) {
        this.withTransaction(tx => {
            this.executeEditOperation(EnterOperation.lineBreakInsert(block, selection, tx));
        });
    }

    private withTransaction(callback: (tx: Transaction) => void) {
        Transaction.createAndCommit(this.userId, this.store, callback);
    }

    private executeEditOperation(operation: any) {
        // todo
    }
}
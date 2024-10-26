import { IKeyboardEvent } from 'mote/base/browser/keyboardEvent';
import { IBlockStore, ISegment, ITextBlock } from 'mote/editor/common/blockCommon';
import { ITextSelection } from 'mote/editor/common/core/selection';
import { CursorController } from 'mote/editor/common/cursor/cursor';
import { BlockModel } from 'mote/editor/common/model/blockModel';
import { RecordModel } from 'mote/editor/common/model/recordModel';

export class ViewController {

    private selection: ITextSelection = { start: 0, end: 0 };
    private cursor: CursorController;

    public constructor(
        private readonly userId: string,
        private readonly store: IBlockStore,
    ) {
        this.cursor = new CursorController(userId, store);
    }

    public emitKeyDown(e: IKeyboardEvent): void {
        // console.log('emitKeyDown', e);
    }

    public emitKeyUp(e: IKeyboardEvent): void {
        // console.log('emitKeyUp', e);
    }

    /**
     * Type text and only works for ITextBlock
     * @param text
     * @param model
     */
    public type(text: string, block: RecordModel<ISegment[]>) {
        this.cursor.type(text, block);
    }

    public lineBreakInsert(block: BlockModel) {
        console.log('lineBreakInsert', block);
        this.cursor.lineBreakInsert(block, this.selection);
    }
}

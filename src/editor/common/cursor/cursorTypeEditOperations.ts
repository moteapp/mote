import { match, P } from 'ts-pattern';
import { generateUuid } from 'mote/base/common/uuid';
import { Transaction } from 'mote/platform/editor/common/transaction';
import { BlockType, ISegment, isTextBlock, newBlock, newTextBlock } from '../blockCommon';
import { ITextSelection } from "../core/selection";
import { TextUtils } from "../core/text";
import { BlockModel } from "../model/blockModel";
import { appendToParentOperation, newSetOperation } from './cursorOperations';

export class EnterOperation {

    public static lineBreakInsert(block: BlockModel, selection: ITextSelection, tx: Transaction) {
        return EnterOperation.enter(block, true, selection, tx);
    }

    public static lineInsertBefore(block: BlockModel, tx: Transaction) {
        return EnterOperation.enter(block, true, { start: 0, end: 0 }, tx);
    }

    public static lineInsertAfter(block: BlockModel, tx: Transaction) {
        return EnterOperation.enter(block, false, { start: 0, end: 0 }, tx);
    }

    /**
     * Handle enter operation, split the block into two blocks  
     * Example: [block] -> [block1, block2]  
     * If keepPosition is true, the cursor will be in the first block, otherwise in the second block
     * @param block 
     * @param keepPosition keep the cursor position or not
     * @param selection cursor position
     * @returns 
     */
    private static enter(block: BlockModel, keepPosition: boolean, selection: ITextSelection, tx: Transaction) {
        let before: ISegment[] = [];
        let after: ISegment[] = [];

        match(block.value)
        .when(isTextBlock, block => {
            const result = TextUtils.split(block.content.value, selection.start);
            before = result.before;
            after = result.after;
        });

        // update the block value
        tx.addOperation(newSetOperation(block.getTextValueModel(), before));
       
        // create new block
        const pointer = { id: generateUuid(), table: 'block', spaceId: block.spaceId };
        const model = new BlockModel(pointer, block.blockStore);
        const blockValue = newTextBlock({
            id: pointer.id,
            rootId: block.rootId,
            userId: tx.userId,
        })
        tx.addOperation(newSetOperation(model, blockValue));

        // append the new block to parent
        tx.addOperation(appendToParentOperation(block.getRootModel()!.getChildrenModel(), model));
      
        return {
            type: 'enter',
            block
        };
    }
}
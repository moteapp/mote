import { match, P } from 'ts-pattern';
import { DiffChangeType, diffText } from 'mote/base/common/diff/diffChanges';
import { generateUuid } from 'mote/base/common/uuid';
import { BlockType, generateTextFromSegements, ISegment, isTextBlock, newBlock, newTextBlock } from '../blockCommon';
import { MoveLinesCommand } from '../commands/moveLinesCommand';
import { NewLineCommand } from '../commands/newLineCommand';
import { ReplaceCommand } from '../commands/replaceCommand';
import { ITextSelection } from "../core/selection";
import { TextUtils } from "../core/text";
import { EditOperationResult } from '../cursorCommon';
import { ICommand } from '../editorCommon';
import { BlockModel } from "../model/blockModel";
import { RecordModel } from '../model/recordModel';

export class EnterOperation {

    public static lineBreakInsert(block: BlockModel, selection: ITextSelection, userId: string) {
        return EnterOperation.enter(block, true, selection, userId);
    }

    /**
     * [enter][line]
     * @param block 
     * @returns 
     */
    public static lineInsertBefore(block: BlockModel, userId: string) {
        return EnterOperation.enter(block, true, { start: 0, end: 0 }, userId);
    }

    public static lineInsertAfter(block: BlockModel, userId: string) {
        return EnterOperation.enter(block, false, { start: 0, end: 0 }, userId);
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
    private static enter(block: BlockModel, keepPosition: boolean, selection: ITextSelection, userId: string): EditOperationResult {
        const rootModel = block.getRootModel()!;
        const commands: ICommand[] = [];
        let before: ISegment[] = [];
        let after: ISegment[] = [];
        let contextLength = 0;

        match(block.value)
        .when(isTextBlock, block => {
            const result = TextUtils.split(block.content.value, selection.start);
            before = result.before;
            after = result.after;
            contextLength = block.content.value.map(segment=>segment[0]).join('').length;
        });

        // replace current block with before
        commands.push(new ReplaceCommand(before, block.getTextValueModel()));
       
        // create new block
        const pointer = { id: generateUuid(), table: 'block', spaceId: block.spaceId };
        const model = new BlockModel(pointer, block.recordService);
        const blockValue = newTextBlock({
            id: pointer.id,
            rootId: block.rootId,
            userId
        });

        // create new line
        commands.push(new NewLineCommand(blockValue, model, selection));
        // append new block to parent
        commands.push(new MoveLinesCommand({id: pointer.id, after: block.id, before: block.id}, selection, rootModel.getChildrenModel()));
      
        return new EditOperationResult(commands, {
            shouldPushStackElementBefore: false,
            shouldPushStackElementAfter: false,
        });
    }
}

export class TypeInterceptorsOperation {

    public static getEdits(text: string, _: ITextSelection, block: RecordModel<ISegment[]>) {
        const commands: ICommand[] = [];
        const selection: ITextSelection = { start: 0, end: 0 };

        const originalText = generateTextFromSegements(block.value);

        let bias = 0;
        const diffChanges = diffText(originalText, text);
        for (let i = 0; i < diffChanges.length; i++) {
            const diff = diffChanges[i];
            const diffIdx = bias + diff.value.split('').length;
            if (diffIdx >= selection.start) {
                if (diff.type === DiffChangeType.Equal) {
                    const prevDiff = diffChanges[i - 1];
                    const nextDiff = diffChanges[i + 1];
                    let beforePrevDiff = diffChanges[i - 2];
                    let afterNextDiff = diffChanges[i + 2];

                    // Insert
                    if (nextDiff && nextDiff.type === DiffChangeType.Insert) {
                        if (!afterNextDiff) {
                            afterNextDiff = { type: DiffChangeType.Equal, value: '' };
                            diffChanges.push(afterNextDiff);
                        }
                        while (diffIdx > selection.start && diff.value.endsWith(nextDiff.value)) {
                            diff.value = diff.value.slice(0, diff.value.length - nextDiff.value.length);
                            afterNextDiff.value = nextDiff.value + afterNextDiff.value;
                        }
                    }
                    // Merge
                    else if (prevDiff && prevDiff.type === DiffChangeType.Insert) {
                        if (!beforePrevDiff) {
                            beforePrevDiff = { type: DiffChangeType.Equal, value: '' };
                            diffChanges.push(beforePrevDiff);
                        }
                        while (diffIdx > selection.start && diff.value.startsWith(prevDiff.value)) {
                            diff.value = diff.value.slice(prevDiff.value.length);
                            beforePrevDiff.value = beforePrevDiff.value + prevDiff.value;
                            bias -= prevDiff.value.length;
                        }
                    }
                }
                break;
            }
            bias += diff.value.split('').length;
        }
        console.log('diffChanges', diffChanges);

        let start = 0;
        for (const diff of diffChanges) {
            const { type, value } = diff;
            switch (type) {
                case DiffChangeType.Insert:
                    // TypeOperation.insert(value, {start, end: start}, block);
                    commands.push(new ReplaceCommand([[value]], block, {start, end: start}));
                    start += value.length;
                    break;
                case DiffChangeType.Delete:
                    // TypeOperation.delete({start, end: start + value.length}, block);
                    commands.push(new ReplaceCommand([['']], block, {start, end: start + value.length}));
                    break;
                case DiffChangeType.Equal:
                    start += value.length;
                    break;
            }
        }

        return new EditOperationResult(commands, {
            shouldPushStackElementBefore: false,
            shouldPushStackElementAfter: false,
        });
    }
}
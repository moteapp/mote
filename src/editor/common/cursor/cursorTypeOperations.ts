import { DiffChangeType, diffText } from "mote/base/common/diff/diffChanges";
import { generateTextFromSegements, ISegment, ITextBlock } from "../blockCommon";
import { ITextSelection } from "../core/selection";
import { TextUtils } from "../core/text";
import { BlockModel } from "../model/blockModel";
import { RecordModel } from "../model/recordModel";
import { newSetOperation } from "./cursorOperations";

export class TypeOperation {
    public static type(text: string, block: RecordModel<ISegment[]>) {
        const selection: ITextSelection = { start: 0, end: 0 };

        const originalValue = block.value;
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
                    TypeOperation.insert(value, {start, end: start}, block);
                    start += value.length;
                    break;
                case DiffChangeType.Delete:
                    TypeOperation.delete({start, end: start + value.length}, block);
                    break;
                case DiffChangeType.Equal:
                    start += value.length;
                    break;
            }
        }
        return { start, end: start };
    }

    public static insert(text: string, selection: ITextSelection, block: RecordModel<ISegment[]>) {
        if (text.length === 0) {
            return;
        }
        const segment: ISegment = [text, []];
        const segments = TextUtils.merge(block.value, [segment], selection.start);
        const operation = newSetOperation(block, segments);
        operation.runCommand(block.blockStore);
    }

    public static delete(selection: ITextSelection, block: RecordModel<ISegment[]>) {
        if (selection.start === selection.end) {
            return;
        }
        const segments = TextUtils.remove(block.value, selection.start, selection.end);
        const operation = newSetOperation(block, segments);
        operation.runCommand(block.blockStore);
    }
}
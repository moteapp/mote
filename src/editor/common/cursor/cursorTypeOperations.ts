import { generateTextFromSegements, ISegment, ITextBlock } from "../blockCommon";
import { ITextSelection } from "../core/selection";
import { TextUtils } from "../core/text";
import { BlockModel } from "../model/blockModel";
import { RecordModel } from "../model/recordModel";
import { newSetOperation } from "./cursorOperations";
import { TypeInterceptorsOperation } from "./cursorTypeEditOperations";

export class TypeOperation {

    public static typeWithoutInterceptors(text: string, selection: ITextSelection, block: RecordModel<ISegment[]>) {
        return TypeInterceptorsOperation.getEdits(text, selection, block);
    }
}
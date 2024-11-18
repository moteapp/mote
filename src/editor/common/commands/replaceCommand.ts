import { OperationType } from "mote/platform/record/common/record";
import { ITextSelection } from "../core/selection";
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from "../editorCommon";
import { RecordModel } from "../model/recordModel";
import { ISegment } from "../blockCommon";
import { TextUtils } from "../core/text";

export class ReplaceCommand implements ICommand {
    constructor(
        private readonly segments: ISegment[],
        public readonly model: RecordModel,
        private readonly selection?: ITextSelection,
    ) {

    }

    public getEditOperations(builder: IEditOperationBuilder): void {
        let segments: ISegment[];
        if (this.selection) {
            segments = TextUtils.remove(this.model.value, this.selection.start, this.selection.end);
            segments = TextUtils.merge(segments, this.segments, this.selection.start);
        } else {
            segments = this.segments;
        }
        builder.addTrackedEditOperation(OperationType.Set, segments);
	}

    public computeCursorState(helper: ICursorStateComputerData): ITextSelection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return { start: srcRange.end, end: srcRange.end };
	}
}
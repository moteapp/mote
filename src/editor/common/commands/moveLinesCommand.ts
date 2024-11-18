import { OperationType } from "mote/platform/record/common/record";
import { ITextSelection } from "../core/selection";
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from "../editorCommon";
import { RecordModel } from "../model/recordModel";
import { ISegment } from "../blockCommon";
import { ListOperationPayload } from "mote/platform/record/common/operationExecutor";

export class MoveLinesCommand implements ICommand {
    constructor(
        private readonly payload: ListOperationPayload,
        private readonly selection: ITextSelection,
        public readonly model: RecordModel
    ) {

    }

    public getEditOperations(builder: IEditOperationBuilder): void {
        if (this.selection && this.selection.start !== 0) {
            // append a new line after the current line since the cursor is not at the beginning of the line
            builder.addTrackedEditOperation(OperationType.ListAfter, this.payload);
        } else {
            // insert a new line before the current line since the cursor is at the beginning of the line
            builder.addTrackedEditOperation(OperationType.ListBefore, this.payload);
        }
	}

    public computeCursorState(helper: ICursorStateComputerData): ITextSelection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return { start: srcRange.end, end: srcRange.end };
	}
}
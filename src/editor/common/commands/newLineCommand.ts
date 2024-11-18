import { OperationType } from "mote/platform/record/common/record";
import { IBlock, ISegment } from "../blockCommon";
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from "../editorCommon";
import { RecordModel } from "../model/recordModel";
import { ITextSelection } from "../core/selection";

export class NewLineCommand implements ICommand {
    

    constructor(
        private readonly block: IBlock,
        public readonly model: RecordModel,
        private readonly selection?: ITextSelection,
    ) {

    }

    public getEditOperations(builder: IEditOperationBuilder): void {
        builder.addTrackedEditOperation(OperationType.Set, this.block);
	}

    public computeCursorState(helper: ICursorStateComputerData): ITextSelection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return { start: srcRange.end, end: srcRange.end };
	}
}
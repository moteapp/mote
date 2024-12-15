import { OperationType } from "mote/platform/request/common/request";
import { ISegment } from "../blockCommon";
import { ITextSelection } from "../core/selection";
import { TextUtils } from "../core/text";
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from "../editorCommon";
import { RecordModel } from "../model/recordModel";
import { BlockModel } from "../model/blockModel";
import { IDocumentMetadata } from "mote/platform/request/common/document";

export class UpdateMetadataCommand implements ICommand {
    constructor(
        private readonly metadata: Partial<IDocumentMetadata>,
        public readonly model: RecordModel<IDocumentMetadata>,
    ) {

    }

    public getEditOperations(builder: IEditOperationBuilder): void {
        builder.addTrackedEditOperation(OperationType.Update, this.metadata);
	}

    public computeCursorState(helper: ICursorStateComputerData): ITextSelection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;
		return { start: srcRange.end, end: srcRange.end };
	}
}
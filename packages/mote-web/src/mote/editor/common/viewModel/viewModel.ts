import { BlockModel } from "mote/editor/common/model/blockModel";
import { CursorsController } from "../cursor/cursor";
import { IRecordService } from "../services/record";
import { RecordModel } from "../model/recordModel";
import { ISegment } from "../recordCommon";

export class ViewModel {

    private cursors: CursorsController;

    constructor(
        private model: BlockModel,
        recordService: IRecordService,
    ){
        this.cursors = new CursorsController(model, recordService);
    }

    public type(text: string, model: RecordModel<ISegment[]>): void {
        return this.cursors.type(text, model);
    }

    public lineBreak(model: RecordModel<ISegment[]>) {
        return this.cursors.lineBreak(model);
    }
}
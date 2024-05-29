import { Disposable } from 'vs/base/common/lifecycle';
import { BlockModel } from "mote/editor/common/model/blockModel";
import { CursorsController } from "../cursor/cursor";
import { IRecordService } from "../services/record";
import { RecordModel } from "../model/recordModel";
import { ISegment } from "../recordCommon";
import { IViewModel } from "../viewModelCommon";
import { CursorChangeReason } from "../cursorEvents";
import { PartialCursorState, SingleCursorState } from "../cursorCommon";
import { EditorSelection } from "../core/selection";
import { Emitter, Event } from "mote/workbench/workbench.web.main";
import { ViewCursorStateChangedEvent } from "../viewEvents";

export class ViewModel extends Disposable implements IViewModel {

    private _onCursorStateChanged: Emitter<ViewCursorStateChangedEvent> = this._register(new Emitter<ViewCursorStateChangedEvent>());
    public onCursorStateChanged: Event<ViewCursorStateChangedEvent> = this._onCursorStateChanged.event;

    private cursors: CursorsController;

    constructor(
        private model: BlockModel,
        recordService: IRecordService,
    ){
        super();
        this.cursors = new CursorsController(model, recordService);
    }

    public get selection(): EditorSelection {
        return this.cursors.selection;
    }

    public getLineContent(lineNumber: number): string {
        return this.model.getLineContent(lineNumber);
    }

    setCursorStates(source: string | null | undefined, reason: CursorChangeReason, states: SingleCursorState[]): boolean {
        this.cursors.setStates(source, reason, states);
        this._onCursorStateChanged.fire(new ViewCursorStateChangedEvent(
            [this.cursors.selection],
            reason
        ));
        return true;
    }

    public type(text: string, model: RecordModel<ISegment[]>): void {
        return this.cursors.type(text, model);
    }

    public lineBreak(model: RecordModel<ISegment[]>) {
        this.cursors.lineBreak(model);
    }
}
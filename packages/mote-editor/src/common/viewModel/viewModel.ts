import { Disposable } from 'vs/base/common/lifecycle';
import { BlockModel } from "@mote/editor/common/model/blockModel";
import { CursorsController } from "../cursor/cursor";
import { IRecordService } from "../services/record";
import { RecordModel } from "@mote/editor/common/model/recordModel";
import { ISegment } from "@mote/editor/common/recordCommon";
import { IViewModel } from "@mote/editor/common/viewModelCommon";
import { CursorChangeReason } from "@mote/editor/common/cursorEvents";
import { SingleCursorState } from "@mote/editor/common/cursorCommon";
import { EditorSelection } from "@mote/editor/common/core/selection";
import { Emitter, Event } from "vs/base/common/event";
import { ViewCursorStateChangedEvent } from "@mote/editor/common/viewEvents";

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
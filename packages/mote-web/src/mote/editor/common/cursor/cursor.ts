import { Transaction } from "mote/platform/database/common/transaction";
import { TypeOperations } from "./cursorTypeOperation";
import { BlockModel } from "mote/editor/common/model/blockModel";
import { IEditOperationResult, PartialCursorState, SelectionStartKind } from "mote/editor/common/cursorCommon";
import { CursorCommand } from "../commands/cursorCommand";
import { IRecordProvider, ISegment, Role } from "mote/editor/common/recordCommon";
import { SingleCursorState } from "mote/editor/common/cursorCommon";
import { EditorRange } from "../core/range";
import { Position } from "../core/position";
import { EditorSelection } from "../core/selection";
import { RecordModel } from "mote/editor/common/model/recordModel";
import { ICommand } from "../editorCommon";
import { IRecordService } from "../services/record";
import { CursorChangeReason } from "../cursorEvents";

export class CursorsController {

    private modelState: SingleCursorState;

    constructor(
        private model: BlockModel,
        private recordService: IRecordService,
    ){
        this.modelState = new SingleCursorState(new EditorRange(0, 1, 0, 1), SelectionStartKind.Simple, 0, new Position(0, 1), 0);
    }

    get selection(): EditorSelection {
        return this.modelState.selection;
    }

    public setStates(source: string | null | undefined, reason: CursorChangeReason, states: SingleCursorState[]): boolean {
        this.setState(states[0]);
        return true;
    }

    public setState( modelState: SingleCursorState) {
        const selectionStart = this.model.validateRange(modelState.selectionStart);

        const position = this.model.validatePosition(modelState.position.lineNumber, modelState.position.column);

        const selectionStartLeftoverVisibleColumns = modelState.selectionStart.equalsRange(selectionStart) ? modelState.selectionStartLeftoverVisibleColumns : 0;

        const leftoverVisibleColumns = modelState.position.equals(position) ? modelState.leftoverVisibleColumns : 0;

        modelState = new SingleCursorState(selectionStart, modelState.selectionStartKind, selectionStartLeftoverVisibleColumns, position, leftoverVisibleColumns);

        this.modelState = modelState;
    }

    public type(text: string, model: RecordModel<ISegment[]>) {
        this.executeEditOperation(TypeOperations.type(model, text));
    }

    public lineBreak(model: RecordModel<ISegment[]>) {
        this.executeEditOperation(TypeOperations.lineBreak(this.model.getContentModel(), model));
    }

    private executeEdit(callback: (tx: Transaction) => void) {
        Transaction.createAndCommit(callback);
    }

    private executeEditOperation(opResult: IEditOperationResult | null) {
        if (!opResult) {
			// Nothing to execute
			return;
		}
        this.executeEdit((tx) => {
            opResult.commands.forEach(command => {
                const cursorCmd = command as CursorCommand;
                tx.addOperation(cursorCmd.operation);
                const record = cursorCmd.runCommand(this.model.recordProvider);
                this.recordService.updateRecord(record);
                this.model.pushEditOperations(null, []);
            });
        });
    }
}

class CommandExecutor {

    public static executeCommands(model: RecordModel<any>, selectionsBefore: EditorSelection[], commands: ICommand[]): EditorSelection[] | null {

        
        return null;
    }
}
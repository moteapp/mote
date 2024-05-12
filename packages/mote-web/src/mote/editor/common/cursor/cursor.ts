import { Transaction } from "mote/platform/database/common/transaction";
import { TypeOperations } from "./cursorTypeOperation";
import { BlockModel } from "mote/editor/common/model/blockModel";
import { IEditOperationResult, SelectionStartKind } from "mote/editor/common/cursorCommon";
import { CursorCommand } from "../commands/cursorCommand";
import { IRecordProvider, ISegment, Role } from "mote/editor/common/recordCommon";
import { SingleCursorState } from "mote/editor/common/cursorCommon";
import { EditorRange } from "../core/range";
import { Position } from "../core/position";
import { EditorSelection } from "../core/selection";
import { RecordModel } from "mote/editor/common/model/recordModel";
import { ICommand } from "../editorCommon";
import { IRecordService } from "../services/record";

export class CursorsController {

    private modelState: SingleCursorState;

    constructor(
        private model: BlockModel,
        private recordService: IRecordService,
    ){
        this.modelState = new SingleCursorState(new EditorRange(1, 1, 1, 1), SelectionStartKind.Simple, 0, new Position(1, 1), 0);
    }

    get selection(): EditorSelection {
        return this.modelState.selection;
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
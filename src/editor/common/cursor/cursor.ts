import { ITransactionService, Transaction } from "mote/platform/record/common/transaction";
import { ISegment, ITextBlock } from "../blockCommon";
import { ITextSelection } from "../core/selection";
import { EditOperationResult } from "../cursorCommon";
import * as editorCommon from "../editorCommon";
import { BlockModel } from "../model/blockModel";
import { RecordModel } from "../model/recordModel";
import { EnterOperation } from "./cursorTypeEditOperations";
import { TypeOperation } from "./cursorTypeOperations";
import { IOperation, OperationType } from "mote/platform/request/common/request";

export class CursorController {

    private selection: ITextSelection = { start: 0, end: 0 };

    public constructor(
        private readonly userId: string,
        private readonly transactionService: ITransactionService
    ) {

    }

    public type(text: string, model: RecordModel<ISegment[]>) {
        this.executeEditOperation(TypeOperation.typeWithoutInterceptors(text, this.selection, model));
    }

    public lineBreakInsert(block: BlockModel, selection: ITextSelection) {
        this.executeEditOperation(EnterOperation.lineBreakInsert(block, selection, this.userId));
    }

    private executeEditOperation(opResult: EditOperationResult | null) {
        if (!opResult) {
			// Nothing to execute
			return;
		}
        CommandExecutor.executeCommands(this.userId, this.selection, opResult.commands, this.transactionService);
    }
}

export class CommandExecutor {

    public static executeCommands(
        userId: string,
        selectionBefore: ITextSelection, 
        commands: editorCommon.ICommand[], 
        transactionService: ITransactionService
    ) {
        const commandsData = this.getEditOperations(commands);
		if (commandsData.operations.length === 0) {
			return null;
		}

        const rawOperations = commandsData.operations;
        console.log('rawOperations', rawOperations);
        transactionService.createAndCommit(userId, tx => tx.addOperations(rawOperations));
    }

    private static getEditOperations(commands: (editorCommon.ICommand | null)[]) {
        let operations: IOperation[] = [];
		let hadTrackedEditOperation: boolean = false;

		for (let i = 0, len = commands.length; i < len; i++) {
			const command = commands[i];
			if (command) {
				const r = this.getEditOperationsFromCommand(i, command);
				operations = operations.concat(r.operations);
				hadTrackedEditOperation = hadTrackedEditOperation || r.hadTrackedEditOperation;
			}
		}
		return {
			operations,
			hadTrackedEditOperation
		};
    }

    private static getEditOperationsFromCommand(majorIdentifier: number, command: editorCommon.ICommand) {
        // This method acts as a transaction, if the command fails
		// everything it has done is ignored
        const operations: IOperation[] = [];

        const addEditOperation = (type: OperationType, args: any | null) => {
            const { id, table, path } = command.model;
            operations.push({
                id,
                table,
                path,
                type,
                args
            });
        }

        let hadTrackedEditOperation = false;
        const addTrackedEditOperation = (type: OperationType, args: any | null) => {
            hadTrackedEditOperation = true;
            addEditOperation(type, args);
        }

        const editOperationBuilder: editorCommon.IEditOperationBuilder = {
            addEditOperation,
            addTrackedEditOperation
        };

        command.getEditOperations(editOperationBuilder);

        return {
			operations,
			hadTrackedEditOperation
		};
    }
}
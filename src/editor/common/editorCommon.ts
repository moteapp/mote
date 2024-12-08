import { OperationType } from "mote/platform/request/common/request";
import { ITextSelection } from "./core/selection";
import { RecordModel } from "./model/recordModel";

export enum DropType {
    None = '',
    Block = 'block',
    Menu = 'menu',
    Relation = 'relation',
    Record = 'record',
    Widget = 'widget',
}

export enum SelectType {
    None = '',
    Block = 'block',
    Record = 'record',
}

/**
 * A builder and helper for edit operations for a command.
 */
export interface IEditOperationBuilder {
	/**
	 * Add a new edit operation (a replace operation).
	 * @param range The range to replace (delete). May be empty to represent a simple insert.
	 * @param text The text to replace with. May be null to represent a simple delete.
	 */
	addEditOperation(type: OperationType, args: any, forceMoveMarkers?: boolean): void;

    /**
	 * Add a new edit operation (a replace operation).
	 * The inverse edits will be accessible in `ICursorStateComputerData.getInverseEditOperations()`
	 * @param range The range to replace (delete). May be empty to represent a simple insert.
	 * @param text The text to replace with. May be null to represent a simple delete.
	 */
	addTrackedEditOperation(type: OperationType, args: any, forceMoveMarkers?: boolean): void;

}

/**
 * A helper for computing cursor state after a command.
 */
export interface ICursorStateComputerData {
	/**
	 * Get the inverse edit operations of the added edit operations.
	 */
	getInverseEditOperations(): IValidEditOperation[];
	/**
	 * Get a previously tracked selection.
	 * @param id The unique identifier returned by `trackSelection`.
	 * @return The selection.
	 */
	getTrackedSelection(id: string): Selection;
}

/**
 * A command that modifies text / cursor state on a model.
 */
export interface ICommand {

	readonly model: RecordModel;

	/**
	 * Get the edit operations needed to execute this command.
	 * @param model The model the command will execute on.
	 * @param builder A helper to collect the needed edit operations and to track selections.
	 */
	getEditOperations(builder: IEditOperationBuilder): void;

	/**
	 * Compute the cursor state after the edit operations were applied.
	 * @param model The model the command has executed on.
	 * @param helper A helper to get inverse edit operations and to get previously tracked selections.
	 * @return The cursor state after the command executed.
	 */
	computeCursorState(helper: ICursorStateComputerData): ITextSelection;
}

export interface IValidEditOperation {
	data: any;
	range: ITextSelection;
}
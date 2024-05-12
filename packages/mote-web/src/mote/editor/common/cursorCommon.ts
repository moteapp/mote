import { Position } from "./core/position";
import { EditorRange } from "./core/range";
import { EditorSelection } from "./core/selection";
import { ICommand } from "./editorCommon";

/**
 * This is an operation type that will be recorded for undo/redo purposes.
 * The goal is to introduce an undo stop when the controller switches between different operation types.
 */
export const enum EditOperationType {
	Other = 0,
	DeletingLeft = 2,
	DeletingRight = 3,
	TypingOther = 4,
	TypingFirstSpace = 5,
	TypingConsecutiveSpace = 6,
}

export const enum SelectionStartKind {
	Simple,
	Word,
	Line
}

/**
 * Represents the cursor state on either the model or on the view model.
 */
export class SingleCursorState {
	_singleCursorStateBrand: void = undefined;

	public readonly selection: EditorSelection;

	constructor(
		public readonly selectionStart: EditorRange,
		public readonly selectionStartKind: SelectionStartKind,
		public readonly selectionStartLeftoverVisibleColumns: number,
		public readonly position: Position,
		public readonly leftoverVisibleColumns: number,
	) {
		this.selection = SingleCursorState._computeSelection(this.selectionStart, this.position);
	}

	public equals(other: SingleCursorState) {
		return (
			this.selectionStartLeftoverVisibleColumns === other.selectionStartLeftoverVisibleColumns
			&& this.leftoverVisibleColumns === other.leftoverVisibleColumns
			&& this.selectionStartKind === other.selectionStartKind
			&& this.position.equals(other.position)
			&& this.selectionStart.equalsRange(other.selectionStart)
		);
	}

	public hasSelection(): boolean {
		return (!this.selection.isEmpty() || !this.selectionStart.isEmpty());
	}

	public move(inSelectionMode: boolean, lineNumber: number, column: number, leftoverVisibleColumns: number): SingleCursorState {
		if (inSelectionMode) {
			// move just position
			return new SingleCursorState(
				this.selectionStart,
				this.selectionStartKind,
				this.selectionStartLeftoverVisibleColumns,
				new Position(lineNumber, column),
				leftoverVisibleColumns
			);
		} else {
			// move everything
			return new SingleCursorState(
				new EditorRange(lineNumber, column, lineNumber, column),
				SelectionStartKind.Simple,
				leftoverVisibleColumns,
				new Position(lineNumber, column),
				leftoverVisibleColumns
			);
		}
	}

	private static _computeSelection(selectionStart: EditorRange, position: Position): EditorSelection {
		if (selectionStart.isEmpty() || !position.isBeforeOrEqual(selectionStart.getStartPosition())) {
			return EditorSelection.fromPositions(selectionStart.getStartPosition(), position);
		} else {
			return EditorSelection.fromPositions(selectionStart.getEndPosition(), position);
		}
	}
}


export interface IEditOperationResult {
    type: EditOperationType;
    commands: Array<ICommand>;
    shouldPushStackElementBefore: boolean;
    shouldPushStackElementAfter: boolean;
}
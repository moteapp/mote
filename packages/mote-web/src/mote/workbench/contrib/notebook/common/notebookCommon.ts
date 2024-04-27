import { ICellRange } from "./notebookRange";
import { IRecordWithRole } from "./recordCommon";

export const NOTEBOOK_EDITOR_ID = 'workbench.editor.notebook';

export enum CellKind {
	Markup = 1,
	Code = 2
}

/**
 * A command that modifies text / cursor state on a model.
 */
export interface INotebookCommand {
}


export enum SelectionStateType {
	Handle = 0,
	Index = 1
}

export interface ISelectionHandleState {
	kind: SelectionStateType.Handle;
	primary: number | null;
	selections: number[];
}

export interface ISelectionIndexState {
	kind: SelectionStateType.Index;
	focus: ICellRange;
	selections: ICellRange[];
}

export type ISelectionState = ISelectionHandleState | ISelectionIndexState;

export const enum CellEditType {
	Replace = 1,
	Output = 2,
	Metadata = 3,
	CellLanguage = 4,
	DocumentMetadata = 5,
	Move = 6,
	OutputItems = 7,
	PartialMetadata = 8,
	PartialInternalMetadata = 9,
	Update,
	ListBefore,
    ListAfter,
    ListRemove
}

export interface ICellData {
	source: string;
	recordWithRole: IRecordWithRole;
}

//#region Notebook eventing

export enum NotebookCellsChangeType {
	ModelChange = 1,
	Move = 2,
	ChangeCellLanguage = 5,
	Initialize = 6,
	ChangeCellMetadata = 7,
	Output = 8,
	OutputItem = 9,
	ChangeCellContent = 10,
	ChangeDocumentMetadata = 11,
	ChangeCellInternalMetadata = 12,
	ChangeCellMime = 13,
	Unknown = 100
}

export interface NotebookCellContentChangeEvent {
	readonly kind: NotebookCellsChangeType.ChangeCellContent;
	readonly index: number;
}

export type NotebookRawContentEvent = (NotebookCellContentChangeEvent) & { transient: boolean };

//#endregion

//#region Edit

export type NotebookRecordModelChangedEvent = {
	readonly rawEvents: NotebookRawContentEvent[];
	readonly versionId: number;
	readonly synchronous: boolean | undefined;
	readonly endSelectionState: ISelectionState | undefined;
};

export interface ICellReplaceEdit {
	editType: CellEditType.Replace;
	index: number;
	count: number;
	cells: ICellData[];
}

export type ICellEditOperation = ICellReplaceEdit;

//#endregion

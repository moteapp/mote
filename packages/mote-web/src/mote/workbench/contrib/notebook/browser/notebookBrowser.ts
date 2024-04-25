import { Event } from 'vs/base/common/event';
import { MoteWindow } from 'mote/base/browser/window';
import { IEditorPaneWithSelection } from 'mote/workbench/common/editor';
import { ITextModel } from 'vs/editor/common/model';
import { ITextEditorOptions } from 'vs/platform/editor/common/editor';
import { NotebookOptions } from './notebookOptions';
import { NotebookLayoutInfo } from './notebookViewEvents';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { IDisposable } from 'vs/base/common/lifecycle';
import { FontInfo } from 'vs/editor/common/config/fontInfo';
import { IPosition } from 'vs/editor/common/core/position';
import { IRange, Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';

export interface INotebookViewModel {

}

export interface INotebookEditor {
    
	readonly notebookOptions: NotebookOptions;

	readonly isReadOnly: boolean;

	/**
	 * Focus the active cell in notebook cell grid
	 */
	focus(): void;

	hasEditorFocus(): boolean;

	getViewModel(): INotebookViewModel | undefined;

	getDomNode(): HTMLElement;

	/**
	 * Layout info for the notebook editor
	 */
	getLayoutInfo(): NotebookLayoutInfo;

	/**
	 * Reveal a range in notebook cell into viewport with minimal scrolling.
	 */
	revealRangeInViewAsync(cell: ICellViewModel, range: Selection | Range): Promise<void>;
}

/**
 * A mix of public interface and internal one (used by internal rendering code, e.g., cellRenderer)
 */
export interface INotebookEditorDelegate extends INotebookEditor {

	getBaseCellEditorOptions(): IBaseCellEditorOptions;
}

export interface IActiveNotebookEditorDelegate extends INotebookEditorDelegate {
}

export interface INotebookEditorPane extends IEditorPaneWithSelection {
	getControl(): INotebookEditor | undefined;
}

export interface INotebookEditorOptions extends ITextEditorOptions {
	
}

export interface INotebookEditorCreationOptions {
	readonly moteWindow?: MoteWindow;
	readonly options?: NotebookOptions;
}


//#region Cell Model

export interface ICellViewModel {
	
}

export interface IEditableCellViewModel extends ICellViewModel {
	textModel: ITextModel;
}


//#endregion

export interface IBaseCellEditorOptions extends IDisposable {
	readonly value: IEditorOptions;
	readonly onDidChange: Event<void>;
}

//#region Layout

export enum CellLayoutState {
	Uninitialized,
	Estimated,
	FromCache,
	Measured
}

export enum CellFocusMode {
	Container,
	Editor,
	Output,
	ChatInput
}

export interface MarkupCellLayoutInfo {
	readonly fontInfo: FontInfo | null;
	readonly editorWidth: number;
	readonly editorHeight: number;
	readonly statusBarHeight: number;
	readonly bottomToolbarOffset: number;
	readonly totalHeight: number;
	readonly layoutState: CellLayoutState;
	readonly foldHintHeight: number;
}

//#region 

export interface INotebookEditorViewState {
	
}
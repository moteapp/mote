import { Event } from 'vs/base/common/event';
import { MoteWindow } from 'mote/base/browser/window';
import { IEditorPane, IEditorPaneWithSelection } from 'mote/workbench/common/editor';
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
import { INotebookCommand, NOTEBOOK_EDITOR_ID } from '../common/notebookCommon';
import { isCompositeNotebookEditorInput } from '../common/notebookEditorInput';

export interface INotebookViewModel {

}

export interface IFocusNotebookCellOptions {
	readonly skipReveal?: boolean;
	readonly focusEditorLine?: number;
	//readonly revealBehavior?: ScrollToRevealBehavior | undefined;
	readonly outputId?: string;
	readonly altOutputId?: string;
	readonly outputWebviewFocused?: boolean;
}

export interface INotebookEditor {
    
	readonly notebookOptions: NotebookOptions;

	readonly isReadOnly: boolean;

	/**
	 * Focus the active cell in notebook cell grid
	 */
	focus(): void;

	hasEditorFocus(): boolean;

	hasModel(): this is IActiveNotebookEditor;
	getViewModel(): INotebookViewModel | undefined;
	getSelectionViewModels(): ICellViewModel[];

	getDomNode(): HTMLElement;

	/**
	 * Layout info for the notebook editor
	 */
	getLayoutInfo(): NotebookLayoutInfo;

	//#region Cell

	/**
	 * Get current active cell
	 */
	getActiveCell(): ICellViewModel | undefined;

	/**
	 * Focus the container of a cell (the monaco editor inside is not focused).
	 */
	focusNotebookCell(cell: ICellViewModel, focus: 'editor' | 'container' | 'output', options?: IFocusNotebookCellOptions): Promise<void>;


	//#endregion

	/**
	 * Execute multiple (concomitant) commands on the editor.
	 * @param source The source of the call.
	 * @param command The commands to execute
	 */
	executeCommands(source: string | null | undefined, commands: (INotebookCommand | null)[]): void;


	/**
	 * Reveal a range in notebook cell into viewport with minimal scrolling.
	 */
	revealRangeInViewAsync(cell: ICellViewModel, range: Selection | Range): Promise<void>;
}

export interface IActiveNotebookEditor extends INotebookEditor {
	getViewModel(): INotebookViewModel;
	getCellIndex(cell: ICellViewModel): number;
}

/**
 * A mix of public interface and internal one (used by internal rendering code, e.g., cellRenderer)
 */
export interface INotebookEditorDelegate extends INotebookEditor {
	setActiveCell(cell: ICellViewModel | null): void;
	getBaseCellEditorOptions(): IBaseCellEditorOptions;
}

export interface IActiveNotebookEditorDelegate extends INotebookEditorDelegate {
	getViewModel(): INotebookViewModel;
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
	id: string;
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

export function getNotebookEditorFromEditorPane(editorPane?: IEditorPane): INotebookEditor | undefined {
	if (!editorPane) {
		return;
	}

	if (editorPane.getId() === NOTEBOOK_EDITOR_ID) {
		return editorPane.getControl() as INotebookEditor | undefined;
	}

	const input = editorPane.input;

	if (input && isCompositeNotebookEditorInput(input)) {
		return (editorPane.getControl() as { notebookEditor: INotebookEditor | undefined } | undefined)?.notebookEditor;
	}

	return undefined;
}
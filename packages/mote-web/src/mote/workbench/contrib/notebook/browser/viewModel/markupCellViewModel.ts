import { NotebookCellTextModel } from 'mote/workbench/contrib/notebook/common/model/notebookCellTextModel';
import { BaseCellViewModel } from './baseCellViewModel';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { NotebookLayoutInfo } from '../notebookViewEvents';
import { NotebookViewContext } from './notebookViewContext';
import { CellFocusMode, CellLayoutState, MarkupCellLayoutInfo } from '../notebookBrowser';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IDisposable, dispose } from 'vs/base/common/lifecycle';

export class MarkupCellViewModel extends BaseCellViewModel {

    constructor(
        viewType: string,
        model: NotebookCellTextModel,
        initialNotebookLayoutInfo: NotebookLayoutInfo | null,
        readonly viewContext: NotebookViewContext,
        @ITextModelService textModelService: ITextModelService,
    ) {
        super(viewType, model, textModelService);

        const bottomToolbarGap = 0;

        this._layoutInfo = {
			editorHeight: 0,
			fontInfo: initialNotebookLayoutInfo?.fontInfo || null,
			editorWidth: initialNotebookLayoutInfo?.width
				? this.viewContext.notebookOptions.computeMarkdownCellEditorWidth(initialNotebookLayoutInfo.width)
				: 0,
			bottomToolbarOffset: bottomToolbarGap,
			totalHeight: 100,
			layoutState: CellLayoutState.Uninitialized,
			foldHintHeight: 0,
			statusBarHeight: 0
		};
    }

	//#region Properties

    private _layoutInfo: MarkupCellLayoutInfo;
    get layoutInfo() {
		return this._layoutInfo;
	}

    private _editorHeight = 0;
	private _statusBarHeight = 0;
	set editorHeight(newHeight: number) {
		this._editorHeight = newHeight;
		//this._statusBarHeight = this.viewContext.notebookOptions.computeStatusBarHeight();
		//this._updateTotalHeight(this._computeTotalHeight());
	}

	private _focusMode: CellFocusMode = CellFocusMode.Container;
	get focusMode() {
		return this._focusMode;
	}
	set focusMode(newMode: CellFocusMode) {
		if (this._focusMode !== newMode) {
			this._focusMode = newMode;
			this._onDidChangeState.fire({ focusModeChanged: true });
		}
	}

	//#endregion

    private _computeTotalHeight(): number {
        return this._editorHeight
    }

    //#region Editor

    protected _textEditor?: ICodeEditor;
	get editorAttached(): boolean {
		return !!this._textEditor;
	}

    private _editorListeners: IDisposable[] = [];
    attachTextEditor(editor: ICodeEditor, estimatedHasHorizontalScrolling?: boolean) {
        if (!editor.hasModel()) {
			throw new Error('Invalid editor: model is missing');
		}

		if (this._textEditor === editor) {
			if (this._editorListeners.length === 0) {
				this._editorListeners.push(this._textEditor.onDidChangeCursorSelection(() => { this._onDidChangeState.fire({ selectionChanged: true }); }));
				// this._editorListeners.push(this._textEditor.onKeyDown(e => this.handleKeyDown(e)));
				this._onDidChangeState.fire({ selectionChanged: true });
			}
			return;
		}

		this._textEditor = editor;

        this._onDidChangeState.fire({ selectionChanged: true });
		this._onDidChangeEditorAttachState.fire();
    }

	detachTextEditor() {
		this._textEditor = undefined;
		dispose(this._editorListeners);
		this._editorListeners = [];
		this._onDidChangeEditorAttachState.fire();

		if (this._textModelRef) {
			this._textModelRef.dispose();
			this._textModelRef = undefined;
		}

		this._textModelRefChangeDisposable.clear();
	}

    //#endregion

    protected onDidChangeTextModelContent(): void {
        
    }
}
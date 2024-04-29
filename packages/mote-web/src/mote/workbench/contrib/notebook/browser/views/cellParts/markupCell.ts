import * as DOM from 'vs/base/browser/dom';
import { Disposable, DisposableStore, MutableDisposable } from 'vs/base/common/lifecycle';
import { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditor/codeEditorWidget';
import { CellFocusMode, IActiveNotebookEditorDelegate } from 'mote/workbench/contrib/notebook/browser/notebookBrowser';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { EditorContextKeys } from 'vs/editor/common/editorContextKeys';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { MarkdownCellRenderTemplate } from '../notebookRenderingCommon';
import { MarkupCellViewModel } from 'mote/workbench/contrib/notebook/browser/viewModel/markupCellViewModel';
import { CancellationTokenSource } from 'vs/base/common/cancellation';
import { raceCancellation } from 'vs/base/common/async';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { CellEditorOptions } from './cellEditorOptions';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { KeyCode } from 'vs/base/common/keyCodes';

export class MarkupCell extends Disposable {

    private cellEditorOptions: CellEditorOptions;
    private editorOptions: IEditorOptions;
    private editor: CodeEditorWidget | null = null;

    private readonly localDisposables = this._register(new DisposableStore());
	private readonly focusSwitchDisposable = this._register(new MutableDisposable());
    private readonly editorDisposables = this._register(new DisposableStore());

    private editorPart: HTMLElement;

    constructor(
        private readonly viewCell: MarkupCellViewModel,
        private readonly templateData: MarkdownCellRenderTemplate,
		private readonly notebookEditor: IActiveNotebookEditorDelegate,
        @IContextKeyService private readonly contextKeyService: IContextKeyService,
        @IInstantiationService private readonly instantiationService: IInstantiationService,
        @IConfigurationService private configurationService: IConfigurationService,
    ) {
        super();

        this.editorPart = templateData.editorPart;
        this.cellEditorOptions = this._register(new CellEditorOptions(this.notebookEditor.getBaseCellEditorOptions(), this.notebookEditor.notebookOptions, this.configurationService));
        this.editorOptions = {
            ...this.cellEditorOptions.getDefaultValue(),
            lineNumbers: 'off',
            scrollbar: {
                horizontal: 'hidden',
                vertical: 'hidden',
            },
            wordWrap: 'on',
        };

        this.viewUpdate();
    }

    private viewUpdate(): void {
        this.viewUpdateEditing();
    }

    private viewUpdateEditing(): void {

        let editorHeight: number;

        DOM.show(this.editorPart);

        if (this.editor && this.editor.hasModel()) {
            editorHeight = this.editor.getContentHeight();

            // not first time, we don't need to create editor
			this.viewCell.attachTextEditor(this.editor);
            this.focusEditorIfNeeded();

            this.bindEditorListeners(this.editor);

            this.editor.layout({
				width: this.viewCell.layoutInfo.editorWidth,
				height: editorHeight
			});
        } else {
            const width = this.notebookEditor.notebookOptions.computeMarkdownCellEditorWidth(this.notebookEditor.getLayoutInfo().width);
			const lineNum = 8;//this.viewCell.lineCount;
			const lineHeight = this.viewCell.layoutInfo.fontInfo?.lineHeight || 17;
			const editorPadding = {
                top: 12,
                bottom: 12
            }; //this.notebookEditor.notebookOptions.computeEditorPadding(this.viewCell.internalMetadata, this.viewCell.uri);
			editorHeight = Math.max(lineNum, 1) * lineHeight + editorPadding.top + editorPadding.bottom;

            // create a special context key service that set the inCompositeEditor-contextkey
			const editorContextKeyService = this.contextKeyService.createScoped(this.editorPart);
			EditorContextKeys.inCompositeEditor.bindTo(editorContextKeyService).set(true);
            const editorInstaService = this.instantiationService.createChild(new ServiceCollection([IContextKeyService, editorContextKeyService]));
			this.editorDisposables.add(editorContextKeyService);

            this.editor = this.editorDisposables.add(editorInstaService.createInstance(CodeEditorWidget, this.editorPart, {
                ...this.editorOptions,
                dimension: {
					width: width,
					height: editorHeight
				},
            }, {

            }));

            const cts = new CancellationTokenSource();
			this.editorDisposables.add({ dispose() { cts.dispose(true); } });
			raceCancellation(this.viewCell.resolveTextModel(), cts.token).then(model => {
				if (!model) {
					return;
				}

				this.editor!.setModel(model);
                /*
				model.updateOptions({
					indentSize: this.cellEditorOptions.indentSize,
					tabSize: this.cellEditorOptions.tabSize,
					insertSpaces: this.cellEditorOptions.insertSpaces,
				});
                */

				const realContentHeight = this.editor!.getContentHeight();
				if (realContentHeight !== editorHeight) {
					this.editor!.layout(
						{
							width: width,
							height: realContentHeight
						}
					);
					editorHeight = realContentHeight;
				}

				this.viewCell.attachTextEditor(this.editor!);

				this.focusEditorIfNeeded();

				this.bindEditorListeners(this.editor!);

				this.viewCell.editorHeight = editorHeight;
			});
        }
    }

    private updateForFocusModeChange() {
		if (this.viewCell.focusMode === CellFocusMode.Editor) {
			this.focusEditorIfNeeded();
		}

		this.templateData.container.classList.toggle('cell-editor-focus', this.viewCell.focusMode === CellFocusMode.Editor);
	}

    private focusEditorIfNeeded() {
		this.viewCell.focusMode = CellFocusMode.Editor;
        if (this.viewCell.focusMode === CellFocusMode.Editor &&
			(this.notebookEditor.hasEditorFocus() || this.notebookEditor.getDomNode().ownerDocument.activeElement === this.notebookEditor.getDomNode().ownerDocument.body)
		) { // Don't steal focus from other workbench parts, but if body has focus, we can take it
			if (!this.editor) {
				return;
			}

			this.editor.focus();

			const primarySelection = this.editor.getSelection();
			if (!primarySelection) {
				return;
			}

			this.notebookEditor.revealRangeInViewAsync(this.viewCell, primarySelection);
		}
    }

    private bindEditorListeners(editor: CodeEditorWidget) {
        this.localDisposables.clear();
		this.focusSwitchDisposable.clear();

		this.localDisposables.add(editor.onDidContentSizeChange(e => {
			if (e.contentHeightChanged) {
				this.onCellEditorHeightChange(editor, e.contentHeight);
			}
		}));

		this.localDisposables.add(editor.onKeyDown(e => {
			if (e.keyCode === KeyCode.Enter) {
				e.stopPropagation();
				e.preventDefault();
				this.onLineBreakInsert();
			}
		}));
    }

	private onLineBreakInsert() {
		//this.notebookEditor.;
	}

    private onCellEditorHeightChange(editor: CodeEditorWidget, newHeight: number): void {
		const viewLayout = editor.getLayoutInfo();
		this.viewCell.editorHeight = newHeight;
		editor.layout(
			{
				width: viewLayout.width,
				height: newHeight
			}
		);
	}

    private _isDisposed: boolean = false;
    override dispose() {
		this._isDisposed = true;

        this.viewCell.detachTextEditor();
		super.dispose();
    }
}
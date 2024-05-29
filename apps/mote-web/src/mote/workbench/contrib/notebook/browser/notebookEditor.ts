import * as DOM from 'vs/base/browser/dom';
import { EditorPane } from 'mote/workbench/browser/parts/editor/editorPane';
import { INotebookEditorOptions, INotebookEditorPane } from 'mote/workbench/contrib/notebook/browser/notebookBrowser';
import { IEditorOpenContext, IEditorPaneScrollPosition, IEditorPaneSelection, IEditorPaneSelectionChangeEvent, IEditorPaneWithScrolling } from 'mote/workbench/common/editor';
import { NOTEBOOK_EDITOR_ID } from 'mote/workbench/contrib/notebook/common/notebookCommon';
import { IEditorGroup } from 'mote/workbench/services/editor/common/editorGroupsService';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { generateUuid } from 'vs/base/common/uuid';
import { Emitter } from 'vs/base/common/event';
import { NotebookEditorWidget } from './notebookEditorWidget';
import { NotebookEditorInput } from 'mote/workbench/contrib/notebook/common/notebookEditorInput';
import { CancellationToken } from 'vs/base/common/cancellation';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { MutableDisposable } from 'vs/base/common/lifecycle';
import { EditorInput } from 'mote/workbench/common/editor/editorInput';

export class NotebookEditor extends EditorPane implements INotebookEditorPane, IEditorPaneWithScrolling {

    static readonly ID: string = NOTEBOOK_EDITOR_ID;

    private readonly _onDidChangeSelection = this._register(new Emitter<IEditorPaneSelectionChangeEvent>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;

	protected readonly _onDidChangeScroll = this._register(new Emitter<void>());
	readonly onDidChangeScroll = this._onDidChangeScroll.event;

	private readonly _inputListener = this._register(new MutableDisposable());

    override get minimumWidth(): number { return 220; }
	override get maximumWidth(): number { return Number.POSITIVE_INFINITY; }

	// these setters need to exist because this extends from EditorPane
	override set minimumWidth(value: number) { /*noop*/ }
	override set maximumWidth(value: number) { /*noop*/ }

    private _rootElement!: HTMLElement;
    private _widget: NotebookEditorWidget | undefined;
    private _pagePosition?: { readonly dimension: DOM.Dimension; readonly position: DOM.IDomPosition };


    constructor(
		group: IEditorGroup,
        @ITelemetryService telemetryService: ITelemetryService,
        @IThemeService themeService: IThemeService,
        @IStorageService storageService: IStorageService,
        @IInstantiationService private readonly instantiationService: IInstantiationService,
    ) {
        super(NotebookEditor.ID, group, telemetryService, themeService, storageService);
    }

	//#region Lifecycle

    protected createEditor(parent: HTMLElement): void {
		this._rootElement = DOM.append(parent, DOM.$('.notebook-editor'));
		this._rootElement.id = `notebook-editor-element-${generateUuid()}`;
	}

    override async setInput(input: NotebookEditorInput, options: INotebookEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken, noRetry?: boolean): Promise<void> {

        this._widget = this.instantiationService.createInstance(NotebookEditorWidget, {}, this._pagePosition?.dimension);

        if (this._rootElement && this._widget!.getDomNode()) {
            this._rootElement.setAttribute('aria-flowto', this._widget!.getDomNode().id || '');
            DOM.setParentFlowTo(this._widget!.getDomNode(), this._rootElement);
        }

        if (this._pagePosition) {
            this._widget!.layout(this._pagePosition.dimension, this._rootElement, this._pagePosition.position);
        }

        // only now `setInput` and yield/await. this is AFTER the actual widget is ready. This is very important
        // so that others synchronously receive a notebook editor with the correct widget being set
        await super.setInput(input, options, context, token);
		const model = await input.resolve();

		this._widget.setModel(model.notebook);
    }

	override clearInput(): void {
		this._inputListener.clear();

		if (this._widget) {
			this._saveEditorViewState(this.input);
			this._widget.onWillHide();
		}
		super.clearInput();
	}

	private _saveEditorViewState(input: EditorInput | undefined): void {
		if (this._widget && input instanceof NotebookEditorInput) {
			if (this._widget.isDisposed) {
				return;
			}

			const state = this._widget.getEditorViewState();
			//this._editorMemento.saveEditorState(this.group, input.resource, state);
		}
	}

	//#endregion

    override getControl(): NotebookEditorWidget | undefined {
		return this._widget;
	}

    getSelection(): IEditorPaneSelection | undefined {
        return undefined;
    }

    getScrollPosition(): IEditorPaneScrollPosition {
		const widget = this.getControl();
		if (!widget) {
			throw new Error('Notebook widget has not yet been initialized');
		}

		return {
			scrollTop: widget.scrollTop,
			scrollLeft: 0,
		};
	}

	setScrollPosition(scrollPosition: IEditorPaneScrollPosition): void {
		const editor = this.getControl();
		if (!editor) {
			throw new Error('Control has not yet been initialized');
		}

		editor.setScrollTop(scrollPosition.scrollTop);
	}

    layout(dimension: DOM.Dimension, position: DOM.IDomPosition): void {
		this._rootElement.classList.toggle('mid-width', dimension.width < 1000 && dimension.width >= 600);
		this._rootElement.classList.toggle('narrow-width', dimension.width < 600);
		this._pagePosition = { dimension, position };

        if (!this._widget || !(this.input instanceof NotebookEditorInput)) {
			return;
		}

		if (this.isVisible()) {
			this._widget.layout(dimension, this._rootElement, position);
		}
    }
}
import * as DOM from 'vs/base/browser/dom';
import { Disposable, DisposableStore, dispose } from 'vs/base/common/lifecycle';
import { IActiveNotebookEditorDelegate, IBaseCellEditorOptions, ICellViewModel, INotebookEditor, INotebookEditorCreationOptions, INotebookEditorDelegate, INotebookEditorViewState } from 'mote/workbench/contrib/notebook/browser/notebookBrowser';
import { ILayoutService } from 'mote/platform/layout/browser/layoutService';
import { generateUuid } from 'vs/base/common/uuid';
import { Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';
import { Root, createRoot } from 'react-dom/client';
import * as React from 'react';
import { NotebookGirdLayout } from './views/notebookGridLayout';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { IContextKey, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { MarkupCellRenderer } from './views/renderers/cellRenderers';
import { NotebookViewModel } from './viewModel/notebookViewModel';
import { NotebookOptions } from './notebookOptions';
import { BaseCellEditorOptions } from './viewModel/baseCellEditorOptions';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { NotebookViewContext } from './viewModel/notebookViewContext';
import { NotebookEventDispatcher } from './viewModel/notebookEventDispatcher';
import { NOTEBOOK_EDITOR_FOCUSED } from '../common/notebookContextKeys';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { INotebookCommand } from '../common/notebookCommon';

export class NotebookEditorWidget extends Disposable implements INotebookEditor, INotebookEditorDelegate {

    private _overlayContainer: HTMLElement;
    private _body!: HTMLElement;

    private _dimension?: DOM.Dimension;
	private _position?: DOM.IDomPosition;
	private _shadowElement?: HTMLElement;
	private _shadowElementViewInfo: { height: number; width: number; top: number; left: number } | null = null;

	//#region Context Keys

	private readonly _editorFocus: IContextKey<boolean>;

	//#endregion

	private readonly _localStore: DisposableStore = this._register(new DisposableStore());
	private _localCellStateListeners: DisposableStore[] = [];

	private _viewContext: NotebookViewContext;
	private _renderedEditors: Map<ICellViewModel, ICodeEditor> = new Map();

    private root!: Root;
    public readonly scopedContextKeyService: IContextKeyService;
    private readonly instantiationService: IInstantiationService;

    constructor(
		readonly creationOptions: INotebookEditorCreationOptions,
		dimension: DOM.Dimension | undefined,
        @IContextKeyService contextKeyService: IContextKeyService,
        @IInstantiationService instantiationService: IInstantiationService,
        @ILayoutService private readonly layoutService: ILayoutService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
    ) {
        super();

		this._dimension = dimension;
		this._notebookOptions = creationOptions.options ?? new NotebookOptions();

		const eventDispatcher = this._register(new NotebookEventDispatcher());
		this._viewContext = new NotebookViewContext(
			this._notebookOptions,
			eventDispatcher,
			() => this.getBaseCellEditorOptions()
		);

        const container = creationOptions.moteWindow ? this.layoutService.getContainer(creationOptions.moteWindow) : this.layoutService.mainContainer;

        this._overlayContainer = document.createElement('div');
        this.scopedContextKeyService = this._register(contextKeyService.createScoped(this._overlayContainer));
        this.instantiationService = instantiationService.createChild(new ServiceCollection([IContextKeyService, this.scopedContextKeyService]));


        const id = generateUuid();
		this._overlayContainer.id = `notebook-${id}`;
		this._overlayContainer.className = 'notebookOverlay';
		this._overlayContainer.classList.add('notebook-editor');
		this._overlayContainer.inert = true;
		this._overlayContainer.style.visibility = 'hidden';

		container.appendChild(this._overlayContainer);

		this._editorFocus = NOTEBOOK_EDITOR_FOCUSED.bindTo(this.scopedContextKeyService);
    
        this.createBody(this._overlayContainer);

    }

    private createBody(parent: HTMLElement): void {
        this._body = document.createElement('div');
		DOM.append(parent, this._body);
        this._body.className = 'cell-grid-container';

        this.createCellGrid();
    }

	private renderer!: MarkupCellRenderer;
    private createCellGrid() {
        const getScopedContextKeyService = (container: HTMLElement) => this.scopedContextKeyService.createScoped(container);
        this.renderer = this.instantiationService.createInstance(MarkupCellRenderer, this, getScopedContextKeyService);

		this._focusTracker = this._register(DOM.trackFocus(this.getDomNode()));

        this.root = createRoot(this._body);
    }

    getDomNode() {
		return this._overlayContainer;
	}

	//#region Properties

	private _isVisible = false;
	get isVisible() {
		return this._isVisible;
	}

	get isReadOnly() {
		return false;
	}

	hasModel(): this is IActiveNotebookEditorDelegate {
		return !!this._notebookViewModel;
	}

	getViewModel(): NotebookViewModel | undefined {
		return this.viewModel;
	}

	hasEditorFocus() {
		// _editorFocus is driven by the FocusTracker, which is only guaranteed to _eventually_ fire blur.
		// If we need to know whether we have focus at this instant, we need to check the DOM manually.
		this.updateEditorFocus();
		return this.editorHasDomFocus();
	}

	private editorHasDomFocus(): boolean {
		return DOM.isAncestorOfActiveElement(this.getDomNode());
	}

	private _focusTracker!: DOM.IFocusTracker;
	updateEditorFocus() {
		// Note - focus going to the webview will fire 'blur', but the webview element will be
		// a descendent of the notebook editor root.
		this._focusTracker.refreshState();
		const focused = this.editorHasDomFocus();
		this._editorFocus.set(focused);
		this.viewModel?.setEditorFocus(focused);
	}

	//#endregion

    //#region INotebookEditorDelegate

	private readonly _notebookOptions: NotebookOptions;
	get notebookOptions() {
		return this._notebookOptions;
	}

	private _baseCellEditorOptions: IBaseCellEditorOptions | undefined;
	getBaseCellEditorOptions(): IBaseCellEditorOptions {
		const existingOptions = this._baseCellEditorOptions;

		if (existingOptions) {
			return existingOptions;
		} else {
			const options = new BaseCellEditorOptions(this, this.notebookOptions, this.configurationService);
			this._baseCellEditorOptions = options;
			return options;
		}
	}

    private _notebookViewModel: NotebookViewModel | undefined;
    set viewModel(newModel: NotebookViewModel | undefined) {
		//this._onWillChangeModel.fire(this._notebookViewModel?.notebookDocument);
		this._notebookViewModel = newModel;
		//this._onDidChangeModel.fire(newModel?.notebookDocument);
	}

    get viewModel() {
		return this._notebookViewModel;
	}

    async setModel(): Promise<void> {
		this._detachModel();
		this._attachModel();
    }

	private async _attachModel() {
		this.viewModel = this.instantiationService.createInstance(NotebookViewModel, this._viewContext, this.getLayoutInfo());
		// model attached
		this._localCellStateListeners = this.viewModel.viewCells.map(cell => this._bindCellListener(cell));

		this.root.render(React.createElement(NotebookGirdLayout, {markUpCellRenderer: this.renderer, notebookEditor: this, cells: this.viewModel?.viewCells || []}));
	}

	private _bindCellListener(cell: ICellViewModel) {
		const store = new DisposableStore();
		return store;
	}

	private _detachModel() {
		this._localStore.clear();
		dispose(this._localCellStateListeners);
		this.viewModel?.dispose();
		// avoid event
		this.viewModel = undefined;
	}

    //#endregion

	//#region Interactive

	executeCommands(source: string | null | undefined, commands: (INotebookCommand | null)[]): void {
		this.viewModel?.executeCommands(source, commands);
	}

	async revealRangeInViewAsync(cell: ICellViewModel, range: Selection | Range): Promise<void> {

	}

	//#endregion

	//#region Lifecycle

	private _isDisposed: boolean = false;

	get isDisposed() {
		return this._isDisposed;
	}

	onWillHide() {
		this._isVisible = false;
		this._editorFocus.set(false);
		this._overlayContainer.inert = true;
		this._overlayContainer.style.visibility = 'hidden';
		this._overlayContainer.style.left = '-50000px';
		//this._notebookTopToolbarContainer.style.display = 'none';
		this.clearActiveCellWidgets();
	}

	private clearActiveCellWidgets() {
		this._renderedEditors.forEach((editor, cell) => {
			/*
			if (this.getActiveCell() === cell && editor) {
				
				SuggestController.get(editor)?.cancelSuggestWidget();
				DropIntoEditorController.get(editor)?.clearWidgets();
				CopyPasteController.get(editor)?.clearWidgets();
				
			}
			*/
		});
	}

	//#endregion

	//#region Layout

	getEditorViewState(): INotebookEditorViewState {
		return {

		};
	}

    private getBodyHeight(dimensionHeight: number) {
        return dimensionHeight;
    }

    getLayoutInfo() {
        return {
			width: this._dimension?.width ?? 0,
			height: this._dimension?.height ?? 0,
			//scrollHeight: this._list?.getScrollHeight() ?? 0,
			//fontInfo: this._fontInfo!,
			stickyHeight: 0 //this._notebookStickyScroll?.getCurrentStickyHeight() ?? 0
		} as any;
    }

    layout(dimension: DOM.Dimension, shadowElement?: HTMLElement, position?: DOM.IDomPosition): void {
        if (!shadowElement && this._shadowElementViewInfo === null) {
			this._dimension = dimension;
			this._position = position;
			return;
		}

		if (dimension.width <= 0 || dimension.height <= 0) {
			this.onWillHide();
			return;
		}

        if (shadowElement) {
			this.updateShadowElement(shadowElement, dimension, position);
		}

        this._dimension = dimension;
		this._position = position;
		const newBodyHeight = this.getBodyHeight(dimension.height) - this.getLayoutInfo().stickyHeight;
		DOM.size(this._body, dimension.width, newBodyHeight);

        this._overlayContainer.inert = false;
		this._overlayContainer.style.visibility = 'visible';
		this._overlayContainer.style.display = 'block';
		this._overlayContainer.style.position = 'absolute';
		this._overlayContainer.style.overflow = 'hidden';

		this.layoutContainerOverShadowElement(dimension, position);
    }

    private updateShadowElement(shadowElement: HTMLElement, dimension?: DOM.IDimension, position?: DOM.IDomPosition) {
		this._shadowElement = shadowElement;
		if (dimension && position) {
			this._shadowElementViewInfo = {
				height: dimension.height,
				width: dimension.width,
				top: position.top,
				left: position.left,
			};
		} else {
			// We have to recompute position and size ourselves (which is slow)
			const containerRect = shadowElement.getBoundingClientRect();
			this._shadowElementViewInfo = {
				height: containerRect.height,
				width: containerRect.width,
				top: containerRect.top,
				left: containerRect.left
			};
		}
	}

    private layoutContainerOverShadowElement(dimension?: DOM.Dimension, position?: DOM.IDomPosition): void {
		if (dimension && position) {
			this._overlayContainer.style.top = `${position.top}px`;
			this._overlayContainer.style.left = `${position.left}px`;
			this._overlayContainer.style.width = `${dimension.width}px`;
			this._overlayContainer.style.height = `${dimension.height}px`;
			return;
		}

		if (!this._shadowElementViewInfo) {
			return;
		}

		const elementContainerRect = this._overlayContainer.parentElement?.getBoundingClientRect();
		this._overlayContainer.style.top = `${this._shadowElementViewInfo.top - (elementContainerRect?.top || 0)}px`;
		this._overlayContainer.style.left = `${this._shadowElementViewInfo.left - (elementContainerRect?.left || 0)}px`;
		this._overlayContainer.style.width = `${dimension ? dimension.width : this._shadowElementViewInfo.width}px`;
		this._overlayContainer.style.height = `${dimension ? dimension.height : this._shadowElementViewInfo.height}px`;
	}

	//#endregion

	//#region Focus tracker

	focus() {
		this._isVisible = true;
		this._editorFocus.set(true);
	}

	onShow() {
		this._isVisible = true;
	}

	//#endregion
}
import * as DOM from 'vs/base/browser/dom';
import { CellEditorOptions } from 'mote/workbench/contrib/notebook/browser/views/cellParts/cellEditorOptions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { INotebookEditorDelegate } from 'mote/workbench/contrib/notebook/browser/notebookBrowser';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IMenuService } from 'vs/platform/actions/common/actions';
import { MarkdownCellRenderTemplate } from 'mote/workbench/contrib/notebook/browser/views/notebookRenderingCommon';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { IContextKeyService, IScopedContextKeyService } from 'vs/platform/contextkey/common/contextkey';

abstract class AbstractCellRenderer {
	protected readonly editorOptions: CellEditorOptions;

    constructor(
        protected readonly notebookEditor: INotebookEditorDelegate,
		protected readonly instantiationService: IInstantiationService,
		protected readonly contextMenuService: IContextMenuService,
		protected readonly menuService: IMenuService,
        protected readonly contextKeyServiceProvider: (container: HTMLElement) => IScopedContextKeyService,
    ) {
        this.editorOptions = new CellEditorOptions({} as any);
    }
}

export class MarkupCellRenderer extends AbstractCellRenderer {

    static readonly TEMPLATE_ID = 'markup';

    constructor(
        notebookEditor: INotebookEditorDelegate,
        contextKeyServiceProvider: (container: HTMLElement) => IScopedContextKeyService,
        @IInstantiationService instantiationService: IInstantiationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IMenuService menuService: IMenuService,
    ) {
        super(notebookEditor, instantiationService, contextMenuService, menuService, contextKeyServiceProvider);
    }

    get templateId() {
		return MarkupCellRenderer.TEMPLATE_ID;
	}

    renderTemplate(rootContainer: HTMLElement): MarkdownCellRenderTemplate {
        rootContainer.classList.add('markdown-cell-row');
		const container = DOM.append(rootContainer, DOM.$('.cell-inner-container'));
		const templateDisposables = new DisposableStore();
        const contextKeyService = templateDisposables.add(this.contextKeyServiceProvider(container));

        const focusIndicatorTop = new FastDomNode(DOM.append(container, DOM.$('.cell-focus-indicator.cell-focus-indicator-top')));
		const focusIndicatorLeft = new FastDomNode(DOM.append(container, DOM.$('.cell-focus-indicator.cell-focus-indicator-side.cell-focus-indicator-left')));
		const foldingIndicator = DOM.append(focusIndicatorLeft.domNode, DOM.$('.notebook-folding-indicator'));
		const focusIndicatorRight = new FastDomNode(DOM.append(container, DOM.$('.cell-focus-indicator.cell-focus-indicator-side.cell-focus-indicator-right')));

        const codeInnerContent = DOM.append(container, DOM.$('.cell.code'));
		const editorPart = DOM.append(codeInnerContent, DOM.$('.cell-editor-part'));
        const editorContainer = DOM.append(editorPart, DOM.$('.cell-editor-container'));
		editorPart.style.display = 'none';
        const innerContent = DOM.append(container, DOM.$('.cell.markdown'));

        const scopedInstaService = this.instantiationService.createChild(new ServiceCollection([IContextKeyService, contextKeyService]));

        const templateData: MarkdownCellRenderTemplate = {
            rootContainer,
            container,
            editorPart,
            editorContainer,
            foldingIndicator,
            cellContainer: innerContent,
            instantiationService: scopedInstaService,
        };

        return templateData;
    }
}
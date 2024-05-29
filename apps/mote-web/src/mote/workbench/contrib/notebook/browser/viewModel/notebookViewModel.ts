import { Disposable } from 'vs/base/common/lifecycle';
import { ICellViewModel, INotebookViewModel } from 'mote/workbench/contrib/notebook/browser/notebookBrowser';
import { MarkupCellViewModel } from './markupCellViewModel';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { NotebookCellTextModel } from 'mote/workbench/contrib/notebook/common/model/notebookCellTextModel';
import { URI } from 'mote/workbench/workbench.web.main';
import { IModelService } from 'vs/editor/common/services/model';
import { NotebookLayoutInfo } from '../notebookViewEvents';
import { NotebookViewContext } from './notebookViewContext';
import { generateUuid } from 'vs/base/common/uuid';
import { INotebookCommand } from 'mote/workbench/contrib/notebook/common/notebookCommon';
import { NotebookRecordModel } from 'mote/workbench/contrib/notebook/common/model/notebookRecordModel';
import { NotebookCellSelectionCollection } from './cellSelectionCollection';

export interface NotebookViewModelOptions {
	isReadOnly: boolean;
}

export class NotebookViewModel extends Disposable implements INotebookViewModel {

    private _viewCells: CellViewModel[] = [];
    get viewCells(): ICellViewModel[] {
		return this._viewCells;
	}

    constructor(
        private _notebook: NotebookRecordModel,
        private _viewContext: NotebookViewContext,
        private _layoutInfo: NotebookLayoutInfo | null,
        private _options: NotebookViewModelOptions,
        @IModelService private readonly modelService: IModelService,
        @IInstantiationService private readonly instantiationService: IInstantiationService,
    ) {
        super();
    }

    get options(): NotebookViewModelOptions { return this._options; }

    get document() {
		return this._notebook;
	}

    get layoutInfo(): NotebookLayoutInfo | null {
		return this._layoutInfo;
	}

    private _focused: boolean = true;

	get focused() {
		return this._focused;
	}

    setEditorFocus(focused: boolean) {
		this._focused = focused;
	}

    private createViewCell(id: string) {
        const uri = URI.from({ scheme: 'block', path: id });
        const textModel = this.modelService.createModel('', null, uri, false);
        const cellTextModel = this.instantiationService.createInstance(NotebookCellTextModel, uri, '');
        cellTextModel.textModel = textModel as any;
        const cell = this.instantiationService.createInstance(MarkupCellViewModel, 'notebook', cellTextModel, this._layoutInfo, this._viewContext);
        return cell;
    }

    //#region Properties

    private _selectionCollection = this._register(new NotebookCellSelectionCollection());
    getSelections() {
		return this._selectionCollection.selections;
	}

    getFocus() {
		return this._selectionCollection.focus;
	}

    getCellIndex(cell: ICellViewModel) {
		return this._viewCells.indexOf(cell as CellViewModel);
	}

    //#endregion

    //#region cursor operations

    /**
	 * Execute multiple (concomitant) commands on the editor.
	 * @param source The source of the call.
	 * @param command The commands to execute
	 */
	executeCommands(source: string | null | undefined, commands: (INotebookCommand | null)[]): void {

    }

    //#endregion
}


export type CellViewModel = ( MarkupCellViewModel) & ICellViewModel;
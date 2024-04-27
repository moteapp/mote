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

export class NotebookViewModel extends Disposable implements INotebookViewModel {

    private _viewCells: CellViewModel[] = [];
    get viewCells(): ICellViewModel[] {
		return this._viewCells;
	}

    constructor(
        private _viewContext: NotebookViewContext,
        private _layoutInfo: NotebookLayoutInfo | null,
        @IModelService private readonly modelService: IModelService,
        @IInstantiationService private readonly instantiationService: IInstantiationService,
    ) {
        super();

        const id = generateUuid();
        this._viewCells.push(this.createViewCell(id));
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
        const uri = URI.from({ scheme: 'untitled', path: id });
        const textModel = this.modelService.createModel('', null, uri, false);
        const cellTextModel = this.instantiationService.createInstance(NotebookCellTextModel, uri, '');
        cellTextModel.textModel = textModel as any;
        const cell = this.instantiationService.createInstance(MarkupCellViewModel, 'notebook', cellTextModel, this._layoutInfo, this._viewContext);
        return cell;
    }

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
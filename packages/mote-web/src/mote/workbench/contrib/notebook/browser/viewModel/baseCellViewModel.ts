import { Disposable, IReference, MutableDisposable } from 'vs/base/common/lifecycle';
import * as model from 'vs/editor/common/model';
import { NotebookCellTextModel } from 'mote/workbench/contrib/notebook/common/model/notebookCellTextModel';
import { IResolvedTextEditorModel, ITextModelService } from 'vs/editor/common/services/resolverService';
import { IEditableCellViewModel } from '../notebookBrowser';
import { Event, Emitter } from 'vs/base/common/event';
import { CellViewModelStateChangeEvent } from '../notebookViewEvents';

export abstract class BaseCellViewModel extends Disposable {

	protected readonly _onDidChangeEditorAttachState = this._register(new Emitter<void>());
	// Do not merge this event with `onDidChangeState` as we are using `Event.once(onDidChangeEditorAttachState)` elsewhere.
	readonly onDidChangeEditorAttachState = this._onDidChangeEditorAttachState.event;
	protected readonly _onDidChangeState = this._register(new Emitter<CellViewModelStateChangeEvent>());
	public readonly onDidChangeState: Event<CellViewModelStateChangeEvent> = this._onDidChangeState.event;

    protected readonly _textModelRefChangeDisposable = this._register(new MutableDisposable());

    private _isDisposed = false;

    constructor(
        readonly viewType: string,
		readonly model: NotebookCellTextModel,
        private readonly _modelService: ITextModelService,
    ) {
        super();
    }

    //#region Text Model

    get textModel(): model.ITextModel | undefined {
		return this.model.textModel;
	}

    get uri() {
		return this.model.uri;
	}
	get lineCount() {
		return this.model.textBuffer.getLineCount();
	}

	hasModel(): this is IEditableCellViewModel {
		return !!this.textModel;
	}

    protected _textModelRef: IReference<IResolvedTextEditorModel> | undefined;

    /**
	 * Text model is used for editing.
	 */
	async resolveTextModel(): Promise<model.ITextModel> {
		if (!this._textModelRef || !this.textModel) {
			this._textModelRef = await this._modelService.createModelReference(this.uri);
			if (this._isDisposed) {
				return this.textModel!;
			}

			if (!this._textModelRef) {
				throw new Error(`Cannot resolve text model for ${this.uri}`);
			}
			this._textModelRefChangeDisposable.value = this.textModel!.onDidChangeContent(() => this.onDidChangeTextModelContent());
		}

		return this.textModel!;
	}

    protected abstract onDidChangeTextModelContent(): void;

    //#endregion
}
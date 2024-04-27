import { Disposable } from 'vs/base/common/lifecycle';
import { IUndoRedoElement, IUndoRedoService, IWorkspaceUndoRedoElement, UndoRedoElementType, UndoRedoGroup } from 'vs/platform/undoRedo/common/undoRedo';
import { CellEditType, ICellData, ICellEditOperation, ISelectionState, NotebookRecordModelChangedEvent } from '../notebookCommon';
import { Emitter, PauseableEmitter } from 'vs/base/common/event';
import { URI } from 'vs/base/common/uri';
import { IRecord, IRecordWithRole } from '../recordCommon';

class NotebookEventEmitter extends PauseableEmitter<NotebookRecordModelChangedEvent> {
	isDirtyEvent() {
		for (const e of this._eventQueue) {
			for (let i = 0; i < e.rawEvents.length; i++) {
				if (!e.rawEvents[i].transient) {
					return true;
				}
			}
		}

		return false;
	}
}

class StackOperation implements IWorkspaceUndoRedoElement {
	type: UndoRedoElementType.Workspace;

	public get code() {
		return this._operations.length === 1 ? this._operations[0].code : 'undoredo.notebooks.stackOperation';
	}

	private _operations: IUndoRedoElement[] = [];
	private _beginSelectionState: ISelectionState | undefined = undefined;
	private _resultSelectionState: ISelectionState | undefined = undefined;
	private _beginAlternativeVersionId: number;
	private _resultAlternativeVersionId: number;
	public get label() {
		return this._operations.length === 1 ? this._operations[0].label : 'edit';
	}

	constructor(
		readonly textModel: NotebookRecordModel,
		readonly undoRedoGroup: UndoRedoGroup | undefined,
		private _pauseableEmitter: PauseableEmitter<NotebookRecordModelChangedEvent>,
		private _postUndoRedo: (alternativeVersionId: number) => void,
		selectionState: ISelectionState | undefined,
		beginAlternativeVersionId: number
	) {
		this.type = UndoRedoElementType.Workspace;
		this._beginSelectionState = selectionState;
		this._beginAlternativeVersionId = beginAlternativeVersionId;
		this._resultAlternativeVersionId = beginAlternativeVersionId;
	}
	get resources(): readonly URI[] {
		return [this.textModel.uri];
	}

	get isEmpty(): boolean {
		return this._operations.length === 0;
	}

	pushEndState(alternativeVersionId: number, selectionState: ISelectionState | undefined) {
		// https://github.com/microsoft/vscode/issues/207523
		this._resultAlternativeVersionId = alternativeVersionId;
		this._resultSelectionState = selectionState || this._resultSelectionState;
	}

	pushEditOperation(element: IUndoRedoElement, beginSelectionState: ISelectionState | undefined, resultSelectionState: ISelectionState | undefined, alternativeVersionId: number) {
		if (this._operations.length === 0) {
			this._beginSelectionState = this._beginSelectionState ?? beginSelectionState;
		}
		this._operations.push(element);
		this._resultSelectionState = resultSelectionState;
		this._resultAlternativeVersionId = alternativeVersionId;
	}

	async undo(): Promise<void> {
		this._pauseableEmitter.pause();
		for (let i = this._operations.length - 1; i >= 0; i--) {
			await this._operations[i].undo();
		}
		this._postUndoRedo(this._beginAlternativeVersionId);
		this._pauseableEmitter.fire({
			rawEvents: [],
			synchronous: undefined,
			versionId: this.textModel.versionId,
			endSelectionState: this._beginSelectionState
		});
		this._pauseableEmitter.resume();
	}

	async redo(): Promise<void> {
		this._pauseableEmitter.pause();
		for (let i = 0; i < this._operations.length; i++) {
			await this._operations[i].redo();
		}
		this._postUndoRedo(this._resultAlternativeVersionId);
		this._pauseableEmitter.fire({
			rawEvents: [],
			synchronous: undefined,
			versionId: this.textModel.versionId,
			endSelectionState: this._resultSelectionState
		});
		this._pauseableEmitter.resume();

	}
}

class NotebookOperationManager {
	private _pendingStackOperation: StackOperation | null = null;
	constructor(
		private readonly _textModel: NotebookRecordModel,
		private _undoService: IUndoRedoService,
		private _pauseableEmitter: PauseableEmitter<NotebookRecordModelChangedEvent>,
		private _postUndoRedo: (alternativeVersionId: number) => void
	) {
	}

    isUndoStackEmpty(): boolean {
		return this._pendingStackOperation === null || this._pendingStackOperation.isEmpty;
	}

	pushStackElement(alternativeVersionId: number, selectionState: ISelectionState | undefined) {
		if (this._pendingStackOperation && !this._pendingStackOperation.isEmpty) {
			this._pendingStackOperation.pushEndState(alternativeVersionId, selectionState);
			this._undoService.pushElement(this._pendingStackOperation, this._pendingStackOperation.undoRedoGroup);
		}
		this._pendingStackOperation = null;
	}

    private _getOrCreateEditStackElement(
        beginSelectionState: ISelectionState | undefined, 
        undoRedoGroup: UndoRedoGroup | undefined, 
        alternativeVersionId: number
    ) {
		return this._pendingStackOperation ??= new StackOperation(this._textModel, undoRedoGroup, this._pauseableEmitter, this._postUndoRedo, beginSelectionState, alternativeVersionId || 0);
	}

	pushEditOperation(
        element: IUndoRedoElement, 
        beginSelectionState: ISelectionState | undefined, 
        resultSelectionState: ISelectionState | undefined, 
        alternativeVersionId: number, 
        undoRedoGroup: UndoRedoGroup | undefined
    ) {
		const pendingStackOperation = this._getOrCreateEditStackElement(beginSelectionState, undoRedoGroup, alternativeVersionId);
		pendingStackOperation.pushEditOperation(element, beginSelectionState, resultSelectionState, alternativeVersionId);
	}
}

export class NotebookRecordModel extends Disposable {

    private readonly _onDidChangeContent = this._register(new Emitter<NotebookRecordModelChangedEvent>());

    private document!: IRecordWithRole;

    private _operationManager: NotebookOperationManager;
    private _pauseableEmitter: NotebookEventEmitter;

    constructor(
        readonly uri: URI,
        @IUndoRedoService private readonly _undoService: IUndoRedoService,
    ) {
        super();

        this._pauseableEmitter = new NotebookEventEmitter({
			merge: (events: NotebookRecordModelChangedEvent[]) => {
				const first = events[0];

				const rawEvents = first.rawEvents;
				let versionId = first.versionId;
				let endSelectionState = first.endSelectionState;
				let synchronous = first.synchronous;

				for (let i = 1; i < events.length; i++) {
					rawEvents.push(...events[i].rawEvents);
					versionId = events[i].versionId;
					endSelectionState = events[i].endSelectionState !== undefined ? events[i].endSelectionState : endSelectionState;
					synchronous = events[i].synchronous !== undefined ? events[i].synchronous : synchronous;
				}

				return { rawEvents, versionId, endSelectionState, synchronous };
			}
		});

        this._register(this._pauseableEmitter.event(e => {
			if (e.rawEvents.length) {
				this._onDidChangeContent.fire(e);
			}
		}));

        this._operationManager = new NotebookOperationManager(
			this,
			this._undoService,
			this._pauseableEmitter,
			(alternativeVersionId: number) => this.postUndoRedo(alternativeVersionId)
		);
    }

    get versionId() {
        return this.document.record.version;
    }

    /**
	 * Unlike, versionId, this can go down (via undo) or go to previous values (via redo)
	 */
    get _alternativeVersionId() {
        return this.document.record.lastVersion;
    }

    private postUndoRedo(alternativeVersionId: number) {
        // todo: apply it with edit operations
        this.document.record.lastVersion = alternativeVersionId;
    }

    applyEdits(
        rawEdits: ICellEditOperation[], 
        synchronous: boolean, 
        beginSelectionState: ISelectionState | undefined, 
        endSelectionsComputer: () => ISelectionState | undefined, 
        undoRedoGroup: UndoRedoGroup | undefined, 
        computeUndoRedo: boolean
    ): boolean {
        
        this._pauseableEmitter.pause();
		this._operationManager.pushStackElement(this._alternativeVersionId, undefined);

        try {
			this._doApplyEdits(rawEdits, synchronous, computeUndoRedo, beginSelectionState, undoRedoGroup);
			return true;
		} finally {
			// Update selection and versionId after applying edits.
			const endSelections = endSelectionsComputer();
            // todo: apply it with edit operations
			//this._increaseVersionId(this._operationManager.isUndoStackEmpty() && !this._pauseableEmitter.isDirtyEvent());

			// Finalize undo element
			this._operationManager.pushStackElement(this._alternativeVersionId, endSelections);

			// Broadcast changes
			this._pauseableEmitter.fire({ rawEvents: [], versionId: this.versionId, synchronous: synchronous, endSelectionState: endSelections });
			this._pauseableEmitter.resume();
		}
    }

    private _doApplyEdits(
        rawEdits: ICellEditOperation[], 
        synchronous: boolean, 
        computeUndoRedo: boolean, 
        beginSelectionState: ISelectionState | undefined, 
        undoRedoGroup: UndoRedoGroup | undefined
    ): void {

        // todo: compress all edits which have no side effects on cell index

        for ( const { editType } of rawEdits ) {
            switch (editType) {
                case CellEditType.Replace:
                    break;
            }
        }
    }

    private replaceCells(index: number, count: number, cellDtos: ICellData[], synchronous: boolean, computeUndoRedo: boolean, beginSelectionState: ISelectionState | undefined, undoRedoGroup: UndoRedoGroup | undefined): void {

    }
}
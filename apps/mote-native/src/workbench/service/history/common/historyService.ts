import { Disposable } from "vs/base/common/lifecycle";
import { IStorageService } from "vs/platform/storage/common/storage";
import { IHistoryService } from "./history";
import { EditorInput } from "mote/workbench/common/editor/editorInput";

export class HistoryService extends Disposable implements IHistoryService {
    _serviceBrand: undefined;

    constructor(
        //@IStorageService private readonly storageService: IStorageService
    ) {
        super();
    }

    getHistory(): readonly EditorInput[] {
        this.ensureHistoryLoaded(this.history);
        return this.history;
    }

    private ensureHistoryLoaded(history: Array<EditorInput> | undefined): asserts history {
        if (!this.history) {

			// Until history is loaded, it is just empty
			this.history = [];

            this.loadHistory();
        }
    }

    private loadHistory(): void {

		// Init as empty before adding - since we are about to
		// populate the history from opened editors, we capture
		// the right order here.
		this.history = [];
    }

    //#region Go to: Recently Opened Editor (limit: 200, persisted)

    private static readonly MAX_HISTORY_ITEMS = 20;
	private static readonly HISTORY_STORAGE_KEY = 'history.entries';

    private history: Array<EditorInput> | undefined = undefined;

    public addToHistory(editor: EditorInput, insertFirst = true): void {
        this.ensureHistoryLoaded(this.history);

        const historyInput = editor;

        // Insert based on preference
		if (insertFirst) {
			this.history.unshift(historyInput);
		} else {
			this.history.push(historyInput);
		}
    }

    //#endregion
}
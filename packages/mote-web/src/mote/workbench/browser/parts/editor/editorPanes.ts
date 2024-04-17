import { Disposable } from 'vs/base/common/lifecycle';
import { EditorPane } from './editorPane';
import { IVisibleEditorPane } from 'mote/workbench/common/editorCommon';
import { DEFAULT_EDITOR_MAX_DIMENSIONS, DEFAULT_EDITOR_MIN_DIMENSIONS } from './editor';
import { IBoundarySashes } from 'vs/base/browser/ui/sash/sash';
import { ILogService } from 'mote/platform/log/common/log';

export class EditorPanes extends Disposable {

    private _activeEditorPane: EditorPane | null = null;
	get activeEditorPane(): IVisibleEditorPane | null { return this._activeEditorPane as IVisibleEditorPane | null; }

    get minimumWidth() { return this._activeEditorPane?.minimumWidth ?? DEFAULT_EDITOR_MIN_DIMENSIONS.width; }
	get minimumHeight() { return this._activeEditorPane?.minimumHeight ?? DEFAULT_EDITOR_MIN_DIMENSIONS.height; }
	get maximumWidth() { return this._activeEditorPane?.maximumWidth ?? DEFAULT_EDITOR_MAX_DIMENSIONS.width; }
	get maximumHeight() { return this._activeEditorPane?.maximumHeight ?? DEFAULT_EDITOR_MAX_DIMENSIONS.height; }

	private boundarySashes: IBoundarySashes | undefined;

	constructor(
		@ILogService private readonly logService: ILogService,
	) {
		super();
	}

	setBoundarySashes(sashes: IBoundarySashes): void {
		this.boundarySashes = sashes;

		this.safeRun(() => this._activeEditorPane?.setBoundarySashes(sashes));
	}

	private safeRun(fn: () => void): void {

		// We delegate many calls to the active editor pane which
		// can be any kind of editor. We must ensure that our calls
		// do not throw, for example in `layout()` because that can
		// mess with the grid layout.

		try {
			fn();
		} catch (error: any) {
			this.logService.error(error);
		}
	}
}
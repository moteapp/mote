import { KeybindingWeight } from "vs/platform/keybinding/common/keybindingsRegistry";
import { EditorCommand } from "../editorExtensions";
import { ServicesAccessor } from "vs/platform/instantiation/common/instantiation";
import { IMoteEditor } from "../editorBrowser";
import { IViewModel } from "mote/editor/common/viewModelCommon";

const CORE_WEIGHT = KeybindingWeight.EditorCore;

export abstract class CoreEditorCommand<T> extends EditorCommand {
	public runEditorCommand(accessor: ServicesAccessor | null, editor: IMoteEditor, args?: Partial<T> | null): void {
		const viewModel = editor.getViewModel();
		if (!viewModel) {
			// the editor has no view => has no cursors
			return;
		}
		this.runCoreEditorCommand(viewModel, args || {});
	}

	public abstract runCoreEditorCommand(viewModel: IViewModel, args: Partial<T>): void;
}
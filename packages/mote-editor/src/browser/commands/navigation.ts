import { IPosition } from "@mote/editor/common/core/position";
import { CoreEditorCommand } from "./coreCommands";
import { ICommandOptions } from "../editorExtensions";
import { IViewModel } from "@mote/editor/common/viewModelCommon";
import { CursorChangeReason } from "@mote/editor/common/cursorEvents";

export const enum NavigationCommandRevealType {
	/**
	 * Do regular revealing.
	 */
	Regular = 0,
	/**
	 * Do only minimal revealing.
	 */
	Minimal = 1,
	/**
	 * Do not reveal the position.
	 */
	None = 2
}

export namespace CoreNavigationCommands {

	export interface BaseCommandOptions {
		source?: 'mouse' | 'keyboard' | string;
	}

	export interface MoveCommandOptions extends BaseCommandOptions {
		position: IPosition;
		viewPosition?: IPosition;
		revealType: NavigationCommandRevealType;
	}

    class BaseMoveToCommand extends CoreEditorCommand<MoveCommandOptions> {

		private readonly _inSelectionMode: boolean;

		constructor(opts: ICommandOptions & { inSelectionMode: boolean }) {
			super(opts);
			this._inSelectionMode = opts.inSelectionMode;
		}

		public runCoreEditorCommand(viewModel: IViewModel, args: Partial<MoveCommandOptions>): void {
			if (!args.position) {
				return;
			}
		}
	}
}
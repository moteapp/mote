import { IEditorGroupsService } from 'mote/workbench/services/editor/common/editorGroupsService';
import { localize, localize2 } from 'vs/nls';
import { Categories } from 'vs/platform/action/common/actionCommonCategories';
import { Action2, MenuId } from 'vs/platform/actions/common/actions';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { NEW_EMPTY_EDITOR_WINDOW_COMMAND_ID } from './editorCommands';
import { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { Codicon } from 'vs/base/common/codicons';
import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';

export class NewEmptyEditorWindowAction extends Action2 {

	constructor() {
		super({
			id: NEW_EMPTY_EDITOR_WINDOW_COMMAND_ID,
			title: {
				...localize2('newEmptyEditorWindow', "New Empty Editor Window"),
				mnemonicTitle: localize({ key: 'miNewEmptyEditorWindow', comment: ['&& denotes a mnemonic'] }, "&&New Empty Editor Window"),
			},
			f1: true,
			category: Categories.View
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorGroupService = accessor.get(IEditorGroupsService);

		const auxiliaryEditorPart = await editorGroupService.createAuxiliaryEditorPart();
		auxiliaryEditorPart.activeGroup.focus();
	}
}

export class NavigateForwardAction extends Action2 {

	static readonly ID = 'workbench.action.navigateForward';
	static readonly LABEL = localize('navigateForward', "Go Forward");

	constructor() {
		super({
			id: NavigateForwardAction.ID,
			title: {
				...localize2('navigateForward', "Go Forward"),
				mnemonicTitle: localize({ key: 'miForward', comment: ['&& denotes a mnemonic'] }, "&&Forward")
			},
			f1: true,
			icon: Codicon.arrowRight,
			//precondition: ContextKeyExpr.has('canNavigateForward'),
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				win: { primary: KeyMod.Alt | KeyCode.RightArrow },
				mac: { primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.Minus },
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Minus }
			},
			menu: [
				{ id: MenuId.MenubarGoMenu, group: '1_history_nav', order: 2 },
				{ id: MenuId.CommandCenter, order: 2 }
			]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		//const historyService = accessor.get(IHistoryService);

		//await historyService.goForward(GoFilter.NONE);
	}
}

export class NavigateBackwardsAction extends Action2 {

	static readonly ID = 'workbench.action.navigateBack';
	static readonly LABEL = localize('navigateBack', "Go Back");

	constructor() {
		super({
			id: NavigateBackwardsAction.ID,
			title: {
				...localize2('navigateBack', "Go Back"),
				mnemonicTitle: localize({ key: 'miBack', comment: ['&& denotes a mnemonic'] }, "&&Back")
			},
			f1: true,
			precondition: ContextKeyExpr.has('canNavigateBack'),
			icon: Codicon.arrowLeft,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				win: { primary: KeyMod.Alt | KeyCode.LeftArrow },
				mac: { primary: KeyMod.WinCtrl | KeyCode.Minus },
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Minus }
			},
			menu: [
				{ id: MenuId.MenubarGoMenu, group: '1_history_nav', order: 1 },
				{ id: MenuId.CommandCenter, order: 1 }
			]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		//const historyService = accessor.get(IHistoryService);

		//await historyService.goBack(GoFilter.NONE);
	}
}
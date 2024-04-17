import { IEditorGroupsService } from 'mote/workbench/service/editor/common/editorGroupsService';
import { localize, localize2 } from 'vs/nls';
import { Categories } from 'vs/platform/action/common/actionCommonCategories';
import { Action2 } from 'vs/platform/actions/common/actions';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { NEW_EMPTY_EDITOR_WINDOW_COMMAND_ID } from './editorCommands';

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
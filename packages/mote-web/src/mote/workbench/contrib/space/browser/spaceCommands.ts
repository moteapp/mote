import { KeyChord, KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { isWeb, isWindows } from 'vs/base/common/platform';
import { KeybindingWeight, KeybindingsRegistry } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { NEW_UNTITLED_PAGE_COMMAND_ID, NEW_UNTITLED_PAGE_LABEL } from '../common/spaceConstants';
import { IEditorService } from 'mote/workbench/services/editor/common/editorService';
import { generateUuid } from 'vs/base/common/uuid';
import { URI } from 'vs/base/common/uri';
import { IDatabaseService } from 'mote/platform/database/common/database';


KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: null,
	primary: isWeb ? (isWindows ? KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyN) : KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyN) : KeyMod.CtrlCmd | KeyCode.KeyN,
	secondary: isWeb ? [KeyMod.CtrlCmd | KeyCode.KeyN] : undefined,
	id: NEW_UNTITLED_PAGE_COMMAND_ID,
	metadata: {
		description: NEW_UNTITLED_PAGE_LABEL,
		args: [
			{
				isOptional: true,
				name: 'New Untitled Text File arguments',
				description: 'The editor view type or language ID if known',
				schema: {
					'type': 'object',
					'properties': {
						'viewType': {
							'type': 'string'
						},
						'languageId': {
							'type': 'string'
						}
					}
				}
			}
		]
	},
	handler: async (accessor, args?: { languageId?: string; viewType?: string }) => {
		const editorService = accessor.get(IEditorService);
		const databaseService = accessor.get(IDatabaseService);

        const id = generateUuid();
        const uri = URI.from({ scheme: 'block', path: id });
		databaseService.createRecord(uri);

		await editorService.openEditor({
			resource: uri,
			options: {
				override: args?.viewType,
				pinned: true
			},
			languageId: args?.languageId,
		});
	}
});
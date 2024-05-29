import { KeyChord, KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { isWeb, isWindows } from 'vs/base/common/platform';
import { KeybindingWeight, KeybindingsRegistry } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { NEW_UNTITLED_PAGE_COMMAND_ID, NEW_UNTITLED_PAGE_LABEL } from '../common/spaceConstants';
import { IEditorService } from 'mote/workbench/services/editor/common/editorService';
import { generateUuid } from 'vs/base/common/uuid';
import { URI } from 'vs/base/common/uri';
import { IDatabaseService } from 'mote/platform/database/common/database';
import { Schemas } from 'mote/base/common/network';
import { IRecordService } from 'mote/editor/common/services/record';


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
				name: 'New Untitled Page arguments',
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
		const recordService = accessor.get(IRecordService);

        const path = '/' + generateUuid();
        const uri = URI.from({ scheme: Schemas.record, authority: 'block', path });
		recordService.createRecord(uri, '');

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
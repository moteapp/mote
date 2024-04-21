import { KeyChord, KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { isWeb, isWindows } from 'vs/base/common/platform';
import { KeybindingWeight, KeybindingsRegistry } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { NEW_UNTITLED_FILE_COMMAND_ID, NEW_UNTITLED_FILE_LABEL } from './fileConstants';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { IOpenEmptyWindowOptions } from 'mote/platform/window/common/window';
import { IHostService } from 'mote/workbench/services/host/browser/host';

export const newWindowCommand = (accessor: ServicesAccessor, options?: IOpenEmptyWindowOptions) => {
	const hostService = accessor.get(IHostService);
	hostService.openWindow(options);
};

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: null,
	primary: isWeb ? (isWindows ? KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyN) : KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyN) : KeyMod.CtrlCmd | KeyCode.KeyN,
	secondary: isWeb ? [KeyMod.CtrlCmd | KeyCode.KeyN] : undefined,
	id: NEW_UNTITLED_FILE_COMMAND_ID,
	metadata: {
		description: NEW_UNTITLED_FILE_LABEL,
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
        /*
		const editorService = accessor.get(IEditorService);

		await editorService.openEditor({
			resource: undefined,
			options: {
				override: args?.viewType,
				pinned: true
			},
			languageId: args?.languageId,
		});
        */
	}
});
import { ICommandAction } from 'vs/platform/action/common/action';
import { MenuId, MenuRegistry } from 'vs/platform/actions/common/actions';
import { ContextKeyExpression } from 'vs/platform/contextkey/common/contextkey';
import { NEW_UNTITLED_FILE_COMMAND_ID, NEW_UNTITLED_FILE_LABEL } from './fileConstants';
import { Categories } from 'vs/platform/action/common/actionCommonCategories';
import { CommandsRegistry } from 'vs/platform/commands/common/commands';
import { newWindowCommand } from './fileCommands';

CommandsRegistry.registerCommand('_files.newWindow', newWindowCommand);


export function appendToCommandPalette({ id, title, category, metadata }: ICommandAction, when?: ContextKeyExpression): void {
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
		command: {
			id,
			title,
			category,
			metadata
		},
		when
	});
}

appendToCommandPalette({
	id: NEW_UNTITLED_FILE_COMMAND_ID,
	title: NEW_UNTITLED_FILE_LABEL,
	category: Categories.File
});
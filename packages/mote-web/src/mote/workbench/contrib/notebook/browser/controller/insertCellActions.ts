import { CellKind } from 'mote/workbench/contrib/notebook/common/notebookCommon';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { INotebookActionContext, NotebookAction } from './coreActions';
import { IAction2Options, MenuId, registerAction2 } from 'vs/platform/actions/common/actions';
import { CellViewModel } from '../viewModel/notebookViewModel';
import { localize } from 'vs/nls';
import { insertCell } from './cellOperations';

const INSERT_MARKDOWN_CELL_BELOW_COMMAND_ID = 'notebook.cell.insertMarkdownCellBelow';

export function insertNewCell(accessor: ServicesAccessor, context: INotebookActionContext, kind: CellKind, direction: 'above' | 'below', focusEditor: boolean) {
    let newCell: CellViewModel | null = null;
    if (context.ui) {
		context.notebookEditor.focus();
	}

    if (context.cell) {
		const idx = context.notebookEditor.getCellIndex(context.cell);
		newCell = insertCell(context.notebookEditor, idx, kind, direction, undefined, true);
	} else {
		const focusRange = context.notebookEditor.getFocus();
		const next = Math.max(focusRange.end - 1, 0);
		newCell = insertCell(context.notebookEditor, next, kind, direction, undefined, true);
	}
    
    return newCell;
}

export abstract class InsertCellCommand extends NotebookAction {
	constructor(
		desc: Readonly<IAction2Options>,
		private kind: CellKind,
		private direction: 'above' | 'below',
		private focusEditor: boolean
	) {
		super(desc);
	}

	async runWithContext(accessor: ServicesAccessor, context: INotebookActionContext): Promise<void> {
		const newCell = await insertNewCell(accessor, context, this.kind, this.direction, this.focusEditor);

		if (newCell) {
			await context.notebookEditor.focusNotebookCell(newCell, this.focusEditor ? 'editor' : 'container');
		}
	}
}

registerAction2(class InsertMarkdownCellBelowAction extends InsertCellCommand {
	constructor() {
		super(
			{
				id: INSERT_MARKDOWN_CELL_BELOW_COMMAND_ID,
				title: localize('notebookActions.insertMarkdownCellBelow', "Insert Markdown Cell Below"),
				menu: {
					id: MenuId.NotebookCellInsert,
					order: 3
				}
			},
			CellKind.Markup,
			'below',
			true);
	}
});
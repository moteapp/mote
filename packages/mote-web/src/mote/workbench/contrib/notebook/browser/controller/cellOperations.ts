import { CellKind } from 'mote/workbench/contrib/notebook/common/notebookCommon';
import { IActiveNotebookEditor } from '../notebookBrowser';
import { CellViewModel, NotebookViewModel } from '../viewModel/notebookViewModel';

export function insertCell(
	editor: IActiveNotebookEditor,
	index: number,
	type: CellKind,
	direction: 'above' | 'below' = 'above',
	initialText: string = '',
	ui: boolean = false
) {
    const viewModel = editor.getViewModel() as NotebookViewModel;

    return null as any as CellViewModel;
}
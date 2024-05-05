import { CellKind, ISelectionState, SelectionStateType } from 'mote/workbench/contrib/notebook/common/notebookCommon';
import { IActiveNotebookEditor, ICellViewModel } from '../notebookBrowser';
import { CellViewModel, NotebookViewModel } from '../viewModel/notebookViewModel';
import { RecordEditType } from 'mote/platform/database/common/recordCommon';

export function insertCell(
	editor: IActiveNotebookEditor,
	cell: ICellViewModel,
	direction: 'above' | 'below' = 'above',
	initialText: string = '',
) {
	const synchronous = true;
	const pushUndoStop = true;
	const index = editor.getCellIndex(cell);

	const endSelections: ISelectionState = { kind: SelectionStateType.Index, focus: { start: index, end: index + 1 }, selections: [{ start: index, end: index + 1 }] };
    const viewModel = editor.getViewModel() as NotebookViewModel;

	const editType = direction === 'above' ? RecordEditType.ListBefore : RecordEditType.ListAfter;

	viewModel.document.applyEdits([
		{
			editType,
			cell,
			index,
			cells: []
		}
	], synchronous, { kind: SelectionStateType.Index, focus: viewModel.getFocus(), selections: viewModel.getSelections() }, () => endSelections, undefined, pushUndoStop && !viewModel.options.isReadOnly);

    return null as any as CellViewModel;
}
import { IBaseCellEditorOptions } from '../notebookBrowser';
import { NotebookOptions } from '../notebookOptions';
import { NotebookEventDispatcher } from './notebookEventDispatcher';

export class NotebookViewContext {
	constructor(
		readonly notebookOptions: NotebookOptions,
		readonly eventDispatcher: NotebookEventDispatcher,
		readonly getBaseCellEditorOptions: () => IBaseCellEditorOptions
	) {
	}
}

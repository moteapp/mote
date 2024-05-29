import { Disposable } from 'vs/base/common/lifecycle';
import { IBaseCellEditorOptions } from 'mote/workbench/contrib/notebook/browser/notebookBrowser';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { NotebookOptions } from 'mote/workbench/contrib/notebook/browser/notebookOptions';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';

export class CellEditorOptions extends Disposable {

    private _value: IEditorOptions;
     
    constructor(
        private readonly base: IBaseCellEditorOptions,
        readonly notebookOptions: NotebookOptions,
		readonly configurationService: IConfigurationService
    ) {
        super();
        this._value = this._computeEditorOptions();
    }
    
    private _computeEditorOptions() {
		const value = this.base.value; // base IEditorOptions
        return Object.assign({}, value)
    }

    getDefaultValue(): IEditorOptions {
		return {
			...this._value,
			...{
				padding: { top: 12, bottom: 12 }
			}
		};
	}
}
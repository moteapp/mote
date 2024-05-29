import { Disposable } from 'vs/base/common/lifecycle';

export interface NotebookDisplayOptions { 
    editorOptionsCustomizations: Partial<{
		'editor.indentSize': 'tabSize' | number;
		'editor.tabSize': number;
		'editor.insertSpaces': boolean;
	}> | undefined;
}

export interface NotebookLayoutConfiguration {

}

export class NotebookOptions extends Disposable {

    private _layoutConfiguration: NotebookLayoutConfiguration & NotebookDisplayOptions;

    constructor() {
        super();
        this._layoutConfiguration = {
            editorOptionsCustomizations: {}
        }
    }

    getDisplayOptions(): NotebookDisplayOptions {
		return this._layoutConfiguration;
	}

    computeMarkdownCellEditorWidth(outerWidth: number): number {
		return outerWidth;
	}
}
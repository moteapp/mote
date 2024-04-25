import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';

export interface BaseCellRenderTemplate {
	readonly rootContainer: HTMLElement;
	readonly editorPart: HTMLElement;
    readonly container: HTMLElement;
    readonly cellContainer: HTMLElement;
    readonly instantiationService: IInstantiationService;
}

export interface MarkdownCellRenderTemplate extends BaseCellRenderTemplate {
	readonly editorContainer: HTMLElement;
	readonly foldingIndicator: HTMLElement;
	currentEditor?: ICodeEditor;
}
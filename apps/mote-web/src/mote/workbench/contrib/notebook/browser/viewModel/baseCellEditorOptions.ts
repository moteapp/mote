import { Disposable } from 'vs/base/common/lifecycle';
import { IBaseCellEditorOptions, INotebookEditorDelegate } from '../notebookBrowser';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { Event, Emitter } from 'vs/base/common/event';
import { NotebookOptions } from '../notebookOptions';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { deepClone } from 'vs/base/common/objects';

export class BaseCellEditorOptions extends Disposable implements IBaseCellEditorOptions {

    private static fixedEditorOptions: IEditorOptions = {
		scrollBeyondLastLine: false,
		scrollbar: {
			verticalScrollbarSize: 14,
			horizontal: 'auto',
			useShadows: true,
			verticalHasArrows: false,
			horizontalHasArrows: false,
			alwaysConsumeMouseWheel: false
		},
		renderLineHighlightOnlyWhenFocus: true,
		overviewRulerLanes: 0,
		lineDecorationsWidth: 0,
		folding: true,
		fixedOverflowWidgets: true,
		minimap: { enabled: false },
		renderValidationDecorations: 'on',
		lineNumbersMinChars: 3,
	};

    private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;
	private _value: IEditorOptions;

	get value(): Readonly<IEditorOptions> {
		return this._value;
	}
    
    constructor(
        readonly notebookEditor: INotebookEditorDelegate, 
        readonly notebookOptions: NotebookOptions, 
        readonly configurationService: IConfigurationService
    ) {
        super();

        this._value = this._computeEditorOptions();
    }

    private _recomputeOptions(): void {
		this._value = this._computeEditorOptions();
		this._onDidChange.fire();
	}

    private _computeEditorOptions() {
		const editorOptions = deepClone(this.configurationService.getValue<IEditorOptions>('editor'));
		const editorOptionsOverrideRaw = this.notebookOptions.getDisplayOptions().editorOptionsCustomizations;
		const editorOptionsOverride: Record<string, any> = {};
		if (editorOptionsOverrideRaw) {
			for (const key in editorOptionsOverrideRaw) {
				if (key.indexOf('editor.') === 0) {
					editorOptionsOverride[key.substring(7)] = editorOptionsOverrideRaw[key as keyof typeof editorOptionsOverrideRaw];
				}
			}
		}
		const computed = Object.freeze({
			...editorOptions,
			...BaseCellEditorOptions.fixedEditorOptions,
			...editorOptionsOverride,
			...{ padding: { top: 12, bottom: 12 } },
			readOnly: this.notebookEditor.isReadOnly
		});

		return computed;
	}
}
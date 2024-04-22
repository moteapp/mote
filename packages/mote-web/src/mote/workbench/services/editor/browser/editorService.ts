import { Disposable } from 'vs/base/common/lifecycle';
import { EditorServiceImpl } from 'mote/workbench/browser/parts/editor/editor';
import { ACTIVE_GROUP_TYPE, AUX_WINDOW_GROUP_TYPE, IEditorService, PreferredGroup, SIDE_GROUP_TYPE, isPreferredGroup } from 'mote/workbench/services/editor/common/editorService';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { Emitter } from 'vs/base/common/event';
import { GroupIdentifier, IEditorCloseEvent, IEditorIdentifier, IEditorPane, IEditorWillOpenEvent, IUntypedEditorInput, isEditorInput } from 'mote/workbench/common/editorCommon';
import { IResourceEditorInput, ITextResourceEditorInput } from 'vs/platform/editor/common/editor';
import { IEditorGroup } from 'mote/workbench/services/editor/common/editorGroupsService';
import { EditorInput } from 'mote/workbench/common/editor/editorInput';
import { IEditorOptions } from 'mote/platform/editor/common/editor';

export class EditorService extends Disposable implements EditorServiceImpl {
    declare readonly _serviceBrand: undefined;

    private readonly _onWillOpenEditor = this._register(new Emitter<IEditorWillOpenEvent>());
	readonly onWillOpenEditor = this._onWillOpenEditor.event;

	private readonly _onDidCloseEditor = this._register(new Emitter<IEditorCloseEvent>());
	readonly onDidCloseEditor = this._onDidCloseEditor.event;

	private readonly _onDidOpenEditorFail = this._register(new Emitter<IEditorIdentifier>());
	readonly onDidOpenEditorFail = this._onDidOpenEditorFail.event;


    openEditor(editor: IResourceEditorInput, group?: IEditorGroup | GroupIdentifier | SIDE_GROUP_TYPE | ACTIVE_GROUP_TYPE | AUX_WINDOW_GROUP_TYPE): Promise<IEditorPane | undefined>;
	openEditor(editor: ITextResourceEditorInput | ITextResourceEditorInput, group?: IEditorGroup | GroupIdentifier | SIDE_GROUP_TYPE | ACTIVE_GROUP_TYPE | AUX_WINDOW_GROUP_TYPE): Promise<IEditorPane | undefined>;
	openEditor(editor: IUntypedEditorInput, group?: IEditorGroup | GroupIdentifier | SIDE_GROUP_TYPE | ACTIVE_GROUP_TYPE | AUX_WINDOW_GROUP_TYPE): Promise<IEditorPane | undefined>;
    async openEditor(editor: EditorInput | IUntypedEditorInput, optionsOrPreferredGroup?: IEditorOptions | PreferredGroup, preferredGroup?: PreferredGroup): Promise<IEditorPane | undefined> {
        let typedEditor: EditorInput | undefined = undefined;
		let options = isEditorInput(editor) ? optionsOrPreferredGroup as IEditorOptions : editor.options;
        let group: IEditorGroup | undefined = undefined;


        if (isPreferredGroup(optionsOrPreferredGroup)) {
			preferredGroup = optionsOrPreferredGroup;
		}

        return group.openEditor(typedEditor, options);
    }
}

registerSingleton(IEditorService, new SyncDescriptor(EditorService, [undefined], false));

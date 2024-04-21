import { Disposable } from 'vs/base/common/lifecycle';
import { EditorServiceImpl } from 'mote/workbench/browser/parts/editor/editor';
import { IEditorService } from 'mote/workbench/services/editor/common/editorService';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';

export class EditorService extends Disposable implements EditorServiceImpl {
    declare readonly _serviceBrand: undefined;
}

registerSingleton(IEditorService, new SyncDescriptor(EditorService, [undefined], false));

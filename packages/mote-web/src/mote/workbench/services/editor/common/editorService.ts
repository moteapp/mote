import { createDecorator } from 'vs/platform/instantiation/common/instantiation';

export const IEditorService = createDecorator<IEditorService>('editorService');

export interface IEditorService {

	readonly _serviceBrand: undefined;
}

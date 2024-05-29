import { Disposable } from 'vs/base/common/lifecycle';
import { EditorInput } from './editor/editorInput';

export abstract class AbstractEditorInput extends Disposable {
	// Marker class for implementing `isEditorInput`
}

export function isEditorInput(editor: unknown): editor is EditorInput {
	return editor instanceof AbstractEditorInput;
}
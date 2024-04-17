import { Disposable } from 'vs/base/common/lifecycle';
import { IComposite } from './composite';
import { EditorInput } from 'mote/workbench/common/editor/editorInput';

export type GroupIdentifier = number;

export abstract class AbstractEditorInput extends Disposable {
	// Marker class for implementing `isEditorInput`
}

/**
 * The editor pane is the container for workbench editors.
 */
export interface IEditorPane extends IComposite {
}

/**
 * Overrides `IEditorPane` where `input` and `group` are known to be set.
 */
export interface IVisibleEditorPane extends IEditorPane {
	readonly input: EditorInput;
}
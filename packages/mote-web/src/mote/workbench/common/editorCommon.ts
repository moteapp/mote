import { Disposable } from 'vs/base/common/lifecycle';
import { IComposite } from './composite';
import { EditorInput } from 'mote/workbench/common/editor/editorInput';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IEditorGroup } from 'mote/workbench/services/editor/common/editorGroupsService';
import { DeepRequiredNonNullable } from 'vs/base/common/types';

// Static values for editor contributions
export const EditorExtensions = {
	EditorPane: 'workbench.contributions.editors',
	EditorFactory: 'workbench.contributions.editor.inputFactories'
};


export interface IEditorDescriptor<T extends IEditorPane> {

	/**
	 * The unique type identifier of the editor. All instances
	 * of the same `IEditorPane` should have the same type
	 * identifier.
	 */
	readonly typeId: string;

	/**
	 * The display name of the editor.
	 */
	readonly name: string;

	/**
	 * Instantiates the editor pane using the provided services.
	 */
	instantiate(instantiationService: IInstantiationService, group: IEditorGroup): T;

	/**
	 * Whether the descriptor is for the provided editor pane.
	 */
	describes(editorPane: T): boolean;
}

export interface IWillInstantiateEditorPaneEvent {

	/**
	 * @see {@link IEditorDescriptor.typeId}
	 */
	readonly typeId: string;
}

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

interface IEditorPartConfiguration {
	showTabs?: 'multiple' | 'single' | 'none';
}

export interface IEditorPartOptions extends DeepRequiredNonNullable<IEditorPartConfiguration> {
	hasIcons: boolean;
}

export interface IEditorPartOptionsChangeEvent {
	oldPartOptions: IEditorPartOptions;
	newPartOptions: IEditorPartOptions;
}

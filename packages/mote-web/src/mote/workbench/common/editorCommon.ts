import { Disposable } from 'vs/base/common/lifecycle';
import { IComposite } from './composite';
import { EditorInput } from 'mote/workbench/common/editor/editorInput';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IEditorGroup } from 'mote/workbench/services/editor/common/editorGroupsService';
import { DeepRequiredNonNullable } from 'vs/base/common/types';
import { IBaseTextResourceEditorInput, IResourceEditorInput, ITextResourceEditorInput } from 'vs/platform/editor/common/editor';
import { URI } from 'vs/base/common/uri';

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

export interface IEditorIdentifier {
	groupId: GroupIdentifier;
	editor: EditorInput;
}

export interface IEditorCloseEvent extends IEditorIdentifier {
}

export interface IEditorWillOpenEvent extends IEditorIdentifier { }


export abstract class AbstractEditorInput extends Disposable {
	// Marker class for implementing `isEditorInput`
}

export function isEditorInput(editor: unknown): editor is EditorInput {
	return editor instanceof AbstractEditorInput;
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

export interface IUntitledTextResourceEditorInput extends IBaseTextResourceEditorInput {

	/**
	 * Optional resource for the untitled editor. Depending on the value, the editor:
	 * - should get a unique name if `undefined` (for example `Untitled-1`)
	 * - should use the resource directly if the scheme is `untitled:`
	 * - should change the scheme to `untitled:` otherwise and assume an associated path
	 *
	 * Untitled editors with associated path behave slightly different from other untitled
	 * editors:
	 * - they are dirty right when opening
	 * - they will not ask for a file path when saving but use the associated path
	 */
	readonly resource: URI | undefined;
}


export type IUntypedEditorInput = IResourceEditorInput | ITextResourceEditorInput | IUntitledTextResourceEditorInput;
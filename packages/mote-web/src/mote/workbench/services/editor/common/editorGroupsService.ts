import { Event } from 'vs/base/common/event';
import { GroupIdentifier, IEditorPartOptions, IEditorPartOptionsChangeEvent } from 'mote/workbench/common/editorCommon';
import { IInstantiationService, createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { IRectangle } from 'mote/platform/window/common/window';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { EditorInput } from 'mote/workbench/common/editor/editorInput';

export const IEditorGroupsService = createDecorator<IEditorGroupsService>('editorGroupsService');

export const enum GroupDirection {
	UP,
	DOWN,
	LEFT,
	RIGHT
}

export const enum GroupOrientation {
	HORIZONTAL,
	VERTICAL
}

export const enum GroupLocation {
	FIRST,
	LAST,
	NEXT,
	PREVIOUS
}

export const enum GroupsOrder {

	/**
	 * Groups sorted by creation order (oldest one first)
	 */
	CREATION_TIME,

	/**
	 * Groups sorted by most recent activity (most recent active first)
	 */
	MOST_RECENTLY_ACTIVE,

	/**
	 * Groups sorted by grid widget order
	 */
	GRID_APPEARANCE
}

export const enum GroupsArrangement {
	/**
	 * Make the current active group consume the entire
	 * editor area.
	 */
	MAXIMIZE,

	/**
	 * Make the current active group consume the maximum
	 * amount of space possible.
	 */
	EXPAND,

	/**
	 * Size all groups evenly.
	 */
	EVEN
}

export interface GroupLayoutArgument {

	/**
	 * Only applies when there are multiple groups
	 * arranged next to each other in a row or column.
	 * If provided, their sum must be 1 to be applied
	 * per row or column.
	 */
	readonly size?: number;

	/**
	 * Editor groups  will be laid out orthogonal to the
	 * parent orientation.
	 */
	readonly groups?: GroupLayoutArgument[];
}

export const enum MergeGroupMode {
	COPY_EDITORS,
	MOVE_EDITORS
}

export interface IMergeGroupOptions {
	mode?: MergeGroupMode;
	readonly index?: number;
}

export interface EditorGroupLayout {

	/**
	 * The initial orientation of the editor groups at the root.
	 */
	readonly orientation: GroupOrientation;

	/**
	 * The editor groups at the root of the layout.
	 */
	readonly groups: GroupLayoutArgument[];
}

export interface IEditorGroup {
    /**
	 * A unique identifier of this group that remains identical even if the
	 * group is moved to different locations.
	 */
	readonly id: GroupIdentifier;

	/**
	 * All opened editors in the group in sequential order of their appearance.
	 */
	readonly editors: readonly EditorInput[];

	/**
	 * The scoped context key service for this group.
	 */
	readonly scopedContextKeyService: IContextKeyService;

	/**
	 * Move keyboard focus into the group.
	 */
	focus(): void;
}

export function isEditorGroup(obj: unknown): obj is IEditorGroup {
	const group = obj as IEditorGroup | undefined;

	return !!group && typeof group.id === 'number' && Array.isArray(group.editors);
}

/**
 * The basic primitive to work with editor groups. This interface is both implemented
 * by editor part component as well as the editor groups service that operates across
 * all opened editor parts.
 */
export interface IEditorGroupsContainer {

    /**
	 * An event for when a new group was added.
	 */
	readonly onDidAddGroup: Event<IEditorGroup>;

	/**
	 * An event for when a group was removed.
	 */
	readonly onDidRemoveGroup: Event<IEditorGroup>;

	/**
	 * A property that indicates when groups have been created
	 * and are ready to be used in the editor part.
	 */
	readonly isReady: boolean;

	/**
	 * A promise that resolves when groups have been created
	 * and are ready to be used in the editor part.
	 *
	 * Await this promise to safely work on the editor groups model
	 * (for example, install editor group listeners).
	 *
	 * Use the `whenRestored` property to await visible editors
	 * having fully resolved.
	 */
	readonly whenReady: Promise<void>;

	/**
	 * A promise that resolves when groups have been restored in
	 * the editor part.
	 *
	 * For groups with active editor, the promise will resolve
	 * when the visible editor has finished to resolve.
	 *
	 * Use the `whenReady` property to not await editors to
	 * resolve.
	 */
	readonly whenRestored: Promise<void>;


	/**
	 * An active group is the default location for new editors to open.
	 */
	readonly activeGroup: IEditorGroup;

	/**
	 * Applies the provided layout by either moving existing groups or creating new groups.
	 */
	applyLayout(layout: EditorGroupLayout): void;

	/**
	 * Returns an editor layout of the container.
	 */
	getLayout(): EditorGroupLayout;

}

/**
 * An editor part is a viewer of editor groups. There can be multiple editor
 * parts opened in multiple windows.
 */
export interface IEditorPart extends IEditorGroupsContainer {

}

export interface IAuxiliaryEditorPart extends IEditorPart {

	/**
	 * Close this auxiliary editor part after moving all
	 * editors of all groups back to the main editor part.
	 *
	 * @returns `false` if an editor could not be moved back.
	 */
	close(): boolean;
}

export interface IAuxiliaryEditorPartCreateEvent {
	readonly part: IAuxiliaryEditorPart;
	readonly instantiationService: IInstantiationService;
	readonly disposables: DisposableStore;
}

/**
 * The main service to interact with editor groups across all opened editor parts.
 */
export interface IEditorGroupsService extends IEditorGroupsContainer {

    readonly _serviceBrand: undefined;

    /**
	 * Provides access to the main window editor part.
	 */
	readonly mainPart: IEditorPart;

	/**
	 * Provides access to all editor parts.
	 */
	readonly parts: ReadonlyArray<IEditorPart>;

	/**
	 * An event that notifies when editor part options change.
	 */
	readonly onDidChangeEditorPartOptions: Event<IEditorPartOptionsChangeEvent>;

	/**
	 * Access the options of the editor part.
	 */
	readonly partOptions: IEditorPartOptions;

	/**
	 * Get the editor part that contains the group with the provided identifier.
	 */
	getPart(group: IEditorGroup | GroupIdentifier): IEditorPart;

	/**
	 * Get the editor part that is rooted in the provided container.
	 */
	getPart(container: unknown /* HTMLElement */): IEditorPart;

	/**
	 * Opens a new window with a full editor part instantiated
	 * in there at the optional position and size on screen.
	 */
	createAuxiliaryEditorPart(options?: { bounds?: Partial<IRectangle> }): Promise<IAuxiliaryEditorPart>;

}
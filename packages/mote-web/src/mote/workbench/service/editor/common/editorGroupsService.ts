import { Event } from 'vs/base/common/event';
import { GroupIdentifier } from 'mote/workbench/common/editorCommon';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { IRectangle } from 'mote/platform/window/common/window';

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
	 * Move keyboard focus into the group.
	 */
	focus(): void;
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
	 * An active group is the default location for new editors to open.
	 */
	readonly activeGroup: IEditorGroup;
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
	 * Get the editor part that contains the group with the provided identifier.
	 */
	getPart(group: IEditorGroup | GroupIdentifier): IEditorPart;

	/**
	 * Opens a new window with a full editor part instantiated
	 * in there at the optional position and size on screen.
	 */
	createAuxiliaryEditorPart(options?: { bounds?: Partial<IRectangle> }): Promise<IAuxiliaryEditorPart>;

}
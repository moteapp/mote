import { Dimension } from 'mote/base/browser/dom';
import { GroupIdentifier } from 'mote/workbench/common/editorCommon';
import { GroupDirection, IEditorGroup, IEditorPart } from 'mote/workbench/services/editor/common/editorGroupsService';
import { IEditorService } from 'mote/workbench/services/editor/common/editorService';
import { ISerializableView } from 'vs/base/browser/ui/grid/grid';
import { IDisposable } from 'vs/base/common/lifecycle';

export interface IEditorPartCreationOptions {
	readonly restorePreviousState: boolean;
}

export const DEFAULT_EDITOR_MIN_DIMENSIONS = new Dimension(220, 70);
export const DEFAULT_EDITOR_MAX_DIMENSIONS = new Dimension(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

/**
 * A helper to access and mutate an editor group within an editor part.
 */
export interface IEditorGroupView extends IDisposable, ISerializableView, IEditorGroup {

    readonly groupsView: IEditorGroupsView;

    setActive(isActive: boolean): void;
}

/**
 * A helper to access and mutate editor groups within an editor part.
 */
export interface IEditorGroupsView {

	readonly windowId: number;

	readonly groups: IEditorGroupView[];

    addGroup(location: IEditorGroupView | GroupIdentifier, direction: GroupDirection, groupToCopy?: IEditorGroupView): IEditorGroupView;
}

/**
 * A helper to access editor groups across all opened editor parts.
 */
export interface IEditorPartsView {

    readonly mainPart: IEditorGroupsView;
	registerPart(part: IEditorPart): IDisposable;

    getGroup(identifier: GroupIdentifier): IEditorGroupView | undefined;
}

/**
 * A sub-interface of IEditorService to hide some workbench-core specific
 * events from clients.
 */
export interface EditorServiceImpl extends IEditorService {
    
}
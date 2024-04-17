import ReactDOM from 'react-dom/client'
import React from 'react';
import { Part } from 'mote/workbench/browser/part';
import { IWorkbenchLayoutService, Parts } from 'mote/workbench/service/layout/workbenchLayoutService';
import { QuickNote } from 'mote/base/component/quicknote/quicknote';
import { IEditorGroupView, IEditorPartCreationOptions, IEditorPartsView } from './editor';
import { mainWindow } from 'mote/base/browser/window';
import { GroupIdentifier } from 'mote/workbench/common/editorCommon';
import { Emitter, PauseableEmitter } from 'vs/base/common/event';
import { ISerializedGrid, SerializableGrid } from 'vs/base/browser/ui/grid/grid';
import { GroupDirection } from 'mote/workbench/service/editor/common/editorGroupsService';
import { EditorGroupView } from './editorGroupView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { ISerializedEditorGroupModel, isSerializedEditorGroupModel } from 'mote/workbench/common/editor/editorGroupModel';

export interface IEditorPartUIState {
	readonly serializedGrid: ISerializedGrid;
	readonly activeGroup: GroupIdentifier;
	readonly mostRecentActiveGroups: GroupIdentifier[];
}

export class EditorPart extends Part {

     //#region IView

	readonly minimumWidth: number = 370;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;
	readonly minimumHeight: number = 0;
	readonly maximumHeight: number = Number.POSITIVE_INFINITY;

    //#endregion

    //#region Events

    private readonly _onDidActivateGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidActivateGroup = this._onDidActivateGroup.event;

    private readonly _onDidAddGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidAddGroup = this._onDidAddGroup.event;

    private readonly _onDidRemoveGroup = this._register(new PauseableEmitter<IEditorGroupView>());
	readonly onDidRemoveGroup = this._onDidRemoveGroup.event;

	private readonly _onDidMoveGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidMoveGroup = this._onDidMoveGroup.event;

    private readonly _onDidChangeActiveGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidChangeActiveGroup = this._onDidChangeActiveGroup.event;

    //#endregion

    protected container: HTMLElement | undefined;

    private gridWidget!: SerializableGrid<IEditorGroupView>;

    private scopedInstantiationService!: IInstantiationService;
    
    constructor(
        id: string,
        readonly windowId: number,
        private readonly groupsLabel: string,
        protected readonly editorPartsView: IEditorPartsView,
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
        @IInstantiationService private readonly instantiationService: IInstantiationService,
    ) {
        super(id, {}, layoutService);
    }

    create(parent: HTMLElement, options?: object): void {
        super.create(parent, options);
        try {
            ReactDOM.createRoot(parent).render(React.createElement(QuickNote));
        } catch (error) {
            console.error(error);
        }
    }

    protected override createContentArea(parent: HTMLElement, options?: IEditorPartCreationOptions): HTMLElement {

        // Container
		this.element = parent;
		this.container = document.createElement('div');
		this.container.classList.add('content');

        parent.appendChild(this.container);

        // Scoped instantiation service
        this.scopedInstantiationService = this.instantiationService.createChild(new ServiceCollection());

        // Grid control
        this.doCreateGridControl();

        return this.container;
    }

    private doCreateGridControl() {

        // Grid Widget (with previous UI state)
		let restoreError = false;

        // Grid Widget (no previous UI state or failed to restore)
		if (!this.gridWidget || restoreError) {
			const initialGroup = this.doCreateGroupView();
			this.doSetGridWidget(new SerializableGrid(initialGroup));

			// Ensure a group is active
			this.doSetGroupActive(initialGroup);
		}
    }

    private doCreateGroupView(from?: IEditorGroupView | ISerializedEditorGroupModel | null): IEditorGroupView {
        // Create group view
		let groupView: IEditorGroupView;

        if (from instanceof EditorGroupView) {
			groupView = EditorGroupView.createCopy(from, this.editorPartsView, this, this.count, this.groupsLabel, this.scopedInstantiationService);
		} else if (isSerializedEditorGroupModel(from)) {
            groupView = EditorGroupView.createFromSerialized(from, this.editorPartsView, this, this.count, this.groupsLabel, this.scopedInstantiationService);
        } else {
			groupView = EditorGroupView.createNew(this.editorPartsView, this, this.count, this.groupsLabel, this.scopedInstantiationService);
		}

        return groupView;
    }

    private doSetGridWidget(gridWidget: SerializableGrid<IEditorGroupView>): void {

    }

    //#region Group operations

    private readonly groupViews = new Map<GroupIdentifier, IEditorGroupView>();
    get groups(): IEditorGroupView[] {
		return Array.from(this.groupViews.values());
	}

    get count(): number {
		return this.groupViews.size;
	}

    private _activeGroup!: IEditorGroupView;
	get activeGroup(): IEditorGroupView {
		return this._activeGroup;
	}

    hasGroup(identifier: GroupIdentifier): boolean {
		return this.groupViews.has(identifier);
	}

    addGroup(location: IEditorGroupView | GroupIdentifier, direction: GroupDirection, groupToCopy?: IEditorGroupView): IEditorGroupView {
		const locationView = this.assertGroupView(location);

        let newGroupView: IEditorGroupView;

        // Same groups view: add to grid widget directly
		if (locationView.groupsView === this) {
            newGroupView = this.doCreateGroupView(groupToCopy);
        } 

        // Different group view: add to grid widget of that group
        else {
            newGroupView = locationView.groupsView.addGroup(locationView, direction, groupToCopy);
        }

        return newGroupView;
    }

    getGroup(identifier: GroupIdentifier): IEditorGroupView | undefined {
		return this.groupViews.get(identifier);
	}

    activateGroup(group: IEditorGroupView | GroupIdentifier, preserveWindowOrder?: boolean): IEditorGroupView {
		const groupView = this.assertGroupView(group);
		this.doSetGroupActive(groupView);

        return groupView;
    }

    protected assertGroupView(group: IEditorGroupView | GroupIdentifier): IEditorGroupView {
        let groupView: IEditorGroupView | undefined;

        if (typeof group === 'number') {
			groupView = this.editorPartsView.getGroup(group);
		} else {
			groupView = group;
		}

        if (!groupView) {
			throw new Error('Invalid editor group provided!');
		}

        return groupView;
    }

    private doSetGroupActive(group: IEditorGroupView): void {
		if (this._activeGroup !== group) {
			const previousActiveGroup = this._activeGroup;
			this._activeGroup = group;

            // Mark group as new active
			group.setActive(true);

            // Event
			this._onDidChangeActiveGroup.fire(group);
        }

        // Always fire the event that a group has been activated
		// even if its the same group that is already active to
		// signal the intent even when nothing has changed.
		this._onDidActivateGroup.fire(group);
    }

    //#endregion

    toJSON(): object {
		return {
			type: Parts.SIDEBAR_PART
		};
	}
}

export class MainEditorPart extends EditorPart {
    constructor(
		editorPartsView: IEditorPartsView,
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
        @IInstantiationService instantiationService: IInstantiationService,
    ) {
        super(Parts.EDITOR_PART, mainWindow.moteWindowId, '', editorPartsView, layoutService, instantiationService);
    }
}
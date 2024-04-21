import ReactDOM from 'react-dom/client'
import React from 'react';
import { Part } from 'mote/workbench/browser/part';
import { IWorkbenchLayoutService, Parts } from 'mote/workbench/services/layout/browser/workbenchLayoutService';
import { QuickNote } from 'mote/base/component/quicknote/quicknote';
import { IEditorGroupView, IEditorPartCreationOptions, IEditorPartsView } from './editor';
import { mainWindow } from 'mote/base/browser/window';
import { GroupIdentifier, IEditorPartOptions, IEditorPartOptionsChangeEvent } from 'mote/workbench/common/editorCommon';
import { Emitter, PauseableEmitter } from 'vs/base/common/event';
import { GridBranchNode, GridNode, ISerializedGrid, ISerializedNode, Orientation, SerializableGrid, isGridBranchNode } from 'vs/base/browser/ui/grid/grid';
import { EditorGroupLayout, GroupDirection, GroupLayoutArgument, GroupOrientation, GroupsOrder, IMergeGroupOptions } from 'mote/workbench/services/editor/common/editorGroupsService';
import { EditorGroupView } from './editorGroupView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { ISerializedEditorGroupModel, isSerializedEditorGroupModel } from 'mote/workbench/common/editor/editorGroupModel';
import { coalesce, distinct } from 'vs/base/common/arrays';
import { MoteEditor } from 'mote/editor/browser/moteEditor';
import { Dimension } from 'mote/base/browser/dom';
import { DeferredPromise } from 'vs/base/common/async';

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

	private readonly _onDidChangeEditorPartOptions = this._register(new Emitter<IEditorPartOptionsChangeEvent>());
	readonly onDidChangeEditorPartOptions = this._onDidChangeEditorPartOptions.event;

    //#endregion

    protected root!: ReactDOM.Root;
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
        this.root =  ReactDOM.createRoot(parent);
        this.root.render(React.createElement(MoteEditor, {width: this.minimumWidth, height: this.minimumHeight}));
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

        // Keep in map
		this.groupViews.set(groupView.id, groupView);

        return groupView;
    }

    private doSetGridWidget(gridWidget: SerializableGrid<IEditorGroupView>): void {

    }

    //#region Lifecycle

    private _isReady = false;
	get isReady(): boolean { return this._isReady; }

	private readonly whenReadyPromise = new DeferredPromise<void>();
	readonly whenReady = this.whenReadyPromise.p;

	private readonly whenRestoredPromise = new DeferredPromise<void>();
	readonly whenRestored = this.whenRestoredPromise.p;

    //#endregion

    //#region Group operations

    private readonly groupViews = new Map<GroupIdentifier, IEditorGroupView>();
    private mostRecentActiveGroups: GroupIdentifier[] = [];

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

    getGroups(order = GroupsOrder.CREATION_TIME): IEditorGroupView[] {
        switch (order) {
			case GroupsOrder.CREATION_TIME:
				return this.groups;
            case GroupsOrder.MOST_RECENTLY_ACTIVE: {
                const mostRecentActive = coalesce(this.mostRecentActiveGroups.map(groupId => this.getGroup(groupId)));

                // there can be groups that got never active, even though they exist. in this case
                // make sure to just append them at the end so that all groups are returned properly
                return distinct([...mostRecentActive, ...this.groups]);
            }
            case GroupsOrder.GRID_APPEARANCE: {
                const views: IEditorGroupView[] = [];
                if (this.gridWidget) {
                    this.fillGridNodes(views, this.gridWidget.getViews());
                }

                return views;
            }
        }
    }

    private fillGridNodes(target: IEditorGroupView[], node: GridBranchNode<IEditorGroupView> | GridNode<IEditorGroupView>): void {
		if (isGridBranchNode(node)) {
			node.children.forEach(child => this.fillGridNodes(target, child));
		} else {
			target.push(node.view);
		}
	}

    activateGroup(group: IEditorGroupView | GroupIdentifier, preserveWindowOrder?: boolean): IEditorGroupView {
		const groupView = this.assertGroupView(group);
		this.doSetGroupActive(groupView);

        return groupView;
    }

    mergeGroup(group: IEditorGroupView | GroupIdentifier, target: IEditorGroupView | GroupIdentifier, options?: IMergeGroupOptions): boolean {
        return true;
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

    //#region Layout

	get partOptions(): IEditorPartOptions { 
		return {
			showTabs: 'single',
			hasIcons: true,
		}
	}

    private top = 0;
	private left = 0;
	private _contentDimension!: Dimension;
	get contentDimension(): Dimension { return this._contentDimension; }

    override layout(width: number, height: number, top: number, left: number): void {
		this.top = top;
		this.left = left;

		// Layout contents
		const contentAreaSize = super.layoutContents(width, height).contentSize;

		// Layout editor container
		this.doLayout(Dimension.lift(contentAreaSize), top, left);
	}

    private doLayout(dimension: Dimension, top = this.top, left = this.left): void {
		this._contentDimension = dimension;

        this.root!.render(React.createElement(MoteEditor, {width: dimension.width, height: dimension.height}));

		// Layout Grid
		//this.centeredLayoutWidget.layout(this._contentDimension.width, this._contentDimension.height, top, left);

		// Event
		//this._onDidLayout.fire(dimension);
	}

    getLayout(): EditorGroupLayout {

		// Example return value:
		// { orientation: 0, groups: [ { groups: [ { size: 0.4 }, { size: 0.6 } ], size: 0.5 }, { groups: [ {}, {} ], size: 0.5 } ] }

		const serializedGrid = this.gridWidget.serialize();
		const orientation = serializedGrid.orientation === Orientation.HORIZONTAL ? GroupOrientation.HORIZONTAL : GroupOrientation.VERTICAL;
		const root = this.serializedNodeToGroupLayoutArgument(serializedGrid.root);

		return {
			orientation,
			groups: root.groups as GroupLayoutArgument[]
		};
	}

    private serializedNodeToGroupLayoutArgument(serializedNode: ISerializedNode): GroupLayoutArgument {
		if (serializedNode.type === 'branch') {
			return {
				size: serializedNode.size,
				groups: serializedNode.data.map(node => this.serializedNodeToGroupLayoutArgument(node))
			};
		}

		return { size: serializedNode.size };
	}

    applyLayout(layout: EditorGroupLayout): void {
        // Determine how many groups we need overall
		let layoutGroupsCount = 0;
		function countGroups(groups: GroupLayoutArgument[]): void {
			for (const group of groups) {
				if (Array.isArray(group.groups)) {
					countGroups(group.groups);
				} else {
					layoutGroupsCount++;
				}
			}
		}
		countGroups(layout.groups);

        // If we currently have too many groups, merge them into the last one
		let currentGroupViews = this.getGroups(GroupsOrder.GRID_APPEARANCE);
		if (layoutGroupsCount < currentGroupViews.length) {
			const lastGroupInLayout = currentGroupViews[layoutGroupsCount - 1];
			currentGroupViews.forEach((group, index) => {
				if (index >= layoutGroupsCount) {
					this.mergeGroup(group, lastGroupInLayout);
				}
			});

			currentGroupViews = this.getGroups(GroupsOrder.GRID_APPEARANCE);
		}

		const activeGroup = this.activeGroup;
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
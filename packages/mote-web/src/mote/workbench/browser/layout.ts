import { Disposable, DisposableMap, DisposableStore, IDisposable, toDisposable } from 'vs/base/common/lifecycle';
import { IWorkbenchLayoutService, Parts, Position } from 'mote/workbench/service/layout/workbenchLayoutService';
import { Emitter } from 'vs/base/common/event';
import { StorageScope, StorageTarget } from 'mote/platform/storage/common/storage';
import { IDimension, getActiveDocument, getClientArea, getWindow, getWindows, position, size } from 'mote/base/browser/dom';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { Part } from './part';
import { SidebarPart } from './parts/sidebar/sidebarPart';
import { TitlebarPart } from './parts/titlebar/titlebarPart';
import { ISerializableView, ISerializedGrid, ISerializedLeafNode, ISerializedNode, Orientation, SerializableGrid } from 'vs/base/browser/ui/grid/grid';
import { mainWindow } from 'mote/base/browser/window';
import { EditorPart } from './parts/editor/editorPart';
import { ILogService } from 'mote/platform/log/common/log';
import { isFullscreen } from 'vs/base/browser/browser';
import { ActivitybarPart } from './parts/activitybar/activitybarPart';
import { EditorGroupLayout, IEditorGroupsService } from 'mote/workbench/service/editor/common/editorGroupsService';

//#region Layout Implementation

interface ILayoutRuntimeState {
	activeContainerId: number;
	mainWindowFullscreen: boolean;
	readonly maximized: Set<number>;
	hasFocus: boolean;
	mainWindowBorder: boolean;
	readonly menuBar: {
		toggled: boolean;
	};
	readonly zenMode: {
		readonly transitionDisposables: DisposableMap<string, IDisposable>;
	};
}

interface ILayoutInitializationState {
	readonly views: {
		readonly defaults: string[] | undefined;
		readonly containerToRestore: {
			sideBar?: string;
			panel?: string;
			auxiliaryBar?: string;
		};
	};
	readonly editor: {
		readonly restoreEditors: boolean;
		//readonly editorsToOpen: Promise<IEditorToOpen[]>;
	};
	readonly layout?: {
		readonly editors?: EditorGroupLayout;
	};
}

interface ILayoutState {
	readonly runtime: ILayoutRuntimeState;
	readonly initialization: ILayoutInitializationState;
}

//#endregion

export class Layout extends Disposable implements IWorkbenchLayoutService {
    _serviceBrand: undefined;

    //#region Properties

    readonly mainContainer = document.createElement('div');

    //#endregion

    private workbenchGrid!: SerializableGrid<ISerializableView>;

    private titleBarPartView!: ISerializableView;
    private activityBarPartView!: ISerializableView;

    private logService!: ILogService;
	private editorGroupService!: IEditorGroupsService;

    private state!: ILayoutState;
    private stateModel!: LayoutStateModel;

    constructor(
		protected readonly parent: HTMLElement
	) {
		super();
	}

    //#region Layout

    protected initLayout(accessor: ServicesAccessor): void {

        // Services
        this.logService = accessor.get(ILogService);

		// Parts
		this.editorGroupService = accessor.get(IEditorGroupsService);

        const instantiationService = accessor.get(IInstantiationService);

        const sidebarPart = instantiationService.createInstance(SidebarPart);
        this.registerPart(sidebarPart);

        const titlebarPart = instantiationService.createInstance(TitlebarPart);
        this.registerPart(titlebarPart);

        //const editorPart = instantiationService.createInstance(EditorPart, Parts.EDITOR_PART, mainWindow.moteWindowId, '', {} as any);
        //this.registerPart(editorPart);

        const activityBar = instantiationService.createInstance(ActivitybarPart, {} as any);
        this.registerPart(activityBar);

        // State
        this.initLayoutState();
    }

    private initLayoutState(): void {
        this.stateModel = new LayoutStateModel(this.parent);
        this.stateModel.load();

        // Layout Initialization State
        const initialLayoutState: ILayoutInitializationState = {
			layout: {
				//editors: initialEditorsState?.layout
			},
			editor: {
				restoreEditors: false //this.shouldRestoreEditors(this.contextService, initialEditorsState),
				//editorsToOpen: this.resolveEditorsToOpen(fileService, initialEditorsState),
			},
			views: {
				defaults: [], //this.getDefaultLayoutViews(this.environmentService, this.storageService),
				containerToRestore: {}
			}
		};

        // Layout Runtime State
		const layoutRuntimeState: ILayoutRuntimeState = {
			activeContainerId: this.getActiveContainerId(),
			mainWindowFullscreen: isFullscreen(mainWindow),
			hasFocus: false,//this.hostService.hasFocus,
			maximized: new Set<number>(),
			mainWindowBorder: false,
			menuBar: {
				toggled: false,
			},
			zenMode: {
				transitionDisposables: new DisposableMap(),
			}
		};

        this.state = {
            runtime: layoutRuntimeState,
            initialization: initialLayoutState
        };
    }

    protected createWorkbenchLayout(): void {
        this.titleBarPartView = this.getPart(Parts.TITLEBAR_PART);
        const sideBar = this.getPart(Parts.SIDEBAR_PART);
        const editorPart = this.getPart(Parts.EDITOR_PART);
        const activityBar = this.getPart(Parts.ACTIVITYBAR_PART);

        this.activityBarPartView = activityBar;

        const viewMap = {
            [Parts.ACTIVITYBAR_PART]: activityBar,
            [Parts.TITLEBAR_PART]: this.titleBarPartView,
            [Parts.SIDEBAR_PART]: sideBar,
            [Parts.EDITOR_PART]: editorPart,
        }

        const fromJSON = ({ type }: { type: Parts }) => viewMap[type];
		const workbenchGrid = SerializableGrid.deserialize(
			this.createGridDescriptor(),
			{ fromJSON },
			{ proportionalLayout: false }
		);

        this.mainContainer.prepend(workbenchGrid.element);
		this.mainContainer.setAttribute('role', 'application');
		this.workbenchGrid = workbenchGrid;
    }

    private createGridDescriptor(): ISerializedGrid {
        
        const { width, height } = this.stateModel.getInitializationValue(LayoutStateKeys.GRID_SIZE);
		const sideBarSize = this.stateModel.getInitializationValue(LayoutStateKeys.SIDEBAR_SIZE);

        const titleBarHeight = this.titleBarPartView.minimumHeight;
        const activityBarWidth = this.activityBarPartView.minimumWidth;
        // status bar not finished yet
        const statusBarHeight = 0;
        const middleSectionHeight = height - titleBarHeight - statusBarHeight;

        const titleAndBanner: ISerializedNode[] = [
			{
				type: 'leaf',
				data: { type: Parts.TITLEBAR_PART },
				size: titleBarHeight,
				visible: true, //this.isVisible(Parts.TITLEBAR_PART, mainWindow)
			},
        ]

        const activityBarNode: ISerializedLeafNode = {
			type: 'leaf',
			data: { type: Parts.ACTIVITYBAR_PART },
			size: activityBarWidth,
			visible: true //!this.stateModel.getRuntimeValue(LayoutStateKeys.ACTIVITYBAR_HIDDEN)
		};

        const sideBarNode: ISerializedLeafNode = {
			type: 'leaf',
			data: { type: Parts.SIDEBAR_PART },
			size: sideBarSize,
			visible: !this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN)
		};

        const editorNode: ISerializedLeafNode = {
			type: 'leaf',
			data: { type: Parts.EDITOR_PART },
			size: 0, // Update based on sibling sizes
			visible: true //!this.stateModel.getRuntimeValue(LayoutStateKeys.EDITOR_HIDDEN)
		};

        const middleSection: ISerializedNode[] = this.arrangeMiddleSectionNodes({
			activityBar: activityBarNode,
			//auxiliaryBar: auxiliaryBarNode,
			editor: editorNode,
			//panel: panelNode,
			sideBar: sideBarNode
		}, width, middleSectionHeight);

        const result: ISerializedGrid = {
			root: {
				type: 'branch',
				size: width,
				data: [
					...titleAndBanner,
					{
						type: 'branch',
						data: middleSection,
						size: middleSectionHeight
					},
				]
			},
			orientation: Orientation.VERTICAL,
			width,
			height
		};

        console.log(result);

        return result;
    }

    private arrangeMiddleSectionNodes(nodes: { 
        editor: ISerializedNode; 
        //panel: ISerializedNode; 
        activityBar: ISerializedNode; 
        sideBar: ISerializedNode; 
        //auxiliaryBar: ISerializedNode 
    }, availableWidth: number, availableHeight: number
    ): ISerializedNode[] {
        const activityBarSize = this.stateModel.getRuntimeValue(LayoutStateKeys.ACTIVITYBAR_HIDDEN) ? 0 : nodes.activityBar.size;
        const sideBarSize = this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_HIDDEN) ? 0 : nodes.sideBar.size;
		const result = [] as ISerializedNode[];

        result.push(nodes.editor);
        nodes.editor.size = availableWidth - sideBarSize;
        result.splice(0, 0, nodes.sideBar);
        result.splice(0, 0, nodes.activityBar);

        return result;
    }

    getLayoutClasses(): string[] {
        return [];
    }

    layout(): void {
        this._mainContainerDimension = getClientArea(this.state.runtime.mainWindowFullscreen ?
            mainWindow.document.body : 	// in fullscreen mode, make sure to use <body> element because
            this.parent					// in that case the workbench will span the entire site
        );
        this.logService.trace(`Layout#layout, height: ${this._mainContainerDimension.height}, width: ${this._mainContainerDimension.width}`);


        position(this.mainContainer, 0, 0, 0, 0, 'relative');
        size(this.mainContainer, this._mainContainerDimension.width, this._mainContainerDimension.height);

        // Layout the grid widget
        this.workbenchGrid.layout(this._mainContainerDimension.width, this._mainContainerDimension.height);
    }

    //#endregion

    //#region Container

    get activeContainer() { return this.getContainerFromDocument(getActiveDocument()); }
	get containers(): Iterable<HTMLElement> {
		const containers: HTMLElement[] = [];
		for (const { window } of getWindows()) {
			containers.push(this.getContainerFromDocument(window.document));
		}

		return containers;
	}

    private getActiveContainerId(): number {
		const activeContainer = this.activeContainer;

		return getWindow(activeContainer).moteWindowId;
	}

    private getContainerFromDocument(targetDocument: Document): HTMLElement {
		if (targetDocument === this.mainContainer.ownerDocument) {
			// main window
			return this.mainContainer;
		} else {
			// auxiliary window
			return targetDocument.body.getElementsByClassName('monaco-workbench')[0] as HTMLElement;
		}
	}

    private _mainContainerDimension!: IDimension;
	get mainContainerDimension(): IDimension { return this._mainContainerDimension; }

	get activeContainerDimension(): IDimension {
		return this.getContainerDimension(this.activeContainer);
	}

	private getContainerDimension(container: HTMLElement): IDimension {
		if (container === this.mainContainer) {
			// main window
			return this.mainContainerDimension;
		} else {
			// auxiliary window
			return getClientArea(container);
		}
	}

    //#endregion

    //#region Parts
    private readonly parts = new Map<string, Part>();

    registerPart(part: Part): IDisposable {
		const id = part.getId();
		this.parts.set(id, part);

		return toDisposable(() => this.parts.delete(id));
	}

	protected getPart(key: Parts): Part {
		const part = this.parts.get(key);
		if (!part) {
			throw new Error(`Unknown part ${key}`);
		}

		return part;
	}

    getSideBarPosition(): Position {
		return this.stateModel.getRuntimeValue(LayoutStateKeys.SIDEBAR_POSITON);
	}

    //#endregion
}

//#region Layout State Model

interface IWorkbenchLayoutStateKey {
    readonly name: string;
    readonly runtime: boolean;
    readonly defaultValue: unknown;
    //readonly scope: StorageScope;
    //readonly target: StorageTarget;
    readonly zenModeIgnore?: boolean;
}

type StorageKeyType = string | boolean | number | object;

abstract class WorkbenchLayoutStateKey<T extends StorageKeyType> implements IWorkbenchLayoutStateKey {

	abstract readonly runtime: boolean;

	constructor(readonly name: string, readonly scope: StorageScope, readonly target: StorageTarget, public defaultValue: T) { }
}

class RuntimeStateKey<T extends StorageKeyType> extends WorkbenchLayoutStateKey<T> {

	readonly runtime = true;

	constructor(name: string, scope: StorageScope, target: StorageTarget, defaultValue: T, readonly zenModeIgnore?: boolean) {
		super(name, scope, target, defaultValue);
	}
}

class InitializationStateKey<T extends StorageKeyType> extends WorkbenchLayoutStateKey<T> {
	readonly runtime = false;
}

const LayoutStateKeys = {
    // Part Sizing
    GRID_SIZE: new InitializationStateKey('grid.size', StorageScope.PROFILE, StorageTarget.MACHINE, { width: 800, height: 600 }),
    SIDEBAR_SIZE: new InitializationStateKey<number>('sideBar.size', StorageScope.PROFILE, StorageTarget.MACHINE, 200),

    // Part Positions
	SIDEBAR_POSITON: new RuntimeStateKey<Position>('sideBar.position', StorageScope.WORKSPACE, StorageTarget.MACHINE, Position.LEFT),
	PANEL_POSITION: new RuntimeStateKey<Position>('panel.position', StorageScope.WORKSPACE, StorageTarget.MACHINE, Position.BOTTOM),
	//PANEL_ALIGNMENT: new RuntimeStateKey<PanelAlignment>('panel.alignment', StorageScope.PROFILE, StorageTarget.USER, 'center'),

    // Part Visibility
    ACTIVITYBAR_HIDDEN: new RuntimeStateKey<boolean>('activityBar.hidden', StorageScope.WORKSPACE, StorageTarget.MACHINE, false, true),
    SIDEBAR_HIDDEN: new RuntimeStateKey<boolean>('sideBar.hidden', StorageScope.WORKSPACE, StorageTarget.MACHINE, false),
}

type LayoutStateKey = keyof typeof LayoutStateKeys;

interface ILayoutStateChangeEvent<T extends StorageKeyType> {
	readonly key: RuntimeStateKey<T>;
	readonly value: T;
}

class LayoutStateModel extends Disposable {

	static readonly STORAGE_PREFIX = 'workbench.';

	private readonly _onDidChangeState = this._register(new Emitter<ILayoutStateChangeEvent<StorageKeyType>>());
	readonly onDidChangeState = this._onDidChangeState.event;

	private readonly stateCache = new Map<string, unknown>();

    constructor(
        private readonly container: HTMLElement
    ) {
        super();
    }

    load(): void {

        // Apply legacy settings
        this.stateCache.set(LayoutStateKeys.SIDEBAR_POSITON.name, 'left');

        // Set dynamic defaults: part sizing and side bar visibility
		const workbenchDimensions = getClientArea(this.container);

        LayoutStateKeys.GRID_SIZE.defaultValue = { height: workbenchDimensions.height, width: workbenchDimensions.width };
		LayoutStateKeys.SIDEBAR_SIZE.defaultValue = Math.min(300, workbenchDimensions.width / 4);

        // Apply all defaults
		for (const key in LayoutStateKeys) {
			const stateKey = LayoutStateKeys[key as LayoutStateKey];
			if (this.stateCache.get(stateKey.name) === undefined) {
				this.stateCache.set(stateKey.name, stateKey.defaultValue);
			}
		}
    }

    getInitializationValue<T extends StorageKeyType>(key: InitializationStateKey<T>): T {
		return this.stateCache.get(key.name) as T;
	}

    setInitializationValue<T extends StorageKeyType>(key: InitializationStateKey<T>, value: T): void {
		this.stateCache.set(key.name, value);
	}

    getRuntimeValue<T extends StorageKeyType>(key: RuntimeStateKey<T>, fallbackToSetting?: boolean): T {
        return this.stateCache.get(key.name) as T;
    }
}

//#endregion
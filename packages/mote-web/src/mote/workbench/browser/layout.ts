import { Disposable, DisposableStore, toDisposable } from 'vs/base/common/lifecycle';
import { IWorkbenchLayoutService } from 'mote/workbench/service/layout/workbenchLayoutService';
import { Emitter } from 'vs/base/common/event';
import { StorageScope, StorageTarget } from 'mote/platform/storage/common/storage';
import { getClientArea } from 'vs/base/browser/dom';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';

export class Layout extends Disposable implements IWorkbenchLayoutService {
    _serviceBrand: undefined;

    private stateModel!: LayoutStateModel;

    constructor(
		protected readonly parent: HTMLElement
	) {
		super();

        // todo: remove me later
        this.initLayoutState();
	}

    protected initLayout(accessor: ServicesAccessor): void {
        this.initLayoutState();
    }

    private initLayoutState(): void {
        this.stateModel = new LayoutStateModel(this.parent);
        this.stateModel.load();
    }
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
}

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

        // Set dynamic defaults: part sizing and side bar visibility
		const workbenchDimensions = getClientArea(this.container);

        LayoutStateKeys.GRID_SIZE.defaultValue = { height: workbenchDimensions.height, width: workbenchDimensions.width };
		LayoutStateKeys.SIDEBAR_SIZE.defaultValue = Math.min(300, workbenchDimensions.width / 4);
    }

    getInitializationValue<T extends StorageKeyType>(key: InitializationStateKey<T>): T {
		return this.stateCache.get(key.name) as T;
	}

    setInitializationValue<T extends StorageKeyType>(key: InitializationStateKey<T>, value: T): void {
		this.stateCache.set(key.name, value);
	}
}

//#endregion
import ReactDOM from 'react-dom/client'
import React from 'react';
import { Emitter, Event } from 'vs/base/common/event';
import { MultiWindowParts, Part } from 'mote/workbench/browser/part';
import { IWorkbenchLayoutService, Parts } from 'mote/workbench/services/layout/workbenchLayoutService';
import { Titlebar } from 'mote/base/component/titlebar/titlebarPart';
import { DisposableStore, IDisposable } from 'vs/base/common/lifecycle';
import { getZoomFactor, isWCOEnabled } from 'vs/base/browser/browser';
import { append, $, getWindow, prepend, reset } from 'mote/base/browser/dom';
import { isMacintosh, isWeb } from 'vs/base/common/platform';
import { IEditorGroupsContainer } from 'mote/workbench/services/editor/common/editorGroupsService';
import { MoteWindow, mainWindow } from 'mote/base/browser/window';
import { WindowTitle } from './windowTitle';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ITitleService } from 'mote/workbench/services/title/browser/titleService';
import { CommandCenterControl } from './commandCenterControl';
import { IHoverDelegate } from 'vs/base/browser/ui/hover/hoverDelegate';
import { createInstantHoverDelegate } from 'vs/base/browser/ui/hover/hoverDelegateFactory';
import './media/titlebarpart.css';

export interface ITitleVariable {
	readonly name: string;
	readonly contextKey: string;
}

export interface ITitleProperties {
	isPure?: boolean;
	isAdmin?: boolean;
	prefix?: string;
}

export interface ITitlebarPart extends IDisposable {

	/**
	 * An event when the menubar visibility changes.
	 */
	readonly onMenubarVisibilityChange: Event<boolean>;

	/**
	 * Update some environmental title properties.
	 */
	updateProperties(properties: ITitleProperties): void;

	/**
	 * Adds variables to be supported in the window title.
	 */
	registerVariables(variables: ITitleVariable[]): void;
}

export class BrowserTitlebarPart extends Part implements ITitlebarPart {

    private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

    private _onMenubarVisibilityChange = this._register(new Emitter<boolean>());
	readonly onMenubarVisibilityChange = this._onMenubarVisibilityChange.event;

    //#region IView

	readonly minimumWidth: number = 0;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;

	get minimumHeight(): number {
		const value = this.isCommandCenterVisible || (isWeb && isWCOEnabled()) ? 35 : 30;

		return value / (this.preventZoom ? getZoomFactor(getWindow(this.element)) : 1);
	}

	get maximumHeight(): number { return this.minimumHeight; }

	//#endregion

    protected rootContainer!: HTMLElement;
	protected primaryWindowControls: HTMLElement | undefined;
	protected dragRegion: HTMLElement | undefined;
	private title!: HTMLElement;

	private leftContent!: HTMLElement;
	private centerContent!: HTMLElement;
	private rightContent!: HTMLElement;

    protected appIcon: HTMLElement | undefined;

    private readonly titleDisposables = this._register(new DisposableStore());

    private readonly hoverDelegate: IHoverDelegate;
    private readonly windowTitle: WindowTitle;


    constructor(
        id: string,
		targetWindow: MoteWindow,
		editorGroupsContainer: IEditorGroupsContainer | 'main',
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
        @IInstantiationService protected readonly instantiationService: IInstantiationService,
    ) {
        super(id, {}, layoutService);

        this.windowTitle = this._register(instantiationService.createInstance(WindowTitle, targetWindow, editorGroupsContainer));

        this.hoverDelegate = this._register(createInstantHoverDelegate());
    }

    protected get isCommandCenterVisible() {
        return true;
    }

    get hasZoomableElements(): boolean {
        return true;
    }

    get preventZoom(): boolean {
		// Prevent zooming behavior if any of the following conditions are met:
		// 1. Shrinking below the window control size (zoom < 1)
		// 2. No custom items are present in the title bar

		return getZoomFactor(getWindow(this.element)) < 1 || !this.hasZoomableElements;
	}

    updateProperties(properties: ITitleProperties): void {
		this.windowTitle.updateProperties(properties);
	}

	registerVariables(variables: ITitleVariable[]): void {
		this.windowTitle.registerVariables(variables);
	}

    protected override createContentArea(parent: HTMLElement): HTMLElement {
        this.element = parent;
		this.rootContainer = append(parent, $('.titlebar-container'));

		this.leftContent = append(this.rootContainer, $('.titlebar-left'));
		this.centerContent = append(this.rootContainer, $('.titlebar-center'));
		this.rightContent = append(this.rootContainer, $('.titlebar-right'));

        // App Icon (Native Windows/Linux and Web)
		if (!isMacintosh && !isWeb) {
			this.appIcon = prepend(this.leftContent, $('a.window-appicon'));
        }

        // Title
		this.title = append(this.centerContent, $('div.window-title'));
		this.createTitle();

        return this.element;
    }

    private createTitle(): void {
        const commandCenter = this.instantiationService.createInstance(CommandCenterControl, this.windowTitle, this.hoverDelegate);
		reset(this.title, commandCenter.element);
		this.titleDisposables.add(commandCenter);
    }

    toJSON(): object {
		return {
			type: Parts.TITLEBAR_PART
		};
	}

	override dispose(): void {
		this._onWillDispose.fire();

		super.dispose();
	}
}

export class TitlebarPart extends Part {

    //#region IView

	readonly minimumWidth: number = 0;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;

    get minimumHeight(): number {
        return 48;
    }

    get maximumHeight(): number { return this.minimumHeight; }

    //#endregion

    constructor(
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
    ) {
        super(Parts.TITLEBAR_PART, {}, layoutService);
    }

    create(parent: HTMLElement, options?: object): void {
        super.create(parent, options);
        try {
            ReactDOM.createRoot(parent).render(React.createElement(Titlebar));
        } catch (error) {
            console.error(error);
        }
    }

    toJSON(): object {
		return {
			type: Parts.TITLEBAR_PART
		};
	}
}

export class MainBrowserTitlebarPart extends BrowserTitlebarPart {

    constructor(
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
        @IInstantiationService instantiationService: IInstantiationService,
    ) {
        super(Parts.TITLEBAR_PART, mainWindow, 'main', layoutService, instantiationService);
    }
}

export class BrowserTitleService extends MultiWindowParts<BrowserTitlebarPart> implements ITitleService {

	declare _serviceBrand: undefined;

	readonly mainPart = this._register(this.createMainTitlebarPart());

    constructor(
		@IInstantiationService protected readonly instantiationService: IInstantiationService,
    ) {
        super('workbench.titleService');
        this._register(this.registerPart(this.mainPart));
    
    }

    protected createMainTitlebarPart(): BrowserTitlebarPart {
		return this.instantiationService.createInstance(MainBrowserTitlebarPart);
	}

    readonly onMenubarVisibilityChange = this.mainPart.onMenubarVisibilityChange;

    private properties: ITitleProperties | undefined = undefined;

	updateProperties(properties: ITitleProperties): void {
		this.properties = properties;

		for (const part of this.parts) {
			part.updateProperties(properties);
		}
	}

	private variables: ITitleVariable[] = [];

	registerVariables(variables: ITitleVariable[]): void {
		this.variables.push(...variables);

		for (const part of this.parts) {
			part.registerVariables(variables);
		}
	}
}
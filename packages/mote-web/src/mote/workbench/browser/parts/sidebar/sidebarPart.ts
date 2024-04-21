import { IPartOptions, Part } from 'mote/workbench/browser/part';
import { IWorkbenchLayoutService, Parts } from 'mote/workbench/services/layout/browser/workbenchLayoutService';
import { Sidebar } from './sidebar';
import ReactDOM from 'react-dom/client'
import React from 'react';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ActivitybarPart } from 'mote/workbench/browser/parts/activitybar/activitybarPart';

export class SidebarPart extends Part {

    private root!: ReactDOM.Root;

    private readonly acitivityBarPart: ActivitybarPart;
    
    constructor(
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
        @IInstantiationService instantiationService: IInstantiationService,
    ) {
        super(Parts.SIDEBAR_PART, {}, layoutService);

        this.acitivityBarPart = this._register(instantiationService.createInstance(ActivitybarPart, this as any));
    }

    create(parent: HTMLElement, options?: object): void {
        super.create(parent, options);
        this.root = ReactDOM.createRoot(parent);
        this.root.render(React.createElement(Sidebar, {width: this.minimumWidth}));
    }

    async focusActivityBar(): Promise<void> {
        this.acitivityBarPart.show(true);
    }

    //#region IView

	readonly minimumWidth: number = 170;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;
	readonly minimumHeight: number = 0;
	readonly maximumHeight: number = Number.POSITIVE_INFINITY;

    override layout(width: number, height: number, top: number, left: number): void {
        super.layout(width, height, top, left);
        this.root.render(React.createElement(Sidebar, {width}));
    }

    toJSON(): object {
		return {
			type: Parts.SIDEBAR_PART
		};
	}

    //#endregion
}
import ReactDOM from 'react-dom/client'
import React from 'react';
import { Part } from 'mote/workbench/browser/part';
import { IWorkbenchLayoutService, Parts } from 'mote/workbench/services/layout/workbenchLayoutService';
import { Titlebar } from 'mote/base/component/titlebar/titlebarPart';

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
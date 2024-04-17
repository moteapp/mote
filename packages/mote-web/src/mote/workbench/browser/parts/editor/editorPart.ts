import ReactDOM from 'react-dom/client'
import React from 'react';
import { Part } from 'mote/workbench/browser/part';
import { IWorkbenchLayoutService, Parts } from 'mote/workbench/service/layout/workbenchLayoutService';
import { QuickNote } from 'mote/base/component/quicknote/quicknote';

export class EditorPart extends Part {

     //#region IView

	readonly minimumWidth: number = 370;
	readonly maximumWidth: number = Number.POSITIVE_INFINITY;
	readonly minimumHeight: number = 0;
	readonly maximumHeight: number = Number.POSITIVE_INFINITY;

    //#endregion
    
    constructor(
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
    ) {
        super(Parts.EDITOR_PART, {}, layoutService);
    }

    create(parent: HTMLElement, options?: object): void {
        super.create(parent, options);
        try {
            ReactDOM.createRoot(parent).render(React.createElement(QuickNote));
        } catch (error) {
            console.error(error);
        }
    }

    toJSON(): object {
		return {
			type: Parts.SIDEBAR_PART
		};
	}
}
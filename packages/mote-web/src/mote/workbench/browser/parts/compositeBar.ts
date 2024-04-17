import { Widget } from 'vs/base/browser/ui/widget';
import { ICompositeBar } from './compositeBarActions';
import { $, Dimension } from 'mote/base/browser/dom';

export interface ICompositeBarItem {

	readonly id: string;

	name?: string;
	pinned: boolean;
	order?: number;
	visible: boolean;
}

export interface ICompositeBarOptions {

	readonly icon: boolean;
}

export class CompositeBar extends Widget implements ICompositeBar {

    constructor(
		items: ICompositeBarItem[],
		private readonly options: ICompositeBarOptions,
    ) {
        super();
    }

    create(parent: HTMLElement): HTMLElement {
		const actionBarDiv = parent.appendChild($('.composite-bar'));
        return actionBarDiv;
    }

    focus(index?: number): void {

    }

    layout(dimension: Dimension): void {
		//this.dimension = dimension;
    }

    //#region ICompositeBar

    pin(compositeId: string): void {
        throw new Error('Method not implemented.');
    }
    
    unpin(compositeId: string): void {
        throw new Error('Method not implemented.');
    }
    
    isPinned(compositeId: string): boolean {
        throw new Error('Method not implemented.');
    }

    //#endregion
}
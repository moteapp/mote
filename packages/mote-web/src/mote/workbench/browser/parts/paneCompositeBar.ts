import { Parts } from 'mote/workbench/service/layout/workbenchLayoutService';
import { Disposable } from 'vs/base/common/lifecycle';
import { IPaneCompositePart } from './paneCompositePart';
import { CompositeBar, ICompositeBarItem } from './compositebar';
import { Dimension } from 'mote/base/browser/dom';

export interface IPaneCompositeBarOptions {

}

export class PaneCompositeBar extends Disposable {

    private readonly compositeBar: CompositeBar;

    constructor(
		protected readonly options: IPaneCompositeBarOptions,
		private readonly part: Parts,
		private readonly paneCompositePart: IPaneCompositePart,
    ) {
        super();

        const cachedItems: any[] = [];
        this.compositeBar = this.createCompositeBar(cachedItems);
    }
    
    create(parent: HTMLElement): HTMLElement {
		return this.compositeBar.create(parent);
	}

    focus(index?: number): void {
		this.compositeBar.focus(index);
	}

    layout(width: number, height: number): void {
		this.compositeBar.layout(new Dimension(width, height));
	}

    private createCompositeBar(cachedItems: ICompositeBarItem[]) {
        return new CompositeBar(cachedItems, { icon: true });
    }
}
import { Event } from 'vs/base/common/event';
import { IView } from 'vs/base/browser/ui/grid/gridview';
import { IPaneComposite } from 'mote/workbench/common/panecomposite';

export enum CompositeBarPosition {
	TOP,
	TITLE,
	BOTTOM
}

export interface IPaneCompositePart extends IView {
    
    readonly onDidPaneCompositeOpen: Event<IPaneComposite>;
	readonly onDidPaneCompositeClose: Event<IPaneComposite>;

	/**
	 * Opens a viewlet with the given identifier and pass keyboard focus to it if specified.
	 */
	openPaneComposite(id: string | undefined, focus?: boolean): Promise<IPaneComposite | undefined>;

	/**
	 * Returns the current active viewlet if any.
	 */
	getActivePaneComposite(): IPaneComposite | undefined;
}
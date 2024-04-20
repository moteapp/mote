import { ILayoutService } from 'mote/platform/layout/layoutService';
import { Part } from 'mote/workbench/browser/part';
import { IDisposable } from 'vs/base/common/lifecycle';
import { refineServiceDecorator } from 'vs/platform/instantiation/common/instantiation';

export const enum Parts {
	TITLEBAR_PART = 'workbench.parts.titlebar',
	//BANNER_PART = 'workbench.parts.banner',
	ACTIVITYBAR_PART = 'workbench.parts.activitybar',
	SIDEBAR_PART = 'workbench.parts.sidebar',
	//PANEL_PART = 'workbench.parts.panel',
	//AUXILIARYBAR_PART = 'workbench.parts.auxiliarybar',
	EDITOR_PART = 'workbench.parts.editor',
	//STATUSBAR_PART = 'workbench.parts.statusbar'
}

export const enum Position {
	LEFT,
	RIGHT,
	BOTTOM
}

export const IWorkbenchLayoutService = refineServiceDecorator<ILayoutService, IWorkbenchLayoutService>(ILayoutService);

export interface IWorkbenchLayoutService extends ILayoutService {

	readonly _serviceBrand: undefined;

	/**
	 * Register a part to participate in the layout.
	 */
	registerPart(part: Part): IDisposable;

}
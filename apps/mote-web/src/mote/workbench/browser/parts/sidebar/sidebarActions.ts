/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/sidebarpart.css';
import { localize2 } from 'vs/nls';
import { Action2, registerAction2 } from 'vs/platform/actions/common/actions';
import { IWorkbenchLayoutService, Parts } from 'mote/workbench/services/layout/browser/layoutService';
import { KeyMod, KeyCode } from 'vs/base/common/keyCodes';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { Categories } from 'vs/platform/action/common/actionCommonCategories';
import { IPaneCompositePartService } from 'mote/workbench/services/panecomposite/browser/panecomposite';
import { ViewContainerLocation } from 'mote/workbench/common/views';

export class FocusSideBarAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.focusSideBar',
			title: localize2('focusSideBar', 'Focus into Primary Side Bar'),
			category: Categories.View,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: null,
				primary: KeyMod.CtrlCmd | KeyCode.Digit0
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const layoutService = accessor.get(IWorkbenchLayoutService);
		const paneCompositeService = accessor.get(IPaneCompositePartService);

		// Show side bar
		if (!layoutService.isVisible(Parts.SIDEBAR_PART)) {
			layoutService.setPartHidden(false, Parts.SIDEBAR_PART);
			return;
		}

		// Focus into active viewlet
		const viewlet = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);
		viewlet?.focus();
	}
}

registerAction2(FocusSideBarAction);

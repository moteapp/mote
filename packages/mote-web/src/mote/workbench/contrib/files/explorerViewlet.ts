import { Disposable } from 'vs/base/common/lifecycle';
import { ViewPaneContainer } from 'mote/workbench/browser/parts/views/viewPaneContainer';
import { IWorkbenchContribution } from 'mote/workbench/common/contribution';
import { Registry } from 'vs/platform/registry/common/platform';
import { IViewContainersRegistry, ViewContainer, ViewContainerLocation, ViewExtensions } from 'mote/workbench/common/views';
import { localize, localize2 } from 'vs/nls';
import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { VIEWLET_ID } from './common/filesCommon';
import { registerIcon } from 'vs/platform/theme/common/iconRegistry';
import { Codicon } from 'vs/base/common/codicons';

const explorerViewIcon = registerIcon('explorer-view-icon', Codicon.files, localize('explorerViewIcon', 'View icon of the explorer view.'));

export class ExplorerViewPaneContainer extends ViewPaneContainer {
    
}

export class ExplorerViewletViewsContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.explorerViewletViews';
}

const viewContainerRegistry = Registry.as<IViewContainersRegistry>(ViewExtensions.ViewContainersRegistry);

/**
 * Explorer viewlet container.
 */
export const VIEW_CONTAINER: ViewContainer = viewContainerRegistry.registerViewContainer({
	id: VIEWLET_ID,
	title: localize2('explore', "Explorer"),
	ctorDescriptor: new SyncDescriptor(ExplorerViewPaneContainer),
	storageId: 'workbench.explorer.views.state',
	icon: explorerViewIcon,
	alwaysUseContainerInfo: true,
	hideIfEmpty: true,
	order: 0,
	openCommandActionDescriptor: {
		id: VIEWLET_ID,
		title: localize2('explore', "Explorer"),
		mnemonicTitle: localize({ key: 'miViewExplorer', comment: ['&& denotes a mnemonic'] }, "&&Explorer"),
		keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyE },
		order: 0
	},
}, ViewContainerLocation.Sidebar, { isDefault: true });
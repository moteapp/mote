import { IViewsRegistry, Extensions as ViewExtensions } from 'mote/workbench/common/views';
import { Registry } from 'vs/platform/registry/common/platform';
import { SpaceView } from './views/spaceView';
import { localize, localize2 } from 'vs/nls';
import { VIEW_CONTAINER } from 'mote/workbench/contrib/files/browser/explorerViewlet';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { KeyChord, KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { Codicon } from 'vs/base/common/codicons';
import { registerIcon } from 'vs/platform/theme/common/iconRegistry';

const openEditorsViewIcon = registerIcon('open-editors-view-icon', Codicon.book, localize('openEditorsIcon', 'View icon of the open editors view.'));


Registry.as<IViewsRegistry>(ViewExtensions.ViewsRegistry).registerViews([{
	id: SpaceView.ID,
    name: SpaceView.NAME,
    ctorDescriptor: new SyncDescriptor(SpaceView),
    containerIcon: openEditorsViewIcon,
    order: 1,
    canToggleVisibility: true,
    canMoveView: true,
    collapsed: false,
    hideByDefault: false,
    focusCommand: {
        id: 'workbench.files.action.focusSpaceView',
        keybindings: { primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyE) }
    }
}], VIEW_CONTAINER);
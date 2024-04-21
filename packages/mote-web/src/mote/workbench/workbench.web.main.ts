//#region --- workbench common

import 'mote/workbench/workbench.common.main';

//#endregion

import 'mote/workbench/services/host/browser/browserHostService';
import 'mote/workbench/services/lifecycle/browser/lifecycleService';
import 'mote/workbench/services/keybinding/browser/keyboardLayoutService';


import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { ITitleService } from 'mote/workbench/services/title/browser/titleService';
import { BrowserTitleService } from 'mote/workbench/browser/parts/titlebar/titlebarPart';
import { ContextMenuService } from 'vs/platform/contextview/browser/contextMenuService';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IAccessibilityService } from 'vs/platform/accessibility/common/accessibility';
import { AccessibilityService } from 'vs/platform/accessibility/browser/accessibilityService';


registerSingleton(ITitleService, BrowserTitleService, InstantiationType.Eager);
registerSingleton(IContextMenuService, ContextMenuService, InstantiationType.Delayed);
registerSingleton(IAccessibilityService, AccessibilityService, InstantiationType.Delayed);

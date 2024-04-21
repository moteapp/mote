//#region --- workbench actions

import 'mote/workbench/browser/actions/quickAccessActions';

//#endregion

//#region --- workbench parts

import 'mote/workbench/browser/parts/editor/editorParts';

//#endregion

//#region --- workbench services

import 'vs/platform/actions/common/actions.contribution';
import 'mote/editor/browser/services/hoverService/hoverService';
import 'mote/workbench/services/commands/common/commandService';
import 'mote/workbench/services/quickinput/browser/quickInputService';
import 'mote/workbench/services/editor/browser/editorPaneService';
import 'mote/workbench/services/notification/common/notificationService';
import 'mote/workbench/services/keybinding/browser/keybindingService';


import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ContextKeyService } from 'vs/platform/contextkey/browser/contextKeyService';
import { ContextViewService } from 'vs/platform/contextview/browser/contextViewService';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';


registerSingleton(IContextKeyService, ContextKeyService, InstantiationType.Delayed);
registerSingleton(IContextViewService, ContextViewService, InstantiationType.Delayed);

//#endregion

//#region --- workbench contributions

import 'mote/workbench/contrib/files/files.contribution';

//#endregion
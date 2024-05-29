/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// #######################################################################
// ###                                                                 ###
// ### !!! PLEASE ADD COMMON IMPORTS INTO WORKBENCH.COMMON.MAIN.TS !!! ###
// ###                                                                 ###
// #######################################################################


//#region --- workbench common

import 'mote/workbench/workbench.common.main';

//#endregion


//#region --- workbench parts

import 'mote/workbench/browser/parts/dialogs/dialog.web.contribution';

//#endregion


//#region --- workbench (web main)

import 'mote/workbench/browser/web.main';

//#endregion


//#region --- workbench services

import 'mote/workbench/services/integrity/browser/integrityService';
import 'mote/workbench/services/search/browser/searchService';
import 'mote/workbench/services/textfile/browser/browserTextFileService';
import 'mote/workbench/services/keybinding/browser/keyboardLayoutService';
import 'mote/workbench/services/extensions/browser/extensionService';
import 'mote/workbench/services/extensionManagement/browser/extensionsProfileScannerService';
import 'mote/workbench/services/extensions/browser/extensionsScannerService';
import 'mote/workbench/services/extensionManagement/browser/webExtensionsScannerService';
import 'mote/workbench/services/extensionManagement/common/extensionManagementServerService';
import 'mote/workbench/services/telemetry/browser/telemetryService';
import 'mote/workbench/services/url/browser/urlService';
import 'mote/workbench/services/update/browser/updateService';
import 'mote/workbench/services/workspaces/browser/workspacesService';
import 'mote/workbench/services/workspaces/browser/workspaceEditingService';
import 'mote/workbench/services/dialogs/browser/fileDialogService';
import 'mote/workbench/services/host/browser/browserHostService';
import 'mote/workbench/services/lifecycle/browser/lifecycleService';
import 'mote/workbench/services/clipboard/browser/clipboardService';
import 'mote/workbench/services/localization/browser/localeService';
import 'mote/workbench/services/path/browser/pathService';
import 'mote/workbench/services/themes/browser/browserHostColorSchemeService';
import 'mote/workbench/services/encryption/browser/encryptionService';
import 'mote/workbench/services/secrets/browser/secretStorageService';
import 'mote/workbench/services/workingCopy/browser/workingCopyBackupService';
import 'mote/workbench/services/tunnel/browser/tunnelService';
import 'mote/workbench/services/files/browser/elevatedFileService';
import 'mote/workbench/services/workingCopy/browser/workingCopyHistoryService';
import 'mote/workbench/services/userDataSync/browser/webUserDataSyncEnablementService';
import 'mote/workbench/services/userDataProfile/browser/userDataProfileStorageService';
import 'mote/workbench/services/configurationResolver/browser/configurationResolverService';
import 'vs/platform/extensionResourceLoader/browser/extensionResourceLoaderService';
import 'mote/workbench/services/auxiliaryWindow/browser/auxiliaryWindowService';

import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IAccessibilityService } from 'vs/platform/accessibility/common/accessibility';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { ContextMenuService } from 'vs/platform/contextview/browser/contextMenuService';
import { IExtensionTipsService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { ExtensionTipsService } from 'vs/platform/extensionManagement/common/extensionTipsService';
import { IWorkbenchExtensionManagementService } from 'mote/workbench/services/extensionManagement/common/extensionManagement';
import { ExtensionManagementService } from 'mote/workbench/services/extensionManagement/common/extensionManagementService';
import { LogLevel } from 'vs/platform/log/common/log';
import { UserDataSyncMachinesService, IUserDataSyncMachinesService } from 'vs/platform/userDataSync/common/userDataSyncMachines';
import { IUserDataSyncStoreService, IUserDataSyncService, IUserDataAutoSyncService, IUserDataSyncLocalStoreService, IUserDataSyncResourceProviderService } from 'vs/platform/userDataSync/common/userDataSync';
import { UserDataSyncStoreService } from 'vs/platform/userDataSync/common/userDataSyncStoreService';
import { UserDataSyncLocalStoreService } from 'vs/platform/userDataSync/common/userDataSyncLocalStoreService';
import { UserDataSyncService } from 'vs/platform/userDataSync/common/userDataSyncService';
import { IUserDataSyncAccountService, UserDataSyncAccountService } from 'vs/platform/userDataSync/common/userDataSyncAccount';
import { UserDataAutoSyncService } from 'vs/platform/userDataSync/common/userDataAutoSyncService';
import { AccessibilityService } from 'vs/platform/accessibility/browser/accessibilityService';
import { ICustomEndpointTelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { NullEndpointTelemetryService } from 'vs/platform/telemetry/common/telemetryUtils';
import { ITitleService } from 'mote/workbench/services/title/browser/titleService';
import { BrowserTitleService } from 'mote/workbench/browser/parts/titlebar/titlebarPart';
import { ITimerService, TimerService } from 'mote/workbench/services/timer/browser/timerService';
import { IDiagnosticsService, NullDiagnosticsService } from 'vs/platform/diagnostics/common/diagnostics';
import { ILanguagePackService } from 'vs/platform/languagePacks/common/languagePacks';
import { WebLanguagePacksService } from 'vs/platform/languagePacks/browser/languagePacks';

registerSingleton(IWorkbenchExtensionManagementService, ExtensionManagementService, InstantiationType.Delayed);
registerSingleton(IAccessibilityService, AccessibilityService, InstantiationType.Delayed);
registerSingleton(IContextMenuService, ContextMenuService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncStoreService, UserDataSyncStoreService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncMachinesService, UserDataSyncMachinesService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncLocalStoreService, UserDataSyncLocalStoreService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncAccountService, UserDataSyncAccountService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncService, UserDataSyncService, InstantiationType.Delayed);
registerSingleton(IUserDataSyncResourceProviderService, UserDataSyncResourceProviderService, InstantiationType.Delayed);
registerSingleton(IUserDataAutoSyncService, UserDataAutoSyncService, InstantiationType.Eager /* Eager to start auto sync */);
registerSingleton(ITitleService, BrowserTitleService, InstantiationType.Eager);
registerSingleton(IExtensionTipsService, ExtensionTipsService, InstantiationType.Delayed);
registerSingleton(ITimerService, TimerService, InstantiationType.Delayed);
registerSingleton(ICustomEndpointTelemetryService, NullEndpointTelemetryService, InstantiationType.Delayed);
registerSingleton(IDiagnosticsService, NullDiagnosticsService, InstantiationType.Delayed);
registerSingleton(ILanguagePackService, WebLanguagePacksService, InstantiationType.Delayed);

//#endregion


//#region --- workbench contributions

// Logs
import 'mote/workbench/contrib/logs/browser/logs.contribution';

// Localization
import 'mote/workbench/contrib/localization/browser/localization.contribution';

// Performance
import 'mote/workbench/contrib/performance/browser/performance.web.contribution';

// Preferences
import 'mote/workbench/contrib/preferences/browser/keyboardLayoutPicker';

// Debug
//import 'mote/workbench/contrib/debug/browser/extensionHostDebugService';

// Welcome Banner
import 'mote/workbench/contrib/welcomeBanner/browser/welcomeBanner.contribution';

// Welcome Dialog
import 'mote/workbench/contrib/welcomeDialog/browser/welcomeDialog.contribution';

// Webview
import 'mote/workbench/contrib/webview/browser/webview.web.contribution';

// Extensions Management
import 'mote/workbench/contrib/extensions/browser/extensions.web.contribution';

// Tags
import 'mote/workbench/contrib/tags/browser/workspaceTagsService';

// Issues
import 'mote/workbench/contrib/issue/browser/issue.contribution';

// Splash
import 'mote/workbench/contrib/splash/browser/splash.contribution';

//#endregion


//#region --- export workbench factory

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// Do NOT change these exports in a way that something is removed unless
// intentional. These exports are used by web embedders and thus require
// an adoption when something changes.
//
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

import { create, commands, env, window, workspace, logger } from 'mote/workbench/browser/web.factory';
import { Menu } from 'mote/workbench/browser/web.api';
import { URI } from 'vs/base/common/uri';
import { Event, Emitter } from 'vs/base/common/event';
import { Disposable } from 'vs/base/common/lifecycle';
import { GroupOrientation } from 'mote/workbench/services/editor/common/editorGroupsService';
import { UserDataSyncResourceProviderService } from 'vs/platform/userDataSync/common/userDataSyncResourceProvider';
import { RemoteAuthorityResolverError, RemoteAuthorityResolverErrorCode } from 'vs/platform/remote/common/remoteAuthorityResolver';

export {

	// Factory
	create,

	// Basic Types
	URI,
	Event,
	Emitter,
	Disposable,
	GroupOrientation,
	LogLevel,
	RemoteAuthorityResolverError,
	RemoteAuthorityResolverErrorCode,

	// Facade API
	env,
	window,
	workspace,
	commands,
	logger,
	Menu
};

//#endregion

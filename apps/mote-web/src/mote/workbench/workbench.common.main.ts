/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//#region --- editor/workbench core

import 'vs/editor/editor.all';
import '@mote/editor/editor.all';

//import 'mote/workbench/api/browser/extensionHost.contribution';
import 'mote/workbench/browser/workbench.contribution';

//#endregion


//#region --- workbench actions

import 'mote/workbench/browser/actions/textInputActions';
import 'mote/workbench/browser/actions/developerActions';
import 'mote/workbench/browser/actions/helpActions';
import 'mote/workbench/browser/actions/layoutActions';
import 'mote/workbench/browser/actions/listCommands';
import 'mote/workbench/browser/actions/navigationActions';
import 'mote/workbench/browser/actions/windowActions';
import 'mote/workbench/browser/actions/workspaceActions';
import 'mote/workbench/browser/actions/workspaceCommands';
import 'mote/workbench/browser/actions/quickAccessActions';
import 'mote/workbench/browser/actions/widgetNavigationCommands';

//#endregion


//#region --- API Extension Points

import 'mote/workbench/services/actions/common/menusExtensionPoint';
//import 'mote/workbench/api/common/configurationExtensionPoint';
//import 'mote/workbench/api/browser/viewsExtensionPoint';

//#endregion


//#region --- workbench parts

import 'mote/workbench/browser/parts/editor/editor.contribution';
import 'mote/workbench/browser/parts/editor/editorParts';
import 'mote/workbench/browser/parts/paneCompositePartService';
import 'mote/workbench/browser/parts/banner/bannerPart';
import 'mote/workbench/browser/parts/statusbar/statusbarPart';

//#endregion


//#region --- workbench services

import 'vs/platform/actions/common/actions.contribution';
import 'vs/platform/undoRedo/common/undoRedoService';
import 'mote/workbench/services/workspaces/common/editSessionIdentityService';
import 'mote/workbench/services/workspaces/common/canonicalUriService';
import 'mote/workbench/services/extensions/browser/extensionUrlHandler';
import 'mote/workbench/services/keybinding/common/keybindingEditing';
import 'mote/workbench/services/decorations/browser/decorationsService';
import 'mote/workbench/services/dialogs/common/dialogService';
import 'mote/workbench/services/progress/browser/progressService';
import 'mote/workbench/services/editor/browser/codeEditorService';
import 'mote/workbench/services/preferences/browser/preferencesService';
import 'mote/workbench/services/configuration/common/jsonEditingService';
import 'mote/workbench/services/textmodelResolver/common/textModelResolverService';
import 'mote/workbench/services/editor/browser/editorService';
import 'mote/workbench/services/editor/browser/editorResolverService';
import 'mote/workbench/services/aiEmbeddingVector/common/aiEmbeddingVectorService';
import 'mote/workbench/services/aiRelatedInformation/common/aiRelatedInformationService';
import 'mote/workbench/services/history/browser/historyService';
import 'mote/workbench/services/activity/browser/activityService';
import 'mote/workbench/services/keybinding/browser/keybindingService';
import 'mote/workbench/services/untitled/common/untitledTextEditorService';
import 'mote/workbench/services/textresourceProperties/common/textResourcePropertiesService';
import 'mote/workbench/services/textfile/common/textEditorService';
import 'mote/workbench/services/language/common/languageService';
import 'mote/workbench/services/model/common/modelService';
import 'mote/workbench/services/commands/common/commandService';
import 'mote/workbench/services/themes/browser/workbenchThemeService';
import 'mote/workbench/services/label/common/labelService';
import 'mote/workbench/services/extensions/common/extensionManifestPropertiesService';
import 'mote/workbench/services/extensionManagement/browser/extensionEnablementService';
import 'mote/workbench/services/extensionManagement/browser/builtinExtensionsScannerService';
import 'mote/workbench/services/extensionRecommendations/common/extensionIgnoredRecommendationsService';
import 'mote/workbench/services/extensionRecommendations/common/workspaceExtensionsConfig';
import 'mote/workbench/services/extensionManagement/common/extensionFeaturesManagemetService';
import 'mote/workbench/services/notification/common/notificationService';
import 'mote/workbench/services/userDataSync/common/userDataSyncUtil';
import 'mote/workbench/services/userDataProfile/browser/userDataProfileImportExportService';
import 'mote/workbench/services/userDataProfile/browser/userDataProfileManagement';
import 'mote/workbench/services/userDataProfile/common/remoteUserDataProfiles';
//import 'mote/workbench/services/remote/common/remoteExplorerService';
import 'mote/workbench/services/remote/common/remoteExtensionsScanner';
import 'mote/workbench/services/terminal/common/embedderTerminalService';
import 'mote/workbench/services/workingCopy/common/workingCopyService';
import 'mote/workbench/services/workingCopy/common/workingCopyFileService';
import 'mote/workbench/services/workingCopy/common/workingCopyEditorService';
import 'mote/workbench/services/filesConfiguration/common/filesConfigurationService';
import 'mote/workbench/services/views/browser/viewDescriptorService';
import 'mote/workbench/services/views/browser/viewsService';
import 'mote/workbench/services/quickinput/browser/quickInputService';
import 'mote/workbench/services/userDataSync/browser/userDataSyncWorkbenchService';
import 'mote/workbench/services/authentication/browser/authenticationService';
import 'mote/workbench/services/authentication/browser/authenticationExtensionsService';
import 'mote/workbench/services/authentication/browser/authenticationUsageService';
import 'mote/workbench/services/authentication/browser/authenticationAccessService';
import '@mote/editor/browser/services/hoverService/hoverService';
import 'mote/workbench/services/outline/browser/outlineService';
import 'mote/workbench/services/languageDetection/browser/languageDetectionWorkerServiceImpl';
import 'vs/editor/common/services/languageFeaturesService';
import 'vs/editor/common/services/semanticTokensStylingService';
import 'vs/editor/common/services/treeViewsDndService';
import 'mote/workbench/services/textMate/browser/textMateTokenizationFeature.contribution';
import 'mote/workbench/services/userActivity/common/userActivityService';
import 'mote/workbench/services/userActivity/browser/userActivityBrowser';
import 'mote/workbench/services/issue/browser/issueTroubleshoot';
import 'mote/workbench/services/editor/browser/editorPaneService';
import 'mote/workbench/services/editor/common/customEditorLabelService';

import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { ExtensionGalleryService } from 'vs/platform/extensionManagement/common/extensionGalleryService';
import { GlobalExtensionEnablementService } from 'vs/platform/extensionManagement/common/extensionEnablementService';
import { IExtensionGalleryService, IGlobalExtensionEnablementService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { ContextViewService } from 'vs/platform/contextview/browser/contextViewService';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IListService, ListService } from 'vs/platform/list/browser/listService';
import { IEditorWorkerService } from 'vs/editor/common/services/editorWorker';
import { EditorWorkerService } from 'vs/editor/browser/services/editorWorkerService';
import { MarkerDecorationsService } from 'vs/editor/common/services/markerDecorationsService';
import { IMarkerDecorationsService } from 'vs/editor/common/services/markerDecorations';
import { IMarkerService } from 'vs/platform/markers/common/markers';
import { MarkerService } from 'vs/platform/markers/common/markerService';
import { ContextKeyService } from 'vs/platform/contextkey/browser/contextKeyService';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/textResourceConfiguration';
import { TextResourceConfigurationService } from 'vs/editor/common/services/textResourceConfigurationService';
import { IDownloadService } from 'vs/platform/download/common/download';
import { DownloadService } from 'vs/platform/download/common/downloadService';
import { OpenerService } from 'vs/editor/browser/services/openerService';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { IgnoredExtensionsManagementService, IIgnoredExtensionsManagementService } from 'vs/platform/userDataSync/common/ignoredExtensions';
import { ExtensionStorageService, IExtensionStorageService } from 'vs/platform/extensionManagement/common/extensionStorage';
import { IUserDataSyncLogService } from 'vs/platform/userDataSync/common/userDataSync';
import { UserDataSyncLogService } from 'vs/platform/userDataSync/common/userDataSyncLog';

registerSingleton(IUserDataSyncLogService, UserDataSyncLogService, InstantiationType.Delayed);
registerSingleton(IIgnoredExtensionsManagementService, IgnoredExtensionsManagementService, InstantiationType.Delayed);
registerSingleton(IGlobalExtensionEnablementService, GlobalExtensionEnablementService, InstantiationType.Delayed);
registerSingleton(IExtensionStorageService, ExtensionStorageService, InstantiationType.Delayed);
registerSingleton(IExtensionGalleryService, ExtensionGalleryService, InstantiationType.Delayed);
registerSingleton(IContextViewService, ContextViewService, InstantiationType.Delayed);
registerSingleton(IListService, ListService, InstantiationType.Delayed);
registerSingleton(IEditorWorkerService, EditorWorkerService, InstantiationType.Eager /* registers link detection and word based suggestions for any document */);
registerSingleton(IMarkerDecorationsService, MarkerDecorationsService, InstantiationType.Delayed);
registerSingleton(IMarkerService, MarkerService, InstantiationType.Delayed);
registerSingleton(IContextKeyService, ContextKeyService, InstantiationType.Delayed);
registerSingleton(ITextResourceConfigurationService, TextResourceConfigurationService, InstantiationType.Delayed);
registerSingleton(IDownloadService, DownloadService, InstantiationType.Delayed);
registerSingleton(IOpenerService, OpenerService, InstantiationType.Delayed);

//#endregion


//#region --- workbench contributions

// Telemetry
import 'mote/workbench/contrib/telemetry/browser/telemetry.contribution';

// Preferences
import 'mote/workbench/contrib/preferences/browser/preferences.contribution';
import 'mote/workbench/contrib/preferences/browser/keybindingsEditorContribution';
import 'mote/workbench/contrib/preferences/browser/preferencesSearch';

// Performance
import 'mote/workbench/contrib/performance/browser/performance.contribution';

// Context Menus
import 'mote/workbench/contrib/contextmenu/browser/contextmenu.contribution';

// Logs
import 'mote/workbench/contrib/logs/common/logs.contribution';

// Quickaccess
import 'mote/workbench/contrib/quickaccess/browser/quickAccess.contribution';

// Explorer
import 'mote/workbench/contrib/files/browser/explorerViewlet';
import 'mote/workbench/contrib/files/browser/fileActions.contribution';
import 'mote/workbench/contrib/files/browser/files.contribution';

// Bulk Edit
import 'mote/workbench/contrib/bulkEdit/browser/bulkEditService';
import 'mote/workbench/contrib/bulkEdit/browser/preview/bulkEdit.contribution';


// Search Editor
//import 'mote/workbench/contrib/searchEditor/browser/searchEditor.contribution';

// Sash
import 'mote/workbench/contrib/sash/browser/sash.contribution';

// Markers
import 'mote/workbench/contrib/markers/browser/markers.contribution';

// Mapped Edits
import 'mote/workbench/contrib/mappedEdits/common/mappedEdits.contribution';

// Commands
import 'mote/workbench/contrib/commands/common/commands.contribution';

// Comments
import 'mote/workbench/contrib/comments/browser/comments.contribution';

// URL Support
import 'mote/workbench/contrib/url/browser/url.contribution';

// Webview
import 'mote/workbench/contrib/webview/browser/webview.contribution';
import 'mote/workbench/contrib/webviewPanel/browser/webviewPanel.contribution';
import 'mote/workbench/contrib/webviewView/browser/webviewView.contribution';
//import 'mote/workbench/contrib/customEditor/browser/customEditor.contribution';

// External Uri Opener
import 'mote/workbench/contrib/externalUriOpener/common/externalUriOpener.contribution';

// Extensions Management
import 'mote/workbench/contrib/extensions/browser/extensions.contribution';
import 'mote/workbench/contrib/extensions/browser/extensionsViewlet';

// Output View
import 'mote/workbench/contrib/output/common/outputChannelModelService';
import 'mote/workbench/contrib/output/browser/output.contribution';
import 'mote/workbench/contrib/output/browser/outputView';

// Terminal
//import 'mote/workbench/contrib/terminal/terminal.all';

// External terminal
//import 'mote/workbench/contrib/externalTerminal/browser/externalTerminal.contribution';

// Relauncher
import 'mote/workbench/contrib/relauncher/browser/relauncher.contribution';

// Emmet
import 'mote/workbench/contrib/emmet/browser/emmet.contribution';

// CodeEditor Contributions
import 'mote/workbench/contrib/codeEditor/browser/codeEditor.contribution';

// Keybindings Contributions
import 'mote/workbench/contrib/keybindings/browser/keybindings.contribution';

// Snippets
import 'mote/workbench/contrib/snippets/browser/snippets.contribution';

// Formatter Help
import 'mote/workbench/contrib/format/browser/format.contribution';

// Folding
import 'mote/workbench/contrib/folding/browser/folding.contribution';

// Limit Indicator
import 'mote/workbench/contrib/limitIndicator/browser/limitIndicator.contribution';

// Inlay Hint Accessibility
import 'mote/workbench/contrib/inlayHints/browser/inlayHintsAccessibilty';

// Themes
import 'mote/workbench/contrib/themes/browser/themes.contribution';

// Update
import 'mote/workbench/contrib/update/browser/update.contribution';


// Welcome
import 'mote/workbench/contrib/welcomeGettingStarted/browser/gettingStarted.contribution';
import 'mote/workbench/contrib/welcomeWalkthrough/browser/walkThrough.contribution';
import 'mote/workbench/contrib/welcomeViews/common/viewsWelcome.contribution';
import 'mote/workbench/contrib/welcomeViews/common/newFile.contribution';

// Call Hierarchy
import 'mote/workbench/contrib/callHierarchy/browser/callHierarchy.contribution';

// Type Hierarchy
import 'mote/workbench/contrib/typeHierarchy/browser/typeHierarchy.contribution';

// Outline
import 'mote/workbench/contrib/codeEditor/browser/outline/documentSymbolsOutline';
import 'mote/workbench/contrib/outline/browser/outline.contribution';

// Language Status
import 'mote/workbench/contrib/languageStatus/browser/languageStatus.contribution';

// Authentication
import 'mote/workbench/contrib/authentication/browser/authentication.contribution';

// User Data Sync
import 'mote/workbench/contrib/userDataSync/browser/userDataSync.contribution';

// User Data Profiles
import 'mote/workbench/contrib/userDataProfile/browser/userDataProfile.contribution';

// Continue Edit Session
import 'mote/workbench/contrib/editSessions/browser/editSessions.contribution';

// Code Actions
import 'mote/workbench/contrib/codeActions/browser/codeActions.contribution';

// Timeline
import 'mote/workbench/contrib/timeline/browser/timeline.contribution';

// Local History
import 'mote/workbench/contrib/localHistory/browser/localHistory.contribution';

// Workspace
import 'mote/workbench/contrib/workspace/browser/workspace.contribution';

// Workspaces
import 'mote/workbench/contrib/workspaces/browser/workspaces.contribution';

// List
import 'mote/workbench/contrib/list/browser/list.contribution';

// Accessibility Signals
import 'mote/workbench/contrib/accessibilitySignals/browser/accessibilitySignal.contribution';

// Deprecated Extension Migrator
import 'mote/workbench/contrib/deprecatedExtensionMigrator/browser/deprecatedExtensionMigrator.contribution';

// Bracket Pair Colorizer 2 Telemetry
import 'mote/workbench/contrib/bracketPairColorizer2Telemetry/browser/bracketPairColorizer2Telemetry.contribution';

// Accessibility
import 'mote/workbench/contrib/accessibility/browser/accessibility.contribution';

// Share
import 'mote/workbench/contrib/share/browser/share.contribution';

// Account Entitlements
import 'mote/workbench/contrib/accountEntitlements/browser/accountsEntitlements.contribution';

// Synchronized Scrolling
import 'mote/workbench/contrib/scrollLocking/browser/scrollLocking.contribution';

// Notebook
import 'mote/workbench/contrib/notebook/browser/notebook.contribution';
import 'mote/workbench/contrib/space/browser/space.contribution';
import 'mote/workbench/contrib/space/browser/spaceCommands';

//#endregion

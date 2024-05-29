/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorContributionInstantiation, registerEditorContribution } from 'vs/editor/browser/editorExtensions';
import { registerAction2 } from 'vs/platform/actions/common/actions';
import { InlineChatController } from 'mote/workbench/contrib/inlineChat/browser/inlineChatController';
import * as InlineChatActions from 'mote/workbench/contrib/inlineChat/browser/inlineChatActions';
import { IInlineChatService, INLINE_CHAT_ID, INTERACTIVE_EDITOR_ACCESSIBILITY_HELP_ID } from 'mote/workbench/contrib/inlineChat/common/inlineChat';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { InlineChatServiceImpl } from 'mote/workbench/contrib/inlineChat/common/inlineChatServiceImpl';
import { Registry } from 'vs/platform/registry/common/platform';
import { LifecyclePhase } from 'mote/workbench/services/lifecycle/common/lifecycle';
import { InlineChatNotebookContribution } from 'mote/workbench/contrib/inlineChat/browser/inlineChatNotebook';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from 'mote/workbench/common/contributions';
import { InlineChatSavingServiceImpl } from 'mote/workbench/contrib/inlineChat/browser/inlineChatSavingServiceImpl';
import { InlineChatAccessibleViewContribution } from 'mote/workbench/contrib/inlineChat/browser/inlineChatAccessibleView';
import { IInlineChatSavingService } from 'mote/workbench/contrib/inlineChat/browser/inlineChatSavingService';
import { IInlineChatSessionService } from 'mote/workbench/contrib/inlineChat/browser/inlineChatSessionService';
import { InlineChatSessionServiceImpl } from 'mote/workbench/contrib/inlineChat/browser/inlineChatSessionServiceImpl';


// --- browser

registerSingleton(IInlineChatService, InlineChatServiceImpl, InstantiationType.Delayed);
registerSingleton(IInlineChatSessionService, InlineChatSessionServiceImpl, InstantiationType.Eager); // EAGER because this registers an agent which we need swiftly
registerSingleton(IInlineChatSavingService, InlineChatSavingServiceImpl, InstantiationType.Delayed);

registerEditorContribution(INLINE_CHAT_ID, InlineChatController, EditorContributionInstantiation.Eager); // EAGER because of notebook dispose/create of editors
registerEditorContribution(INTERACTIVE_EDITOR_ACCESSIBILITY_HELP_ID, InlineChatActions.InlineAccessibilityHelpContribution, EditorContributionInstantiation.Eventually);

registerAction2(InlineChatActions.StartSessionAction);
registerAction2(InlineChatActions.CloseAction);
registerAction2(InlineChatActions.ConfigureInlineChatAction);
registerAction2(InlineChatActions.UnstashSessionAction);
registerAction2(InlineChatActions.DiscardHunkAction);
registerAction2(InlineChatActions.DiscardAction);
registerAction2(InlineChatActions.DiscardToClipboardAction);
registerAction2(InlineChatActions.DiscardUndoToNewFileAction);
registerAction2(InlineChatActions.CancelSessionAction);
registerAction2(InlineChatActions.MoveToNextHunk);
registerAction2(InlineChatActions.MoveToPreviousHunk);

registerAction2(InlineChatActions.ArrowOutUpAction);
registerAction2(InlineChatActions.ArrowOutDownAction);
registerAction2(InlineChatActions.FocusInlineChat);
registerAction2(InlineChatActions.ViewInChatAction);

registerAction2(InlineChatActions.ToggleDiffForChange);
registerAction2(InlineChatActions.AcceptChanges);

registerAction2(InlineChatActions.CopyRecordings);

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchContributionsRegistry.registerWorkbenchContribution(InlineChatNotebookContribution, LifecyclePhase.Restored);
workbenchContributionsRegistry.registerWorkbenchContribution(InlineChatAccessibleViewContribution, LifecyclePhase.Eventually);

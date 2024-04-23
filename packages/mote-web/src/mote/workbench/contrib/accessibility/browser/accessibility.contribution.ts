/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { DynamicSpeechAccessibilityConfiguration, registerAccessibilityConfiguration } from 'mote/workbench/contrib/accessibility/browser/accessibilityConfiguration';
import { IWorkbenchContributionsRegistry, WorkbenchPhase, Extensions as WorkbenchExtensions, registerWorkbenchContribution2 } from 'mote/workbench/common/contributions';
import { LifecyclePhase } from 'mote/workbench/services/lifecycle/common/lifecycle';
import { Registry } from 'vs/platform/registry/common/platform';
import { IAccessibleViewService, AccessibleViewService } from 'mote/workbench/contrib/accessibility/browser/accessibleView';
import { UnfocusedViewDimmingContribution } from 'mote/workbench/contrib/accessibility/browser/unfocusedViewDimmingContribution';
import { ExtensionAccessibilityHelpDialogContribution, CommentAccessibleViewContribution, HoverAccessibleViewContribution, InlineCompletionsAccessibleViewContribution, NotificationAccessibleViewContribution } from 'mote/workbench/contrib/accessibility/browser/accessibleViewContributions';
import { AccessibilityStatus } from 'mote/workbench/contrib/accessibility/browser/accessibilityStatus';
import { EditorAccessibilityHelpContribution } from 'mote/workbench/contrib/accessibility/browser/editorAccessibilityHelp';
import { SaveAccessibilitySignalContribution } from 'mote/workbench/contrib/accessibilitySignals/browser/saveAccessibilitySignal';
import { CommentsAccessibilityHelpContribution } from 'mote/workbench/contrib/comments/browser/commentsAccessibility';
import { DiffEditorActiveAnnouncementContribution } from 'mote/workbench/contrib/accessibilitySignals/browser/openDiffEditorAnnouncement';
import { registerAudioCueConfiguration } from 'mote/workbench/contrib/accessibility/browser/audioCueConfiguration';
import { AccessibleViewInformationService, IAccessibleViewInformationService } from 'mote/workbench/services/accessibility/common/accessibleViewInformationService';

registerAccessibilityConfiguration();
registerAudioCueConfiguration();
registerSingleton(IAccessibleViewService, AccessibleViewService, InstantiationType.Delayed);
registerSingleton(IAccessibleViewInformationService, AccessibleViewInformationService, InstantiationType.Delayed);

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(EditorAccessibilityHelpContribution, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(CommentsAccessibilityHelpContribution, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(UnfocusedViewDimmingContribution, LifecyclePhase.Restored);

workbenchRegistry.registerWorkbenchContribution(HoverAccessibleViewContribution, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(NotificationAccessibleViewContribution, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(CommentAccessibleViewContribution, LifecyclePhase.Eventually);
workbenchRegistry.registerWorkbenchContribution(InlineCompletionsAccessibleViewContribution, LifecyclePhase.Eventually);

registerWorkbenchContribution2(AccessibilityStatus.ID, AccessibilityStatus, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ExtensionAccessibilityHelpDialogContribution.ID, ExtensionAccessibilityHelpDialogContribution, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(SaveAccessibilitySignalContribution.ID, SaveAccessibilitySignalContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(DiffEditorActiveAnnouncementContribution.ID, DiffEditorActiveAnnouncementContribution, WorkbenchPhase.AfterRestored);


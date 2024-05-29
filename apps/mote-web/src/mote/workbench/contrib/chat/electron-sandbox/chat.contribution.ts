/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InlineVoiceChatAction, QuickVoiceChatAction, StartVoiceChatAction, StopListeningInQuickChatAction, StopListeningInChatEditorAction, StopListeningInChatViewAction, VoiceChatInChatViewAction, StopListeningAction, StopListeningAndSubmitAction, KeywordActivationContribution, InstallVoiceChatAction, StopListeningInTerminalChatAction, HoldToVoiceChatInChatViewAction } from 'mote/workbench/contrib/chat/electron-sandbox/actions/voiceChatActions';
import { registerAction2 } from 'vs/platform/actions/common/actions';
import { WorkbenchPhase, registerWorkbenchContribution2 } from 'mote/workbench/common/contributions';

registerAction2(StartVoiceChatAction);
registerAction2(InstallVoiceChatAction);

registerAction2(VoiceChatInChatViewAction);
registerAction2(HoldToVoiceChatInChatViewAction);
registerAction2(QuickVoiceChatAction);
registerAction2(InlineVoiceChatAction);

registerAction2(StopListeningAction);
registerAction2(StopListeningAndSubmitAction);

registerAction2(StopListeningInChatViewAction);
registerAction2(StopListeningInChatEditorAction);
registerAction2(StopListeningInQuickChatAction);
registerAction2(StopListeningInTerminalChatAction);

registerWorkbenchContribution2(KeywordActivationContribution.ID, KeywordActivationContribution, WorkbenchPhase.AfterRestored);

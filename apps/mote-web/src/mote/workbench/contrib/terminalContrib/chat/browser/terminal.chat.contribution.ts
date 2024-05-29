/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchPhase, registerWorkbenchContribution2 } from 'mote/workbench/common/contributions';
import { registerTerminalContribution } from 'mote/workbench/contrib/terminal/browser/terminalExtensions';
import { TerminalInlineChatAccessibleViewContribution } from 'mote/workbench/contrib/terminalContrib/chat/browser/terminalChatAccessibleView';
import { TerminalChatController } from 'mote/workbench/contrib/terminalContrib/chat/browser/terminalChatController';

import 'mote/workbench/contrib/terminalContrib/chat/browser/terminalChatActions';
import { TerminalChatAccessibilityHelpContribution } from 'mote/workbench/contrib/terminalContrib/chat/browser/terminalChatAccessibilityHelp';

registerTerminalContribution(TerminalChatController.ID, TerminalChatController, false);

registerWorkbenchContribution2(TerminalInlineChatAccessibleViewContribution.ID, TerminalInlineChatAccessibleViewContribution, WorkbenchPhase.Eventually);
registerWorkbenchContribution2(TerminalChatAccessibilityHelpContribution.ID, TerminalChatAccessibilityHelpContribution, WorkbenchPhase.Eventually);

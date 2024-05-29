/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerTerminalContribution } from 'mote/workbench/contrib/terminal/browser/terminalExtensions';
import { TerminalStickyScrollContribution } from 'mote/workbench/contrib/terminalContrib/stickyScroll/browser/terminalStickyScrollContribution';

import './media/stickyScroll';
import './terminalStickyScrollColorRegistry';

registerTerminalContribution(TerminalStickyScrollContribution.ID, TerminalStickyScrollContribution, true);

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Primary workbench contribution
import 'mote/workbench/contrib/terminal/browser/terminal.contribution';

// Misc extensions to the workbench contribution
import 'mote/workbench/contrib/terminal/common/environmentVariable.contribution';
import 'mote/workbench/contrib/terminal/common/terminalExtensionPoints.contribution';
import 'mote/workbench/contrib/terminal/browser/terminalView';

// Terminal contributions - Standalone extensions to the terminal, these cannot be imported from the
// primary workbench contribution)
import 'mote/workbench/contrib/terminalContrib/accessibility/browser/terminal.accessibility.contribution';
import 'mote/workbench/contrib/terminalContrib/developer/browser/terminal.developer.contribution';
import 'mote/workbench/contrib/terminalContrib/environmentChanges/browser/terminal.environmentChanges.contribution';
import 'mote/workbench/contrib/terminalContrib/find/browser/terminal.find.contribution';
import 'mote/workbench/contrib/terminalContrib/chat/browser/terminal.chat.contribution';
import 'mote/workbench/contrib/terminalContrib/highlight/browser/terminal.highlight.contribution';
import 'mote/workbench/contrib/terminalContrib/links/browser/terminal.links.contribution';
import 'mote/workbench/contrib/terminalContrib/zoom/browser/terminal.zoom.contribution';
import 'mote/workbench/contrib/terminalContrib/stickyScroll/browser/terminal.stickyScroll.contribution';
import 'mote/workbench/contrib/terminalContrib/quickFix/browser/terminal.quickFix.contribution';
import 'mote/workbench/contrib/terminalContrib/typeAhead/browser/terminal.typeAhead.contribution';
import 'mote/workbench/contrib/terminalContrib/suggest/browser/terminal.suggest.contribution';

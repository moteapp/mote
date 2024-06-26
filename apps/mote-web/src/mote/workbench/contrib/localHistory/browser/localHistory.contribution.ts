/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mote/workbench/contrib/localHistory/browser/localHistoryCommands';
import { WorkbenchPhase, registerWorkbenchContribution2 } from 'mote/workbench/common/contributions';
import { LocalHistoryTimeline } from 'mote/workbench/contrib/localHistory/browser/localHistoryTimeline';

// Register Local History Timeline
registerWorkbenchContribution2(LocalHistoryTimeline.ID, LocalHistoryTimeline, WorkbenchPhase.BlockRestore /* registrations only */);

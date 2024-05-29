/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DomActivityTracker } from 'mote/workbench/services/userActivity/browser/domActivityTracker';
import { userActivityRegistry } from 'mote/workbench/services/userActivity/common/userActivityRegistry';

userActivityRegistry.add(DomActivityTracker);

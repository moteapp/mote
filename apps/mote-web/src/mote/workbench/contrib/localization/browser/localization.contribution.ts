/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BaseLocalizationWorkbenchContribution } from 'mote/workbench/contrib/localization/common/localization.contribution';
import { Registry } from 'vs/platform/registry/common/platform';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from 'mote/workbench/common/contributions';
import { LifecyclePhase } from 'mote/workbench/services/lifecycle/common/lifecycle';

export class WebLocalizationWorkbenchContribution extends BaseLocalizationWorkbenchContribution { }

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(WebLocalizationWorkbenchContribution, LifecyclePhase.Eventually);

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from 'mote/workbench/common/contributions';
import { Registry } from 'vs/platform/registry/common/platform';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { LifecyclePhase } from 'mote/workbench/services/lifecycle/common/lifecycle';
import { INativeWorkbenchEnvironmentService } from 'mote/workbench/services/environment/electron-sandbox/environmentService';
import { DefaultConfigurationExportHelper } from 'mote/workbench/contrib/configExporter/electron-sandbox/configurationExportHelper';

export class ExtensionPoints implements IWorkbenchContribution {

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService
	) {
		// Config Exporter
		if (environmentService.args['export-default-configuration']) {
			instantiationService.createInstance(DefaultConfigurationExportHelper);
		}
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ExtensionPoints, LifecyclePhase.Restored);

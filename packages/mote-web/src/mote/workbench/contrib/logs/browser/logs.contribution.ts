/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from 'vs/platform/registry/common/platform';
import { Categories } from 'vs/platform/action/common/actionCommonCategories';
import { Action2, registerAction2 } from 'vs/platform/actions/common/actions';
import { OpenWindowSessionLogFileAction } from 'mote/workbench/contrib/logs/common/logsActions';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from 'mote/workbench/common/contributions';
import { Disposable } from 'vs/base/common/lifecycle';
import { LifecyclePhase } from 'mote/workbench/services/lifecycle/common/lifecycle';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { LogsDataCleaner } from 'mote/workbench/contrib/logs/common/logsDataCleaner';

class WebLogOutputChannels extends Disposable implements IWorkbenchContribution {

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.registerWebContributions();
	}

	private registerWebContributions(): void {
		this.instantiationService.createInstance(LogsDataCleaner);

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: OpenWindowSessionLogFileAction.ID,
					title: OpenWindowSessionLogFileAction.TITLE,
					category: Categories.Developer,
					f1: true
				});
			}
			run(servicesAccessor: ServicesAccessor): Promise<void> {
				return servicesAccessor.get(IInstantiationService).createInstance(OpenWindowSessionLogFileAction, OpenWindowSessionLogFileAction.ID, OpenWindowSessionLogFileAction.TITLE.value).run();
			}
		}));

	}

}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(WebLogOutputChannels, LifecyclePhase.Restored);

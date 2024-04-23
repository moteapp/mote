/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ErrorNoTelemetry } from 'vs/base/common/errors';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ITerminalLogService } from 'vs/platform/terminal/common/terminal';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { ITerminalInstanceService } from 'mote/workbench/contrib/terminal/browser/terminal';
import { BaseTerminalProfileResolverService } from 'mote/workbench/contrib/terminal/browser/terminalProfileResolverService';
import { ITerminalProfileService } from 'mote/workbench/contrib/terminal/common/terminal';
import { IConfigurationResolverService } from 'mote/workbench/services/configurationResolver/common/configurationResolver';
import { IHistoryService } from 'mote/workbench/services/history/common/history';
import { IRemoteAgentService } from 'mote/workbench/services/remote/common/remoteAgentService';

export class ElectronTerminalProfileResolverService extends BaseTerminalProfileResolverService {

	constructor(
		@IConfigurationResolverService configurationResolverService: IConfigurationResolverService,
		@IConfigurationService configurationService: IConfigurationService,
		@IHistoryService historyService: IHistoryService,
		@ITerminalLogService logService: ITerminalLogService,
		@IWorkspaceContextService workspaceContextService: IWorkspaceContextService,
		@ITerminalProfileService terminalProfileService: ITerminalProfileService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ITerminalInstanceService terminalInstanceService: ITerminalInstanceService
	) {
		super(
			{
				getDefaultSystemShell: async (remoteAuthority, platform) => {
					const backend = await terminalInstanceService.getBackend(remoteAuthority);
					if (!backend) {
						throw new ErrorNoTelemetry(`Cannot get default system shell when there is no backend for remote authority '${remoteAuthority}'`);
					}
					return backend.getDefaultSystemShell(platform);
				},
				getEnvironment: async (remoteAuthority) => {
					const backend = await terminalInstanceService.getBackend(remoteAuthority);
					if (!backend) {
						throw new ErrorNoTelemetry(`Cannot get environment when there is no backend for remote authority '${remoteAuthority}'`);
					}
					return backend.getEnvironment();
				}
			},
			configurationService,
			configurationResolverService,
			historyService,
			logService,
			terminalProfileService,
			workspaceContextService,
			remoteAgentService
		);
	}
}

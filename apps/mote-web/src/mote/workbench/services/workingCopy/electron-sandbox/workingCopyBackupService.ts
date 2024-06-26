/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from 'vs/nls';
import { WorkingCopyBackupService } from 'mote/workbench/services/workingCopy/common/workingCopyBackupService';
import { URI } from 'vs/base/common/uri';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IWorkingCopyBackupService } from 'mote/workbench/services/workingCopy/common/workingCopyBackup';
import { IFileService } from 'vs/platform/files/common/files';
import { ILogService } from 'vs/platform/log/common/log';
import { INativeWorkbenchEnvironmentService } from 'mote/workbench/services/environment/electron-sandbox/environmentService';
import { WorkbenchPhase, registerWorkbenchContribution2 } from 'mote/workbench/common/contributions';
import { ILifecycleService } from 'mote/workbench/services/lifecycle/common/lifecycle';
import { NativeWorkingCopyBackupTracker } from 'mote/workbench/services/workingCopy/electron-sandbox/workingCopyBackupTracker';

export class NativeWorkingCopyBackupService extends WorkingCopyBackupService {

	constructor(
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService
	) {
		super(environmentService.backupPath ? URI.file(environmentService.backupPath).with({ scheme: environmentService.userRoamingDataHome.scheme }) : undefined, fileService, logService);

		this.registerListeners();
	}

	private registerListeners(): void {

		// Lifecycle: ensure to prolong the shutdown for as long
		// as pending backup operations have not finished yet.
		// Otherwise, we risk writing partial backups to disk.
		this._register(this.lifecycleService.onWillShutdown(event => event.join(this.joinBackups(), { id: 'join.workingCopyBackups', label: localize('join.workingCopyBackups', "Backup working copies") })));
	}
}

// Register Service
registerSingleton(IWorkingCopyBackupService, NativeWorkingCopyBackupService, InstantiationType.Eager);

// Register Backup Tracker
registerWorkbenchContribution2(NativeWorkingCopyBackupTracker.ID, NativeWorkingCopyBackupTracker, WorkbenchPhase.BlockStartup);

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractTextFileService } from 'mote/workbench/services/textfile/browser/textFileService';
import { ITextFileService, TextFileEditorModelState } from 'mote/workbench/services/textfile/common/textfiles';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IWorkbenchEnvironmentService } from 'mote/workbench/services/environment/common/environmentService';
import { ICodeEditorService } from 'vs/editor/browser/services/codeEditorService';
import { IModelService } from 'vs/editor/common/services/model';
import { ILanguageService } from 'vs/editor/common/languages/language';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/textResourceConfiguration';
import { IDialogService, IFileDialogService } from 'vs/platform/dialogs/common/dialogs';
import { IFileService } from 'vs/platform/files/common/files';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ILogService } from 'vs/platform/log/common/log';
import { IElevatedFileService } from 'mote/workbench/services/files/common/elevatedFileService';
import { IFilesConfigurationService } from 'mote/workbench/services/filesConfiguration/common/filesConfigurationService';
import { ILifecycleService } from 'mote/workbench/services/lifecycle/common/lifecycle';
import { IPathService } from 'mote/workbench/services/path/common/pathService';
import { IUntitledTextEditorService } from 'mote/workbench/services/untitled/common/untitledTextEditorService';
import { IUriIdentityService } from 'vs/platform/uriIdentity/common/uriIdentity';
import { IWorkingCopyFileService } from 'mote/workbench/services/workingCopy/common/workingCopyFileService';
import { IDecorationsService } from 'mote/workbench/services/decorations/common/decorations';

export class BrowserTextFileService extends AbstractTextFileService {

	constructor(
		@IFileService fileService: IFileService,
		@IUntitledTextEditorService untitledTextEditorService: IUntitledTextEditorService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IModelService modelService: IModelService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IDialogService dialogService: IDialogService,
		@IFileDialogService fileDialogService: IFileDialogService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IPathService pathService: IPathService,
		@IWorkingCopyFileService workingCopyFileService: IWorkingCopyFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILanguageService languageService: ILanguageService,
		@IElevatedFileService elevatedFileService: IElevatedFileService,
		@ILogService logService: ILogService,
		@IDecorationsService decorationsService: IDecorationsService
	) {
		super(fileService, untitledTextEditorService, lifecycleService, instantiationService, modelService, environmentService, dialogService, fileDialogService, textResourceConfigurationService, filesConfigurationService, codeEditorService, pathService, workingCopyFileService, uriIdentityService, languageService, logService, elevatedFileService, decorationsService);

		this.registerListeners();
	}

	private registerListeners(): void {

		// Lifecycle
		this._register(this.lifecycleService.onBeforeShutdown(event => event.veto(this.onBeforeShutdown(), 'veto.textFiles')));
	}

	private onBeforeShutdown(): boolean {
		if (this.files.models.some(model => model.hasState(TextFileEditorModelState.PENDING_SAVE))) {
			return true; // files are pending to be saved: veto (as there is no support for long running operations on shutdown)
		}

		return false;
	}
}

registerSingleton(ITextFileService, BrowserTextFileService, InstantiationType.Eager);

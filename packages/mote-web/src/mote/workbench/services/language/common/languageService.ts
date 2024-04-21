/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from 'vs/nls';
import { clearConfiguredLanguageAssociations, registerConfiguredLanguageAssociation } from 'vs/editor/common/services/languagesAssociations';
import { joinPath } from 'vs/base/common/resources';
import { URI } from 'vs/base/common/uri';
import { ILanguageExtensionPoint, ILanguageService } from 'vs/editor/common/languages/language';
import { LanguageService } from 'vs/editor/common/services/languageService';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { FILES_ASSOCIATIONS_CONFIG, IFilesConfiguration } from 'vs/platform/files/common/files';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { ILogService } from 'mote/platform/log/common/log';

export interface IRawLanguageExtensionPoint {
	id: string;
	extensions: string[];
	filenames: string[];
	filenamePatterns: string[];
	firstLine: string;
	aliases: string[];
	mimetypes: string[];
	configuration: string;
	icon: { light: string; dark: string };
}


export class WorkbenchLanguageService extends LanguageService {
	private _configurationService: IConfigurationService;
	//private _extensionService: IExtensionService;

	constructor(
		//@IExtensionService extensionService: IExtensionService,
		@IConfigurationService configurationService: IConfigurationService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ILogService private readonly logService: ILogService
	) {
		super(environmentService.verbose || environmentService.isExtensionDevelopment || !environmentService.isBuilt);
		this._configurationService = configurationService;
		//this._extensionService = extensionService;

		this.updateMime();
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(FILES_ASSOCIATIONS_CONFIG)) {
				this.updateMime();
			}
		}));
	}

	private updateMime(): void {
		const configuration = this._configurationService.getValue<IFilesConfiguration>();

		// Clear user configured mime associations
		clearConfiguredLanguageAssociations();

		// Register based on settings
		if (configuration.files?.associations) {
			Object.keys(configuration.files.associations).forEach(pattern => {
				const langId = configuration.files.associations[pattern];
				if (typeof langId !== 'string') {
					this.logService.warn(`Ignoring configured 'files.associations' for '${pattern}' because its type is not a string but '${typeof langId}'`);

					return; // https://github.com/microsoft/vscode/issues/147284
				}

				const mimeType = this.getMimeType(langId) || `text/x-${langId}`;

				registerConfiguredLanguageAssociation({ id: langId, mime: mimeType, filepattern: pattern });
			});
		}

		this._onDidChange.fire();
	}
}

registerSingleton(ILanguageService, WorkbenchLanguageService, InstantiationType.Eager);

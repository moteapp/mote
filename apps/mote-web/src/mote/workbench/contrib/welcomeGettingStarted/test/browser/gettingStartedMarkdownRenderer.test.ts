/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { FileAccess } from 'vs/base/common/network';
import { ensureNoDisposablesAreLeakedInTestSuite } from 'vs/base/test/common/utils';
import { LanguageService } from 'vs/editor/common/services/languageService';
import { TestNotificationService } from 'vs/platform/notification/test/common/testNotificationService';
import { GettingStartedDetailsRenderer } from 'mote/workbench/contrib/welcomeGettingStarted/browser/gettingStartedDetailsRenderer';
import { convertInternalMediaPathToFileURI } from 'mote/workbench/contrib/welcomeGettingStarted/browser/gettingStartedService';
import { TestFileService } from 'mote/workbench/test/browser/workbenchTestServices';
import { TestExtensionService } from 'mote/workbench/test/common/workbenchTestServices';


suite('Getting Started Markdown Renderer', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('renders theme picker markdown with images', async () => {
		const fileService = new TestFileService();
		const languageService = new LanguageService();
		const renderer = new GettingStartedDetailsRenderer(fileService, new TestNotificationService(), new TestExtensionService(), languageService);
		const mdPath = convertInternalMediaPathToFileURI('theme_picker').with({ query: JSON.stringify({ moduleId: 'mote/workbench/contrib/welcomeGettingStarted/common/media/theme_picker' }) });
		const mdBase = FileAccess.asFileUri('mote/workbench/contrib/welcomeGettingStarted/common/media/');
		const rendered = await renderer.renderMarkdown(mdPath, mdBase);
		const imageSrcs = [...rendered.matchAll(/img src="[^"]*"/g)].map(match => match[0]);
		for (const src of imageSrcs) {
			const targetSrcFormat = /^img src=".*\/vs\/workbench\/contrib\/welcomeGettingStarted\/common\/media\/.*.png"$/;
			assert(targetSrcFormat.test(src), `${src} didnt match regex`);
		}
		languageService.dispose();
	});
});

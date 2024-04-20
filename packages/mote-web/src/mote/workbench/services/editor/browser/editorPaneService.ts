/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorPaneDescriptor } from 'mote/workbench/browser/editorBrowser';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IEditorPaneService } from 'mote/workbench/services/editor/common/editorPaneService';

export class EditorPaneService implements IEditorPaneService {

	declare readonly _serviceBrand: undefined;

	readonly onWillInstantiateEditorPane = EditorPaneDescriptor.onWillInstantiateEditorPane;

	didInstantiateEditorPane(typeId: string): boolean {
		return EditorPaneDescriptor.didInstantiateEditorPane(typeId);
	}
}

registerSingleton(IEditorPaneService, EditorPaneService, InstantiationType.Delayed);

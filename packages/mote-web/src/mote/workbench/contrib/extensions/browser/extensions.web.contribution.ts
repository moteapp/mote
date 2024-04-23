/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from 'vs/nls';
import { Registry } from 'vs/platform/registry/common/platform';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { EditorPaneDescriptor, IEditorPaneRegistry } from 'mote/workbench/browser/editor';
import { RuntimeExtensionsEditor } from 'mote/workbench/contrib/extensions/browser/browserRuntimeExtensionsEditor';
import { RuntimeExtensionsInput } from 'mote/workbench/contrib/extensions/common/runtimeExtensionsInput';
import { EditorExtensions } from 'mote/workbench/common/editor';

// Running Extensions
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(RuntimeExtensionsEditor, RuntimeExtensionsEditor.ID, localize('runtimeExtension', "Running Extensions")),
	[new SyncDescriptor(RuntimeExtensionsInput)]
);

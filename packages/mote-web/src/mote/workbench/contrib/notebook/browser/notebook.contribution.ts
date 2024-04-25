import { Disposable } from 'vs/base/common/lifecycle';
import { EditorPaneDescriptor, IEditorPaneRegistry } from 'mote/workbench/browser/editor';
import { EditorExtensions, IEditorFactoryRegistry, IEditorSerializer } from 'mote/workbench/common/editor';
import { Registry } from 'vs/platform/registry/common/platform';
import { NotebookEditor } from './notebookEditor';
import { SyncDescriptor } from 'vs/platform/instantiation/common/descriptors';
import { NotebookEditorInput, NotebookEditorInputOptions } from 'mote/workbench/contrib/notebook/common/notebookEditorInput';
import { EditorInput } from 'mote/workbench/common/editor/editorInput';
import { URI } from 'vs/base/common/uri';
import { assertType } from 'vs/base/common/types';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { parse } from 'vs/base/common/marshalling';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from 'mote/workbench/common/contributions';
import { EditorInputFactoryFunction, EditorInputFactoryObject, IEditorResolverService, RegisteredEditorPriority, UntitledEditorInputFactoryFunction } from 'mote/workbench/services/editor/common/editorResolverService';
import { localize } from 'vs/nls';
import { ILabelService } from 'vs/platform/label/common/label';
import { Schemas } from 'vs/base/common/network';
import { isWindows } from 'vs/base/common/platform';
import { sep } from 'vs/base/common/path';

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		NotebookEditor,
		NotebookEditor.ID,
		'Notebook Editor'
	),
	[
		new SyncDescriptor(NotebookEditorInput)
	]
);

type SerializedNotebookEditorData = { resource: URI; preferredResource: URI; viewType: string, options?: NotebookEditorInputOptions };

class NotebookEditorSerializer implements IEditorSerializer {
	canSerialize(): boolean {
		return true;
	}

	serialize(input: EditorInput): string {
		assertType(input instanceof NotebookEditorInput);
		const data: SerializedNotebookEditorData = {
			resource: input.resource,
			preferredResource: input.preferredResource,
			viewType: input.viewType,
			options: input.options
		};
		return JSON.stringify(data);
	}

	deserialize(instantiationService: IInstantiationService, raw: string) {
		const data = <SerializedNotebookEditorData>parse(raw);
		if (!data) {
			return undefined;
		}
		const { resource, preferredResource, options, viewType } = data;
		if (!data || !URI.isUri(resource)) {
			return undefined;
		}

		const input = NotebookEditorInput.getOrCreate(instantiationService, resource, preferredResource, viewType, options);
		return input;
	}
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(
	NotebookEditorInput.ID,
	NotebookEditorSerializer
);

//#region Contributions

class NotebookEditorContributions extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.notebook';

	constructor(
		@IEditorResolverService editorResolverService: IEditorResolverService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();

		const notebookEditorInputFactory: EditorInputFactoryFunction = ({ resource, options }) => {
			let preferredResource = resource;
			const notebookOptions = { ...options };
			const editor = NotebookEditorInput.getOrCreate(this.instantiationService, resource, preferredResource, 'notebook');
			return { editor, options: notebookOptions };
		};

		const notebookUntitledEditorFactory: UntitledEditorInputFactoryFunction = async ({ resource, options }) => {
			if (!resource) {
				resource = URI.from({ scheme: 'untitled', path: `Untitled-${Date.now()}` });
			}
			resource.scheme === 'untitled' ? resource : URI.from({ scheme: 'untitled', path: resource?.path });
			return { editor: NotebookEditorInput.getOrCreate(this.instantiationService, resource, undefined, 'workbench.input.notebook'), options };
		};

		const notebookFactoryObject: EditorInputFactoryObject = {
			createEditorInput: notebookEditorInputFactory,
			createUntitledEditorInput: notebookUntitledEditorFactory
		};

		this._register(editorResolverService.registerEditor(
			'*',
			{
				id: NotebookEditorInput.ID,
				label: localize('defaultNotebookEditor.displayName', "Notebook Editor"),
				priority: RegisteredEditorPriority.builtin,
			},
			{
				singlePerResource: true,
			},
			notebookFactoryObject
		));
	}
}

class NotebookUriLabelContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.notebookUriLabel';

	constructor(@ILabelService labelService: ILabelService) {
		labelService.registerFormatter({
			scheme: Schemas.untitled,
			formatting: {
				label: 'Untitled',
				separator: sep,
				tildify: !isWindows,
				normalizeDriveLetter: isWindows,
				authorityPrefix: sep + sep,
				workspaceSuffix: ''
			}
		});
	}
}

registerWorkbenchContribution2(NotebookEditorContributions.ID, NotebookEditorContributions, WorkbenchPhase.AfterRestored);

// Register uri display for file uris
registerWorkbenchContribution2(NotebookUriLabelContribution.ID, NotebookUriLabelContribution, WorkbenchPhase.BlockStartup);


//#endregion
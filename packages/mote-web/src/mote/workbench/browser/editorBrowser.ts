import { IEditorDescriptor as ICommonEditorDescriptor, IWillInstantiateEditorPaneEvent } from 'mote/workbench/common/editorCommon';
import { EditorPane } from 'mote/workbench/browser/parts/editor/editorPane';
import { Emitter } from 'vs/base/common/event';
import { BrandedService, IConstructorSignature, IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IEditorGroup } from 'mote/workbench/services/editor/common/editorGroupsService';

//#region Editor Pane Registry


export interface IEditorPaneDescriptor extends ICommonEditorDescriptor<EditorPane> { }

/**
 * A lightweight descriptor of an editor pane. The descriptor is deferred so that heavy editor
 * panes can load lazily in the workbench.
 */
export class EditorPaneDescriptor implements IEditorPaneDescriptor {

    private static readonly instantiatedEditorPanes = new Set<string>();
	static didInstantiateEditorPane(typeId: string): boolean {
		return EditorPaneDescriptor.instantiatedEditorPanes.has(typeId);
	}

	private static readonly _onWillInstantiateEditorPane = new Emitter<IWillInstantiateEditorPaneEvent>();
	static readonly onWillInstantiateEditorPane = EditorPaneDescriptor._onWillInstantiateEditorPane.event;

	static create<Services extends BrandedService[]>(
		ctor: { new(group: IEditorGroup, ...services: Services): EditorPane },
		typeId: string,
		name: string
	): EditorPaneDescriptor {
		return new EditorPaneDescriptor(ctor as IConstructorSignature<EditorPane, [IEditorGroup]>, typeId, name);
	}

    private constructor(
		private readonly ctor: IConstructorSignature<EditorPane, [IEditorGroup]>,
		readonly typeId: string,
		readonly name: string
	) { }

    instantiate(instantiationService: IInstantiationService, group: IEditorGroup): EditorPane {
		EditorPaneDescriptor._onWillInstantiateEditorPane.fire({ typeId: this.typeId });

		const pane = instantiationService.createInstance(this.ctor, group);
		EditorPaneDescriptor.instantiatedEditorPanes.add(this.typeId);

		return pane;
	}

	describes(editorPane: EditorPane): boolean {
		return editorPane.getId() === this.typeId;
	}
}

//#endregion
import { IViewSize } from 'vs/base/browser/ui/grid/gridview';
import { IBoundarySashes } from 'vs/base/browser/ui/sash/sash';
import { LayoutPriority } from 'vs/base/browser/ui/splitview/splitview';
import { Event, Relay } from 'vs/base/common/event';
import { IEditorGroupView, IEditorGroupsView, IEditorPartsView } from './editor';
import { EditorPanes } from './editorPanes';
import { Disposable } from 'vs/base/common/lifecycle';
import { GroupIdentifier } from 'mote/workbench/common/editorCommon';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { coalesce } from 'vs/base/common/arrays';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { EditorGroupModel, ISerializedEditorGroupModel } from 'mote/workbench/common/editor/editorGroupModel';

export class EditorGroupView extends Disposable implements IEditorGroupView {

    static createNew(editorPartsView: IEditorPartsView, groupsView: IEditorGroupsView, groupIndex: number, groupsLabel: string, instantiationService: IInstantiationService): IEditorGroupView {
		return instantiationService.createInstance(EditorGroupView, null, groupsView, groupIndex, groupsLabel, editorPartsView);
	}

    static createFromSerialized(serialized: ISerializedEditorGroupModel, editorPartsView: IEditorPartsView, groupsView: IEditorGroupsView, groupIndex: number, groupsLabel: string, instantiationService: IInstantiationService): IEditorGroupView {
		return instantiationService.createInstance(EditorGroupView, serialized, groupsView, groupIndex, groupsLabel, editorPartsView);
	}

    static createCopy(copyFrom: IEditorGroupView, editorPartsView: IEditorPartsView, groupsView: IEditorGroupsView, groupIndex: number, groupsLabel: string, instantiationService: IInstantiationService): IEditorGroupView {
		return instantiationService.createInstance(EditorGroupView, copyFrom, groupsView, groupIndex, groupsLabel, editorPartsView);
	}

    //private readonly model: EditorGroupModel;
    private active: boolean | undefined;
    private readonly editorPane: EditorPanes;

    private readonly scopedInstantiationService: IInstantiationService;

    constructor(
        from: IEditorGroupView | ISerializedEditorGroupModel | null,
        readonly groupsView: IEditorGroupsView,
        private _index: number,
        private groupsLabel: string,
        private readonly editorPartsView: IEditorPartsView,
        @IInstantiationService private readonly instantiationService: IInstantiationService,
    ) {
        super();

        //#region create()
		{
            // Container
			this.element.classList.add(...coalesce(['editor-group-container']));

            // Scoped instantiation service
			this.scopedInstantiationService = this.instantiationService.createChild(new ServiceCollection());

            this.editorPane = this._register(this.scopedInstantiationService.createInstance(EditorPanes));
        }
    }

    //#region basics()

	get id(): GroupIdentifier {
		return 1; //this.model.id;
	}

    //#endregion
    
    setActive(isActive: boolean): void {
        
        this.active = isActive;

		// Update container
		this.element.classList.toggle('active', isActive);
		this.element.classList.toggle('inactive', !isActive);
    }
    dispose(): void {
        throw new Error('Method not implemented.');
    }
   

    setVisible?(visible: boolean): void {
        throw new Error('Method not implemented.');
    }
    
    setBoundarySashes(sashes: IBoundarySashes): void {
		this.editorPane.setBoundarySashes(sashes);
	}

    focus(): void {
        throw new Error('Method not implemented.');
    }
    
    //#region ISerializableView

	readonly element: HTMLElement = document.createElement('div');

	get minimumWidth(): number { return this.editorPane.minimumWidth; }
	get minimumHeight(): number { return this.editorPane.minimumHeight; }
	get maximumWidth(): number { return this.editorPane.maximumWidth; }
	get maximumHeight(): number { return this.editorPane.maximumHeight; }

    private _onDidChange = this._register(new Relay<{ width: number; height: number } | undefined>());
	readonly onDidChange = this._onDidChange.event;
    
    layout(width: number, height: number, top: number, left: number): void {
        throw new Error('Method not implemented.');
    }

    toJSON(): object {
        throw new Error('Method not implemented.');
    }

    //#endregion
}
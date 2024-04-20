import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { EditorPart, IEditorPartUIState } from './editorPart';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { IAuxiliaryEditorPart } from 'mote/workbench/services/editor/common/editorGroupsService';
import { IEditorPartsView } from './editor';
import { IWorkbenchLayoutService } from 'mote/workbench/services/layout/workbenchLayoutService';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { IAuxiliaryWindowOpenOptions } from 'mote/workbench/services/auxiliaryWindow/browser/auxiliaryWindowService';

export interface IAuxiliaryEditorPartOpenOptions extends IAuxiliaryWindowOpenOptions {
    readonly state?: IEditorPartUIState;
}

export interface ICreateAuxiliaryEditorPartResult {
	readonly part: AuxiliaryEditorPartImpl;
	readonly instantiationService: IInstantiationService;
	readonly disposables: DisposableStore;
}

export class AuxiliaryEditorPart {

    constructor(
        private readonly editorPartsView: IEditorPartsView,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
    ) {

    }

    async create(label: string, options?: IAuxiliaryEditorPartOpenOptions): Promise<ICreateAuxiliaryEditorPartResult> {

        const disposables = new DisposableStore();

        const editorPart = disposables.add(this.instantiationService.createInstance(AuxiliaryEditorPartImpl, 1, this.editorPartsView));

        // Have a InstantiationService that is scoped to the auxiliary window
		const instantiationService = this.instantiationService.createChild(new ServiceCollection());

        return {
			part: editorPart,
			instantiationService,
			disposables
		};
    }
}

class AuxiliaryEditorPartImpl extends EditorPart implements IAuxiliaryEditorPart {

    private static COUNTER = 1;

    constructor(
        windowId: number,
		editorPartsView: IEditorPartsView,
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
        @IInstantiationService instantiationService: IInstantiationService,
    ) {
        const id = AuxiliaryEditorPartImpl.COUNTER++;
        super(`auxiliary.editor.part.${id}`, windowId, '', editorPartsView, layoutService, instantiationService);
    }

    close(): boolean {
        return true;
    }
}
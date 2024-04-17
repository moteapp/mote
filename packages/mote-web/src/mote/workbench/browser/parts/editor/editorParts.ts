import { MultiWindowParts } from 'mote/workbench/browser/part';
import { EditorPart, MainEditorPart } from './editorPart';
import { IAuxiliaryEditorPart, IEditorGroupsService } from 'mote/workbench/service/editor/common/editorGroupsService';
import { IEditorGroupView, IEditorPartsView } from './editor';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { Emitter } from 'vs/base/common/event';
import { GroupIdentifier } from 'mote/workbench/common/editorCommon';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { AuxiliaryEditorPart, IAuxiliaryEditorPartOpenOptions } from './auxiliaryEditorPart';

export class EditorParts extends MultiWindowParts<EditorPart> implements IEditorGroupsService, IEditorPartsView {
    
    declare readonly _serviceBrand: undefined;

    private readonly _onDidAddGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidAddGroup = this._onDidAddGroup.event;

	private readonly _onDidRemoveGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidRemoveGroup = this._onDidRemoveGroup.event;

	private readonly _onDidMoveGroup = this._register(new Emitter<IEditorGroupView>());
	readonly onDidMoveGroup = this._onDidMoveGroup.event;

	readonly mainPart = this._register(this.createMainEditorPart());

    constructor(
        @IInstantiationService private readonly instantiationService: IInstantiationService,
    ) {
        super('workbench.editorParts');

        this._register(this.registerPart(this.mainPart));
    }

    protected createMainEditorPart(): MainEditorPart {
		return this.instantiationService.createInstance(MainEditorPart, this);
	}

    override getPart(group: IEditorGroupView | GroupIdentifier): EditorPart;
	override getPart(element: HTMLElement): EditorPart;
	override getPart(groupOrElement: IEditorGroupView | GroupIdentifier | HTMLElement): EditorPart {
        if (this._parts.size > 1) {
			if (groupOrElement instanceof HTMLElement) {
				const element = groupOrElement;

				return this.getPartByDocument(element.ownerDocument);
			} else {
				const group = groupOrElement;

				let id: GroupIdentifier;
				if (typeof group === 'number') {
					id = group;
				} else {
					id = group.id;
				}

				for (const part of this._parts) {
					if (part.hasGroup(id)) {
						return part;
					}
				}
			}
		}

		return this.mainPart;
    }

    //#region IEditorGroupsService

    get activeGroup(): IEditorGroupView {
		return this.activePart.activeGroup;
	}

    getGroup(identifier: GroupIdentifier): IEditorGroupView | undefined {
		if (this._parts.size > 1) {
			for (const part of this._parts) {
				const group = part.getGroup(identifier);
				if (group) {
					return group;
				}
			}
		}

		return this.mainPart.getGroup(identifier);
	}

    //#endregion

    //#region Auxiliary Editor Parts

    async createAuxiliaryEditorPart(options?: IAuxiliaryEditorPartOpenOptions): Promise<IAuxiliaryEditorPart> {
        const { part, instantiationService, disposables } = await this.instantiationService.createInstance(AuxiliaryEditorPart, this).create('auxiliary', options);

        return part;
    }

    //#endregion
}

registerSingleton(IEditorGroupsService, EditorParts, InstantiationType.Eager);

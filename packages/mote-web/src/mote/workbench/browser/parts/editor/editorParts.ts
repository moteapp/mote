import { MultiWindowParts } from 'mote/workbench/browser/part';
import { EditorPart, MainEditorPart } from './editorPart';
import { EditorGroupLayout, IAuxiliaryEditorPart, IAuxiliaryEditorPartCreateEvent, IEditorGroupsService } from 'mote/workbench/services/editor/common/editorGroupsService';
import { IEditorGroupView, IEditorPartsView } from './editor';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { Emitter } from 'vs/base/common/event';
import { GroupIdentifier } from 'mote/workbench/common/editorCommon';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { AuxiliaryEditorPart, IAuxiliaryEditorPartOpenOptions } from './auxiliaryEditorPart';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { DeferredPromise } from 'vs/base/common/async';

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

	//#region Lifecycle

	private _isReady = false;
	get isReady(): boolean { return this._isReady; }

	private readonly whenReadyPromise = new DeferredPromise<void>();
	readonly whenReady = this.whenReadyPromise.p;

	private readonly whenRestoredPromise = new DeferredPromise<void>();
	readonly whenRestored = this.whenRestoredPromise.p;

	//#endregion

	applyLayout(layout: EditorGroupLayout): void {
		this.activePart.applyLayout(layout);
	}

	getLayout(): EditorGroupLayout {
		return this.activePart.getLayout();
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

	private readonly _onDidCreateAuxiliaryEditorPart = this._register(new Emitter<IAuxiliaryEditorPartCreateEvent>());
	readonly onDidCreateAuxiliaryEditorPart = this._onDidCreateAuxiliaryEditorPart.event;

    async createAuxiliaryEditorPart(options?: IAuxiliaryEditorPartOpenOptions): Promise<IAuxiliaryEditorPart> {
        const { part, instantiationService, disposables } = await this.instantiationService.createInstance(AuxiliaryEditorPart, this).create('auxiliary', options);

		// Events
		this._onDidAddGroup.fire(part.activeGroup);

		const eventDisposables = disposables.add(new DisposableStore());
		this._onDidCreateAuxiliaryEditorPart.fire({ part, instantiationService, disposables: eventDisposables });


        return part;
    }

    //#endregion

	//#region Main Editor Part Only

	get partOptions() { return this.mainPart.partOptions; }
	get onDidChangeEditorPartOptions() { return this.mainPart.onDidChangeEditorPartOptions; }

	//#endregion
}

registerSingleton(IEditorGroupsService, EditorParts, InstantiationType.Eager);

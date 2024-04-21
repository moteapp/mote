import { Disposable, IDisposable } from 'vs/base/common/lifecycle';
import { IViewsService } from 'mote/workbench/services/views/common/viewsService';
import { ViewPaneContainer } from 'mote/workbench/browser/parts/views/viewPaneContainer';
import { Event, Emitter } from 'vs/base/common/event';
import { IContextKey, IContextKeyService, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { IView, IViewDescriptor, IViewDescriptorService, ViewContainerLocation } from 'mote/workbench/common/views';
import { FocusedViewContext, getVisbileViewContextKey } from 'mote/workbench/common/contextKeys';
import { IWorkbenchLayoutService } from 'mote/workbench/services/layout/browser/workbenchLayoutService';
import { IPaneComposite } from 'mote/workbench/common/panecomposite';

export class ViewsService extends Disposable implements IViewsService {

	declare readonly _serviceBrand: undefined;

    private readonly viewDisposable: Map<IViewDescriptor, IDisposable>;
	private readonly viewPaneContainers: Map<string, ViewPaneContainer>;

	private readonly _onDidChangeViewVisibility: Emitter<{ id: string; visible: boolean }> = this._register(new Emitter<{ id: string; visible: boolean }>());
	readonly onDidChangeViewVisibility: Event<{ id: string; visible: boolean }> = this._onDidChangeViewVisibility.event;

	private readonly _onDidChangeViewContainerVisibility = this._register(new Emitter<{ id: string; visible: boolean; location: ViewContainerLocation }>());
	readonly onDidChangeViewContainerVisibility = this._onDidChangeViewContainerVisibility.event;

	private readonly _onDidChangeFocusedView = this._register(new Emitter<void>());
	readonly onDidChangeFocusedView = this._onDidChangeFocusedView.event;

	private readonly enabledViewContainersContextKeys: Map<string, IContextKey<boolean>>;
	private readonly visibleViewContextKeys: Map<string, IContextKey<boolean>>;
	private readonly focusedViewContextKey: IContextKey<string>;

    constructor(
        @IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
        @IContextKeyService private readonly contextKeyService: IContextKeyService,
        @IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
    ) {
        super();

        this.viewDisposable = new Map<IViewDescriptor, IDisposable>();
		this.enabledViewContainersContextKeys = new Map<string, IContextKey<boolean>>();
		this.visibleViewContextKeys = new Map<string, IContextKey<boolean>>();
		this.viewPaneContainers = new Map<string, ViewPaneContainer>();

        this.focusedViewContextKey = FocusedViewContext.bindTo(contextKeyService);
    }

    async openView<T extends IView>(id: string, focus?: boolean): Promise<T | null> {
        const viewContainer = this.viewDescriptorService.getViewContainerByViewId(id);
		if (!viewContainer) {
			return null;
		}
        return null;
    }

    closeView(id: string): void {

    }

    async openViewContainer(id: string, focus?: boolean): Promise<IPaneComposite | null> {
        /*
		const viewContainer = this.viewDescriptorService.getViewContainerById(id);
		if (viewContainer) {
			const viewContainerLocation = this.viewDescriptorService.getViewContainerLocation(viewContainer);
			if (viewContainerLocation !== null) {
				const paneComposite = await this.paneCompositeService.openPaneComposite(id, viewContainerLocation, focus);
				return paneComposite || null;
			}
		}
        */

		return null;
	}

    async closeViewContainer(id: string): Promise<void> {

    }

    private onViewsAdded(added: IView[]): void {
		for (const view of added) {
			this.onViewsVisibilityChanged(view, view.isBodyVisible());
		}
	}

	private onViewsVisibilityChanged(view: IView, visible: boolean): void {
		this.getOrCreateActiveViewContextKey(view).set(visible);
		this._onDidChangeViewVisibility.fire({ id: view.id, visible: visible });
	}

	private onViewsRemoved(removed: IView[]): void {
		for (const view of removed) {
			this.onViewsVisibilityChanged(view, false);
		}
	}

    private getOrCreateActiveViewContextKey(view: IView): IContextKey<boolean> {
		const visibleContextKeyId = getVisbileViewContextKey(view.id);
		let contextKey = this.visibleViewContextKeys.get(visibleContextKeyId);
		if (!contextKey) {
			contextKey = new RawContextKey(visibleContextKeyId, false).bindTo(this.contextKeyService);
			this.visibleViewContextKeys.set(visibleContextKeyId, contextKey);
		}
		return contextKey;
	}
}
import { Part } from 'mote/workbench/browser/part';
import { IWorkbenchLayoutService, Parts } from 'mote/workbench/services/layout/workbenchLayoutService';
import { MutableDisposable } from 'vs/base/common/lifecycle';
import { IPaneCompositeBarOptions, PaneCompositeBar } from 'mote/workbench/browser/parts/paneCompositeBar';
import { IPaneCompositePart } from 'mote/workbench/browser/parts/paneCompositePart';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ActionsOrientation } from 'vs/base/browser/ui/actionbar/actionbar';
import { clearNode } from 'mote/base/browser/dom';

export class ActivitybarPart extends Part {

	static readonly ACTION_HEIGHT = 48;

	static readonly pinnedViewContainersKey = 'workbench.activity.pinnedViewlets';
	static readonly placeholderViewContainersKey = 'workbench.activity.placeholderViewlets';
	static readonly viewContainersWorkspaceStateKey = 'workbench.activity.viewletsWorkspaceState';

	private readonly compositeBar = this._register(new MutableDisposable<PaneCompositeBar>());
	private content: HTMLElement | undefined;

    constructor(
		private readonly paneCompositePart: IPaneCompositePart,
        @IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
    ){
        super(Parts.ACTIVITYBAR_PART, {}, layoutService);
    }

	override create(parent: HTMLElement, options?: object | undefined): void {
		super.create(parent, options);

		parent.style.backgroundColor = '#f8f8f8';
	}

	show(focus?: boolean): void {
		if (!this.content) {
			return;
		}

		if (!this.compositeBar.value) {
			this.compositeBar.value = this.createCompositeBar();
			this.compositeBar.value.create(this.content);

			if (this.dimension) {
				this.layout(this.dimension.width, this.dimension.height);
			}
		}

		if (focus) {
			this.focus();
		}
	}

	hide(): void {
		if (!this.compositeBar.value) {
			return;
		}

		this.compositeBar.clear();

		if (this.content) {
			clearNode(this.content);
		}
	}

	focus(index?: number): void {
		this.compositeBar.value?.focus();
	}

	private createCompositeBar(): PaneCompositeBar {
		return this.instantiationService.createInstance(ActivityBarCompositeBar, {
			partContainerClass: 'activitybar',
			pinnedViewContainersKey: ActivitybarPart.pinnedViewContainersKey,
			placeholderViewContainersKey: ActivitybarPart.placeholderViewContainersKey,
			viewContainersWorkspaceStateKey: ActivitybarPart.viewContainersWorkspaceStateKey,
			orientation: ActionsOrientation.VERTICAL,
			icon: true,
			iconSize: 24,
		}, Parts.ACTIVITYBAR_PART, this.paneCompositePart, true)
	}

    //#region IView

	readonly minimumWidth: number = 48;
	readonly maximumWidth: number = 48;
	readonly minimumHeight: number = 0;
	readonly maximumHeight: number = Number.POSITIVE_INFINITY;

	override layout(width: number, height: number): void {
		super.layout(width, height, 0, 0);

		this.element.style.height = `${height}px`;

		if (!this.compositeBar.value) {
			return;
		}

		// Layout contents
		const contentAreaSize = super.layoutContents(width, height).contentSize;

		// Layout composite bar
		this.compositeBar.value.layout(width, contentAreaSize.height);
	}

    toJSON(): object {
		return {
			type: Parts.ACTIVITYBAR_PART
		};
	}

	//#endregion
}

export class ActivityBarCompositeBar extends PaneCompositeBar {

	constructor(
		options: IPaneCompositeBarOptions,
		part: Parts,
		paneCompositePart: IPaneCompositePart,
		showGlobalActivities: boolean,
	) {
		super(options, part, paneCompositePart);
	}
}
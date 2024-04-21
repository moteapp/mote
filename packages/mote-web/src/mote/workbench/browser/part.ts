import { Component } from 'mote/workbench/common/component';
import { Dimension, IDimension, IDomPosition } from 'vs/base/browser/dom';
import { IWorkbenchLayoutService } from 'mote/workbench/services/layout/browser/workbenchLayoutService';
import { ISerializableView } from 'vs/base/browser/ui/grid/grid';
import { Event, Emitter } from 'vs/base/common/event';
import { IViewSize } from 'vs/base/browser/ui/grid/gridview';
import { assertIsDefined } from 'vs/base/common/types';
import { getActiveDocument, size } from 'mote/base/browser/dom';
import { IDisposable, toDisposable } from 'vs/base/common/lifecycle';

export interface IPartOptions {
	readonly hasTitle?: boolean;
	readonly borderWidth?: () => number;
}

export interface ILayoutContentResult {
	readonly headerSize: IDimension;
	readonly titleSize: IDimension;
	readonly contentSize: IDimension;
	readonly footerSize: IDimension;
}

/**
 * Parts are layed out in the workbench and have their own layout that
 * arranges an optional title and mandatory content area to show content.
 */
export abstract class Part extends Component implements ISerializableView {

    private parent: HTMLElement | undefined;
	private headerArea: HTMLElement | undefined;
	private titleArea: HTMLElement | undefined;
	private contentArea: HTMLElement | undefined;
	private footerArea: HTMLElement | undefined;
	private partLayout: PartLayout | undefined;

    constructor(
		id: string,
		private options: IPartOptions,
        protected readonly layoutService: IWorkbenchLayoutService
    ) {
        super(id);

		this._register(layoutService.registerPart(this));
    }
    
    /**
	 * Note: Clients should not call this method, the workbench calls this
	 * method. Calling it otherwise may result in unexpected behavior.
	 *
	 * Called to create title and content area of the part.
	 */
	create(parent: HTMLElement, options?: object): void {
		this.element = parent;
        this.parent = parent;

		this.titleArea = this.createTitleArea(parent, options);
		this.contentArea = this.createContentArea(parent, options);

		this.partLayout = new PartLayout(this.options, this.contentArea);
    }

	/**
	 * Returns the overall part container.
	 */
	getContainer(): HTMLElement | undefined {
		return this.parent;
	}

	/**
	 * Subclasses override to provide a title area implementation.
	 */
	protected createTitleArea(parent: HTMLElement, options?: object): HTMLElement | undefined {
		return undefined;
	}

	/**
	 * Returns the title area container.
	 */
	protected getTitleArea(): HTMLElement | undefined {
		return this.titleArea;
	}

	/**
	 * Subclasses override to provide a content area implementation.
	 */
	protected createContentArea(parent: HTMLElement, options?: object): HTMLElement | undefined {
		return undefined;
	}

	/**
	 * Returns the content area container.
	 */
	protected getContentArea(): HTMLElement | undefined {
		return this.contentArea;
	}

	/**
	 * Layout title and content area in the given dimension.
	 */
	protected layoutContents(width: number, height: number): ILayoutContentResult {
		const partLayout = assertIsDefined(this.partLayout);

		return partLayout.layout(width, height);
	}


	//#region ISerializableView

	protected _onDidChange = this._register(new Emitter<IViewSize | undefined>());
	get onDidChange(): Event<IViewSize | undefined> { return this._onDidChange.event; }

	element!: HTMLElement;

	abstract minimumWidth: number;
	abstract maximumWidth: number;
	abstract minimumHeight: number;
	abstract maximumHeight: number;

	private _dimension: Dimension | undefined;
	get dimension(): Dimension | undefined { return this._dimension; }

	private _contentPosition: IDomPosition | undefined;
	get contentPosition(): IDomPosition | undefined { return this._contentPosition; }
	layout(width: number, height: number, top: number, left: number): void {
		this._dimension = new Dimension(width, height);
		this._contentPosition = { top, left };
	}

	protected _onDidVisibilityChange = this._register(new Emitter<boolean>());
	readonly onDidVisibilityChange = this._onDidVisibilityChange.event;
	setVisible(visible: boolean) {
		this._onDidVisibilityChange.fire(visible);
	}

	abstract toJSON(): object;

	//#endregion
}

class PartLayout {

	private static readonly HEADER_HEIGHT = 35;
	private static readonly TITLE_HEIGHT = 35;
	private static readonly Footer_HEIGHT = 35;

	private headerVisible: boolean = false;
	private footerVisible: boolean = false;

	constructor(private options: IPartOptions, private contentArea: HTMLElement | undefined) { }

	layout(width: number, height: number): ILayoutContentResult {

		// Title Size: Width (Fill), Height (Variable)
		let titleSize: Dimension;
		if (this.options.hasTitle) {
			titleSize = new Dimension(width, Math.min(height, PartLayout.TITLE_HEIGHT));
		} else {
			titleSize = Dimension.None;
		}

		// Header Size: Width (Fill), Height (Variable)
		let headerSize: Dimension;
		if (this.headerVisible) {
			headerSize = new Dimension(width, Math.min(height, PartLayout.HEADER_HEIGHT));
		} else {
			headerSize = Dimension.None;
		}

		// Footer Size: Width (Fill), Height (Variable)
		let footerSize: Dimension;
		if (this.footerVisible) {
			footerSize = new Dimension(width, Math.min(height, PartLayout.Footer_HEIGHT));
		} else {
			footerSize = Dimension.None;
		}

		let contentWidth = width;
		if (this.options && typeof this.options.borderWidth === 'function') {
			contentWidth -= this.options.borderWidth(); // adjust for border size
		}

		// Content Size: Width (Fill), Height (Variable)
		const contentSize = new Dimension(contentWidth, height - titleSize.height - headerSize.height - footerSize.height);

		// Content
		if (this.contentArea) {
			size(this.contentArea, contentSize.width, contentSize.height);
		}

		return { headerSize, titleSize, contentSize, footerSize };
	}

	setFooterVisibility(visible: boolean): void {
		this.footerVisible = visible;
	}

	setHeaderVisibility(visible: boolean): void {
		this.headerVisible = visible;
	}
}
export interface IMultiWindowPart {
	readonly element: HTMLElement;
}

export abstract class MultiWindowParts<T extends IMultiWindowPart> extends Component {

	protected readonly _parts = new Set<T>();
	get parts() { return Array.from(this._parts); }

	abstract readonly mainPart: T;

	registerPart(part: T): IDisposable {
		this._parts.add(part);

		return toDisposable(() => this.unregisterPart(part));
	}

	protected unregisterPart(part: T): void {
		this._parts.delete(part);
	}

	getPart(container: HTMLElement): T {
		return this.getPartByDocument(container.ownerDocument);
	}

	protected getPartByDocument(document: Document): T {
		if (this._parts.size > 1) {
			for (const part of this._parts) {
				if (part.element?.ownerDocument === document) {
					return part;
				}
			}
		}

		return this.mainPart;
	}

	get activePart(): T {
		return this.getPartByDocument(getActiveDocument());
	}
}
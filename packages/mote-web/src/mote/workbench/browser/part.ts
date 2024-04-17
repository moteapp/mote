import { Component } from 'mote/workbench/common/component';
import { Dimension, IDimension, IDomPosition } from 'vs/base/browser/dom';
import { IWorkbenchLayoutService } from 'mote/workbench/service/layout/workbenchLayoutService';
import { ISerializableView } from 'vs/base/browser/ui/grid/grid';
import { Event, Emitter } from 'vs/base/common/event';
import { IViewSize } from 'vs/base/browser/ui/grid/gridview';
import { assertIsDefined } from 'vs/base/common/types';

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

    constructor(
		id: string,
		private options: IPartOptions,
        protected readonly layoutService: IWorkbenchLayoutService
    ) {
        super(id);
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
    }

	/**
	 * Layout title and content area in the given dimension.
	 */
	protected layoutContents(width: number, height: number): ILayoutContentResult {
		//const partLayout = assertIsDefined(this.partLayout);

		//return partLayout.layout(width, height);
		return {} as any;
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
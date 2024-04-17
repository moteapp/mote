import { IView } from 'mote/workbench/common/views';
import { IPaneOptions, Pane } from 'vs/base/browser/ui/splitview/paneview';
import { Event, Emitter } from 'vs/base/common/event';

export interface IViewPaneOptions extends IPaneOptions {
	readonly id: string;
	//readonly showActions?: ViewPaneShowActions;
	//readonly titleMenuId?: MenuId;
	readonly donotForwardArgs?: boolean;
	// The title of the container pane when it is merged with the view container
	readonly singleViewPaneContainerTitle?: string;
}

export abstract class ViewPane extends Pane implements IView {
    
    private _onDidFocus = this._register(new Emitter<void>());
	readonly onDidFocus: Event<void> = this._onDidFocus.event;

	private _onDidBlur = this._register(new Emitter<void>());
	readonly onDidBlur: Event<void> = this._onDidBlur.event;

	private _onDidChangeBodyVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeBodyVisibility: Event<boolean> = this._onDidChangeBodyVisibility.event;

	protected _onDidChangeTitleArea = this._register(new Emitter<void>());
	readonly onDidChangeTitleArea: Event<void> = this._onDidChangeTitleArea.event;

	protected _onDidChangeViewWelcomeState = this._register(new Emitter<void>());
	readonly onDidChangeViewWelcomeState: Event<void> = this._onDidChangeViewWelcomeState.event;

    readonly id: string;

    private _title: string;
	public get title(): string {
		return this._title;
	}

    constructor(
		options: IViewPaneOptions,
    ) {
        super(options);

        this.id = options.id;
        this._title = options.title;
    }

    //#region IView

    private _isVisible: boolean = false;
    isVisible(): boolean {
		return this._isVisible;
	}

    isBodyVisible(): boolean {
		return this._isVisible && this.isExpanded();
	}

    focus(): void {

    }

    getProgressIndicator() {
        return undefined;
    }

    //#endregion
}
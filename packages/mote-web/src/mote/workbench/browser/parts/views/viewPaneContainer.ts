import { Component } from 'mote/workbench/common/component';
import { IView, IViewPaneContainer } from 'mote/workbench/common/views';
import { Emitter } from 'vs/base/common/event';
import { ViewPane } from './viewPane';
import { IDisposable } from 'vs/base/common/lifecycle';

interface IViewPaneItem {
	pane: ViewPane;
	disposable: IDisposable;
}

export class ViewPaneContainer extends Component implements IViewPaneContainer {

    private readonly _onDidChangeVisibility = this._register(new Emitter<boolean>());
	readonly onDidChangeVisibility = this._onDidChangeVisibility.event;
    
    private readonly _onDidAddViews = this._register(new Emitter<IView[]>());
	readonly onDidAddViews = this._onDidAddViews.event;

	private readonly _onDidRemoveViews = this._register(new Emitter<IView[]>());
	readonly onDidRemoveViews = this._onDidRemoveViews.event;

    private readonly _onDidChangeViewVisibility = this._register(new Emitter<IView>());
	readonly onDidChangeViewVisibility = this._onDidChangeViewVisibility.event;

    private paneItems: IViewPaneItem[] = [];

    get panes(): ViewPane[] {
		return this.paneItems.map(i => i.pane);
	}

    get views(): IView[] {
		return this.panes;
	}

    getView(id: string): ViewPane | undefined {
		return this.panes.filter(view => view.id === id)[0];
	}

    //#region IViewPaneContainer

    private visible: boolean = false;

    setVisible(visible: boolean): void {

    }

    isVisible(): boolean {
		return this.visible;
	}

    toggleViewVisibility(viewId: string): void {
        
    }

    focus(): void {

    }

    getActionsContext(): unknown {
		return undefined;
	}

    //#endregion
}
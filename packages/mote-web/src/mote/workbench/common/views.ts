import { Event } from 'vs/base/common/event';
import { IProgressIndicator } from 'vs/platform/progress/common/progress';

export interface IView {

	readonly id: string;

	focus(): void;

	isVisible(): boolean;

	isBodyVisible(): boolean;

	setExpanded(expanded: boolean): boolean;

	getProgressIndicator(): IProgressIndicator | undefined;
}

export interface IViewPaneContainer {
	onDidAddViews: Event<IView[]>;
	onDidRemoveViews: Event<IView[]>;
	onDidChangeViewVisibility: Event<IView>;

	readonly views: IView[];

	setVisible(visible: boolean): void;
	isVisible(): boolean;
	focus(): void;
	getActionsContext(): unknown;
	getView(viewId: string): IView | undefined;
	toggleViewVisibility(viewId: string): void;
}
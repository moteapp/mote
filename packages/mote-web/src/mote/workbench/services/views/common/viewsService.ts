import { IPaneComposite } from 'mote/workbench/common/panecomposite';
import { IView } from 'mote/workbench/common/views';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';

export const IViewsService = createDecorator<IViewsService>('viewsService');
export interface IViewsService {

	readonly _serviceBrand: undefined;

    // View APIs
    openView<T extends IView>(id: string, focus?: boolean): Promise<T | null>;
	closeView(id: string): void;

    // View Container APIs
    openViewContainer(id: string, focus?: boolean): Promise<IPaneComposite | null>;
	closeViewContainer(id: string): void;
}
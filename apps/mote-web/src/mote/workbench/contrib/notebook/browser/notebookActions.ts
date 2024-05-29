import { VIEW_ID } from 'mote/workbench/contrib/files/common/files';
import { IViewsService } from 'mote/workbench/services/views/common/viewsService';
import { timeout } from 'vs/base/common/async';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';

async function openExplorerAndCreate(accessor: ServicesAccessor, isFolder: boolean): Promise<void> {
    const viewsService = accessor.get(IViewsService);
    const wasHidden = !viewsService.isViewVisible(VIEW_ID);
    const view = await viewsService.openView(VIEW_ID, true);

    if (wasHidden) {
		// Give explorer some time to resolve itself #111218
		await timeout(500);
	}
}
import * as nls from 'vs/nls';
import { ViewPane } from 'mote/workbench/browser/parts/views/viewPane';
import { ILocalizedString } from 'vs/nls';
import { Root, createRoot } from 'react-dom/client';

export class PinnedFilesView extends ViewPane {

    static readonly ID = 'workbench.explorer.pinnedFilesView';
	static readonly NAME: ILocalizedString = nls.localize2({ key: 'openEditors', comment: ['Open is an adjective'] }, "Pinned");

    private root!: Root;

    protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

        this.root = createRoot(container);
    }
}
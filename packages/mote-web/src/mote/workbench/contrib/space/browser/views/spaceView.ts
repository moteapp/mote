import * as nls from 'vs/nls';
import { ViewPane } from 'mote/workbench/browser/parts/views/viewPane';
import { ILocalizedString } from 'vs/nls';
import { Root, createRoot } from 'react-dom/client';
import { Explorer } from 'mote/app/components/explorer/explorer';
import * as React from 'react';
import { Action2, MenuId, registerAction2 } from 'vs/platform/actions/common/actions';
import { Codicon } from 'vs/base/common/codicons';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { NEW_UNTITLED_PAGE_COMMAND_ID } from '../../common/spaceConstants';

export class SpaceView extends ViewPane {

    static readonly ID = 'workbench.explorer.spaceView';
	static readonly NAME: ILocalizedString = nls.localize2({ key: 'privateSpaceView', comment: ['Open is an adjective'] }, "Private");

    private root!: Root;

    protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

        this.root = createRoot(container);

        this.root.render(React.createElement(Explorer, {}));
    }
}

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'space.newUntitledFile',
			title: nls.localize2('newUntitledFile', "New Untitled File"),
			f1: false,
			icon: Codicon.add,
			menu: {
				id: MenuId.ViewTitle,
				group: 'navigation',
				when: ContextKeyExpr.equals('view', SpaceView.ID),
				order: 5
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
        const commandService = accessor.get(ICommandService);
		await commandService.executeCommand(NEW_UNTITLED_PAGE_COMMAND_ID);
	}
});
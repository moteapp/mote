import { IOpenEmptyWindowOptions } from 'mote/platform/window/common/window';
import { IHostService } from 'mote/workbench/services/host/browser/host';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';

export const newWindowCommand = (accessor: ServicesAccessor, options?: IOpenEmptyWindowOptions) => {
	const hostService = accessor.get(IHostService);
	hostService.openWindow(options);
};
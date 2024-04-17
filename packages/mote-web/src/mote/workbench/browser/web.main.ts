import { Disposable, DisposableStore, toDisposable } from 'vs/base/common/lifecycle';
import { IWorkbench } from './web.api';
import { domContentLoaded, getWindow } from 'vs/base/browser/dom';
import { Workbench } from './workbench';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { ConsoleLogger, ILogService, LogLevel } from 'mote/platform/log/common/log';
import { LogService } from 'mote/platform/log/common/logService';

export class BrowserMain extends Disposable {

    constructor(
		private readonly domElement: HTMLElement,
		private readonly configuration: any
	) {
		super();

		this.init();
	}

    private init(): void {

    }

    async open(): Promise<IWorkbench> {
        
        // Init services and wait for DOM to be ready in parallel
		const [services] = await Promise.all([this.initServices(), domContentLoaded(getWindow(this.domElement))]);

		// Create Workbench
		const workbench = new Workbench(this.domElement,  services.logService, undefined, services.serviceCollection);

        workbench.startup();
        return {
            shutdown: async () => {}
        };
    }

    private async initServices(): Promise<{ serviceCollection: ServiceCollection; logService: ILogService }> {
        const serviceCollection = new ServiceCollection();

        const logger = new ConsoleLogger(LogLevel.Debug);
        const logService = new LogService(logger);
		serviceCollection.set(ILogService, logService);

        return { serviceCollection, logService };
    }
}
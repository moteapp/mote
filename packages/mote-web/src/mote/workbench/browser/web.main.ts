import { Disposable, DisposableStore, toDisposable } from 'vs/base/common/lifecycle';
import { IWorkbench } from './web.api';
import { domContentLoaded, getWindow } from 'vs/base/browser/dom';
import { Workbench } from './workbench';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { ConsoleLogger, ILogService, LogLevel } from 'mote/platform/log/common/log';
import { LogService } from 'mote/platform/log/common/logService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { BrowserStorageService } from 'mote/workbench/services/storage/browser/storageService';
import { IAnyWorkspaceIdentifier } from 'mote/platform/workspace/common/workspace';
import { UserDataProfileService } from 'mote/workbench/services/userDataProfile/common/userDataProfileService';
import { IUserDataProfile } from 'mote/platform/userDataProfile/common/userDataProfile';
import { IUserDataProfileService } from 'mote/workbench/services/userDataProfile/common/userDataProfile';
import { IStorageService } from 'mote/platform/storage/common/storage';

export let instantiationService: IInstantiationService;

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

        // Startup
        instantiationService = workbench.startup();

        return {
            shutdown: async () => {}
        };
    }

    private async initServices(): Promise<{ serviceCollection: ServiceCollection; logService: ILogService }> {
        const serviceCollection = new ServiceCollection();

        const workspace = this.resolveWorkspace();

        const logger = new ConsoleLogger(LogLevel.Debug);
        const logService = new LogService(logger);
		serviceCollection.set(ILogService, logService);

        const currentProfile = await this.getCurrentProfile(workspace);
        const userDataProfileService = new UserDataProfileService(currentProfile);
        serviceCollection.set(IUserDataProfileService, userDataProfileService);

        const storageService = new BrowserStorageService(workspace, userDataProfileService, logService);
        serviceCollection.set(IStorageService, storageService);

        return { serviceCollection, logService };
    }

    private resolveWorkspace(): IAnyWorkspaceIdentifier {
        return { id: 'workspace' };
    }

    private async getCurrentProfile(workspace: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
        return {id: 'mote', isDefault: true};
    }
}
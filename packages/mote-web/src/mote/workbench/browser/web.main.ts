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
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { NullTelemetryServiceShape } from 'vs/platform/telemetry/common/telemetryUtils';
import { NullCongirgutionService } from 'mote/workbench/services/configuration/common/configurationService';
import { NullThemeService } from '../services/theme/browser/themeService';
import { UriIdentityService } from 'vs/platform/uriIdentity/common/uriIdentityService';
import { IUriIdentityService } from 'vs/platform/uriIdentity/common/uriIdentity';
import { FileService } from 'vs/platform/files/common/fileService';
import { IFileService } from 'vs/platform/files/common/files';
import { BufferLogger } from 'mote/platform/log/common/bufferLog';
import { BrowserWorkbenchEnvironmentService, IBrowserWorkbenchEnvironmentService } from 'mote/workbench/services/environment/browser/environmentService';
import { URI } from 'vs/base/common/uri';
import { toLocalISOString } from 'vs/base/common/date';
import { IProductService } from 'vs/platform/product/common/productService';
import { mixin } from 'vs/base/common/objects';
import product from 'vs/platform/product/common/product';

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

        // Product
		const productService: IProductService = mixin({ _serviceBrand: undefined, ...product }, this.configuration.productConfiguration);
		serviceCollection.set(IProductService, productService);

        // Files
		const fileLogger = new BufferLogger();
		const fileService = this._register(new FileService(fileLogger));
		serviceCollection.set(IFileService, fileService);

        const logger = new ConsoleLogger(LogLevel.Debug);
        const logService = new LogService(logger);
		serviceCollection.set(ILogService, logService);

        // URI Identity
		const uriIdentityService = new UriIdentityService(fileService);
		serviceCollection.set(IUriIdentityService, uriIdentityService);

        const currentProfile = await this.getCurrentProfile(workspace);
        const userDataProfileService = new UserDataProfileService(currentProfile);
        serviceCollection.set(IUserDataProfileService, userDataProfileService);

        const storageService = new BrowserStorageService(workspace, userDataProfileService, logService);
        serviceCollection.set(IStorageService, storageService);

        const logsPath = URI.file(toLocalISOString(new Date()).replace(/-|:|\.\d+Z$/g, '')).with({ scheme: 'mote-log' });
        const environmentService = new BrowserWorkbenchEnvironmentService(workspace.id, logsPath, this.configuration, productService);
        serviceCollection.set(IBrowserWorkbenchEnvironmentService, environmentService);

        serviceCollection.set(IThemeService, new NullThemeService());
        serviceCollection.set(IConfigurationService, new NullCongirgutionService());
        serviceCollection.set(IKeybindingService, {} as any);
        serviceCollection.set(ITelemetryService, new NullTelemetryServiceShape())

        return { serviceCollection, logService };
    }

    private resolveWorkspace(): IAnyWorkspaceIdentifier {
        return { id: 'workspace' };
    }

    private async getCurrentProfile(workspace: IAnyWorkspaceIdentifier): Promise<IUserDataProfile> {
        return {id: 'mote', isDefault: true};
    }
}
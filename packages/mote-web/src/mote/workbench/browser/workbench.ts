import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { Layout } from './layout';
import { mark } from 'mote/base/common/performance';
import { ILogService } from 'mote/platform/log/common/log';
import { mainWindow } from 'mote/base/browser/window';
import { onUnexpectedError, setUnexpectedErrorHandler } from 'vs/base/common/errors';
import { InstantiationService } from 'vs/platform/instantiation/common/instantiationService';
import { IWorkbenchLayoutService, Parts, Position } from 'mote/workbench/service/layout/workbenchLayoutService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { isChrome, isFirefox, isLinux, isSafari, isWeb, isWindows } from 'vs/base/common/platform';
import { coalesce } from 'vs/base/common/arrays';
import { toErrorMessage } from 'vs/base/common/errorMessage';
import { getSingletonServiceDescriptors } from 'vs/platform/instantiation/common/extensions';

export class Workbench extends Layout {

    constructor(
		parent: HTMLElement,
        logService: ILogService,
        private readonly options: any | undefined,
        private readonly serviceCollection: ServiceCollection,
    ) {
        super(parent);

        // Perf: measure workbench startup time
		mark('mote/willStartWorkbench');

        this.registerErrorHandler(logService);
    }

    //#region Error Handler

    private registerErrorHandler(logService: ILogService): void {
        
        // Listen on unhandled rejection events
		// Note: intentionally not registered as disposable to handle
		//       errors that can occur during shutdown phase.
		mainWindow.addEventListener('unhandledrejection', (event) => {

			// See https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
			onUnexpectedError(event.reason);

			// Prevent the printing of this event to the console
			event.preventDefault();
		});

        // Install handler for unexpected errors
		setUnexpectedErrorHandler(error => this.handleUnexpectedError(error, logService));
    }

    private previousUnexpectedError: { message: string | undefined; time: number } = { message: undefined, time: 0 };
	private handleUnexpectedError(error: unknown, logService: ILogService): void {
		const message = toErrorMessage(error, true);
		if (!message) {
			return;
		}

		const now = Date.now();
		if (message === this.previousUnexpectedError.message && now - this.previousUnexpectedError.time <= 1000) {
			return; // Return if error message identical to previous and shorter than 1 second
		}

		this.previousUnexpectedError.time = now;
		this.previousUnexpectedError.message = message;

		// Log it
		logService.error(message);
	}

    //#endregion

    startup(): IInstantiationService {
		try {

            // Services
			const instantiationService = this.initServices(this.serviceCollection);

            instantiationService.invokeFunction(accessor => {

                // Layout
				this.initLayout(accessor);

                // Render Workbench
				this.renderWorkbench(instantiationService);

                // Workbench Layout
				this.createWorkbenchLayout();

                // Layout
				this.layout();
            });

            return instantiationService;
        } catch (error) {
            onUnexpectedError(error);

            throw error; // rethrow because this is a critical issue we cannot handle properly here
        }
    }

    private initServices(serviceCollection: ServiceCollection): IInstantiationService {
        // Layout Service
		serviceCollection.set(IWorkbenchLayoutService, this);

		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.desktop.main.ts` if the service
		//       is desktop only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


		// All Contributed Services
		const contributedServices = getSingletonServiceDescriptors();
		for (const [id, descriptor] of contributedServices) {
			serviceCollection.set(id, descriptor);
		}


        const instantiationService = new InstantiationService(serviceCollection, true);
        return instantiationService;
    }

    private renderWorkbench(instantiationService: IInstantiationService): void {

        // State specific classes
		const platformClass = isWindows ? 'windows' : isLinux ? 'linux' : 'mac';
		const workbenchClasses = coalesce([
			'monaco-workbench',
			platformClass,
			isWeb ? 'web' : undefined,
			isChrome ? 'chromium' : isFirefox ? 'firefox' : isSafari ? 'safari' : undefined,
			...this.getLayoutClasses(),
			...(this.options?.extraClasses ? this.options.extraClasses : [])
		]);

		this.mainContainer.classList.add(...workbenchClasses);
		mainWindow.document.body.classList.add(platformClass); // used by our fonts

		if (isWeb) {
			mainWindow.document.body.classList.add('web');
		}

        // Create Parts
		for (const { id, role, classes, options } of [
            { id: Parts.TITLEBAR_PART, role: 'none', classes: ['titlebar'] },
            { id: Parts.ACTIVITYBAR_PART, role: 'none', classes: ['activitybar', this.getSideBarPosition() === Position.LEFT ? 'left' : 'right'] },
            { id: Parts.SIDEBAR_PART, role: 'none', classes: ['sidebar', this.getSideBarPosition() === Position.LEFT ? 'left' : 'right'], options: { }} ,
            { id: Parts.EDITOR_PART, role: 'main', classes: ['editor'], options: { } },
        ]) {
            const partContainer = this.createPart(id, role, classes);

            mark(`mote/willCreatePart/${id}`);
			this.getPart(id).create(partContainer, options);
			mark(`mote/didCreatePart/${id}`);
        }

        // Add Workbench to DOM
		this.parent.appendChild(this.mainContainer);
    }

    private createPart(id: string, role: string, classes: string[]): HTMLElement {
		const part = document.createElement(role === 'status' ? 'footer' /* Use footer element for status bar #98376 */ : 'div');
		part.classList.add('part', ...classes);
		part.id = id;
		part.setAttribute('role', role);
		if (role === 'status') {
			part.setAttribute('aria-live', 'off');
		}

		return part;
	}
}
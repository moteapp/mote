import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { Layout } from './layout';
import { mark } from 'mote/base/common/performance';
import { ILogService } from 'mote/platform/log/common/log';
import { mainWindow } from 'mote/base/browser/window';
import { onUnexpectedError, setUnexpectedErrorHandler } from 'vs/base/common/errors';
import { InstantiationService } from 'vs/platform/instantiation/common/instantiationService';
import { IWorkbenchLayoutService, Parts, Position } from 'mote/workbench/services/layout/browser/workbenchLayoutService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { isChrome, isFirefox, isLinux, isSafari, isWeb, isWindows } from 'vs/base/common/platform';
import { coalesce } from 'vs/base/common/arrays';
import { toErrorMessage } from 'vs/base/common/errorMessage';
import { getSingletonServiceDescriptors } from 'vs/platform/instantiation/common/extensions';
import { Registry } from 'vs/platform/registry/common/platform';
import { IWorkbenchContributionsRegistry, WorkbenchExtensions } from 'mote/workbench/common/contribution';
import { ILifecycleService, LifecyclePhase } from 'mote/workbench/services/lifecycle/common/lifecycle';
import { DeferredPromise, RunOnceScheduler, timeout } from 'vs/base/common/async';
import { runWhenWindowIdle } from 'mote/base/browser/dom';
import { setHoverDelegateFactory } from 'vs/base/browser/ui/hover/hoverDelegateFactory';
import { setBaseLayerHoverDelegate } from 'vs/base/browser/ui/hover/hoverDelegate2';
import { IHoverService, WorkbenchHoverDelegate } from 'vs/platform/hover/browser/hover';

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
				const lifecycleService = accessor.get(ILifecycleService);
				const hoverService = accessor.get(IHoverService);

				// Default Hover Delegate must be registered before creating any workbench/layout components
				// as these possibly will use the default hover delegate
				setHoverDelegateFactory((placement, enableInstantHover) => instantiationService.createInstance(WorkbenchHoverDelegate, placement, enableInstantHover, {}));
				setBaseLayerHoverDelegate(hoverService);

                // Layout
				this.initLayout(accessor);

				// Registries
				Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).start(accessor);

                // Render Workbench
				this.renderWorkbench(instantiationService);

                // Workbench Layout
				this.createWorkbenchLayout();

                // Layout
				this.layout();

				// Restore
				this.restore(lifecycleService);
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

	private restore(lifecycleService: ILifecycleService): void {
		// Ask each part to restore
		try {
			this.restoreParts();
		} catch (error) {
			onUnexpectedError(error);
		}

		// Transition into restored phase after layout has restored
		// but do not wait indefinitely on this to account for slow
		// editors restoring. Since the workbench is fully functional
		// even when the visible editors have not resolved, we still
		// want contributions on the `Restored` phase to work before
		// slow editors have resolved. But we also do not want fast
		// editors to resolve slow when too many contributions get
		// instantiated, so we find a middle ground solution via
		// `Promise.race`
		this.whenReady.finally(() =>
			Promise.race([
				this.whenRestored,
				timeout(2000)
			]).finally(() => {

				// Update perf marks only when the layout is fully
				// restored. We want the time it takes to restore
				// editors to be included in these numbers

				function markDidStartWorkbench() {
					mark('mote/didStartWorkbench');
					performance.measure('perf: workbench create & restore', 'mote/didLoadWorkbenchMain', 'mote/didStartWorkbench');
				}

				if (this.isRestored()) {
					markDidStartWorkbench();
				} else {
					this.whenRestored.finally(() => markDidStartWorkbench());
				}

				// Set lifecycle phase to `Restored`
				lifecycleService.phase = LifecyclePhase.Restored;

				// Set lifecycle phase to `Eventually` after a short delay and when idle (min 2.5sec, max 5sec)
				const eventuallyPhaseScheduler = this._register(new RunOnceScheduler(() => {
					this._register(runWhenWindowIdle(mainWindow, () => lifecycleService.phase = LifecyclePhase.Eventually, 2500));
				}, 2500));
				eventuallyPhaseScheduler.schedule();
			})
		);
	}
}
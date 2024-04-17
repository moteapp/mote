import { getSingletonServiceDescriptors } from 'vs/platform/instantiation/common/extensions';
import { InstantiationService } from 'vs/platform/instantiation/common/instantiationService';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { IWorkbenchLayoutService } from 'mote/workbench/service/layout/workbenchLayoutService';
import { Layout } from './layout';
import { IWorkbench, IWorkbenchConstructionOptions } from './web.api';
import { IDisposable, toDisposable } from 'vs/base/common/lifecycle';
import { DeferredPromise } from 'vs/base/common/async';
import { mark } from 'mote/base/common/performance';
import { BrowserMain } from './web.main';

let created = false;
const workbenchPromise = new DeferredPromise<IWorkbench>();

const serviceCollection = new ServiceCollection();

// All Contributed Services
const contributedServices = getSingletonServiceDescriptors();
for (const [id, descriptor] of contributedServices) {
	serviceCollection.set(id, descriptor);
}

serviceCollection.set(IWorkbenchLayoutService, new Layout(window.document.body))

export const instantiationService = new InstantiationService(serviceCollection, true);

/**
 * Creates the workbench with the provided options in the provided container.
 *
 * @param domElement the container to create the workbench in
 * @param options for setting up the workbench
 */
export function create(domElement: HTMLElement, options: IWorkbenchConstructionOptions): IDisposable {
    // Mark start of workbench
	mark('mote/didLoadWorkbenchMain');

	// Assert that the workbench is not created more than once. We currently
	// do not support this and require a full context switch to clean-up.
	if (created) {
		throw new Error('Unable to create the VSCode workbench more than once.');
	} else {
		created = true;
	}

    // Startup workbench and resolve waiters
	let instantiatedWorkbench: IWorkbench | undefined = undefined;
	new BrowserMain(domElement, options).open().then(workbench => {
		instantiatedWorkbench = workbench;
		workbenchPromise.complete(workbench);
	});

    return toDisposable(() => {
		if (instantiatedWorkbench) {
			instantiatedWorkbench.shutdown();
		} else {
			workbenchPromise.p.then(instantiatedWorkbench => instantiatedWorkbench.shutdown());
		}
	});
}

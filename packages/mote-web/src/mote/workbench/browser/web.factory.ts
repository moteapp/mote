import { IWorkbench, IWorkbenchConstructionOptions } from './web.api';
import { IDisposable, toDisposable } from 'vs/base/common/lifecycle';
import { DeferredPromise } from 'vs/base/common/async';
import { mark } from 'mote/base/common/performance';
import { BrowserMain } from './web.main';

let created = false;
const workbenchPromise = new DeferredPromise<IWorkbench>();

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

import { getSingletonServiceDescriptors } from 'vs/platform/instantiation/common/extensions';
import { InstantiationService } from 'vs/platform/instantiation/common/instantiationService';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { IWorkbenchLayoutService } from 'mote/workbench/service/layout/workbenchLayoutService';
import { Layout } from './layout';

const serviceCollection = new ServiceCollection();

// All Contributed Services
const contributedServices = getSingletonServiceDescriptors();
for (const [id, descriptor] of contributedServices) {
	serviceCollection.set(id, descriptor);
}

serviceCollection.set(IWorkbenchLayoutService, new Layout(window.document.body))

export const instantiationService = new InstantiationService(serviceCollection, true);

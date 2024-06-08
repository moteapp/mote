import { ServiceCollection } from '@mote/platform/instantiation/common/serviceCollection';
import { InstantiationService } from '@mote/platform/instantiation/common/instantiationService';
import { getSingletonServiceDescriptors } from '@mote/platform/instantiation/common/extensions';

import './storage/storageService.js';
import './user/userService.js';
import './space/spaceService.js';

const serviceCollection = new ServiceCollection();

// All Contributed Services
const contributedServices = getSingletonServiceDescriptors();
for (const [id, descriptor] of contributedServices) {
	serviceCollection.set(id, descriptor);
}

export const instantiationService = new InstantiationService(serviceCollection, true);

// #######################################################################
// ###                                                                 ###
// ### !!! PLEASE ADD COMMON IMPORTS INTO WORKBENCH.COMMON.MAIN.TS !!! ###
// ###                                                                 ###
// ###                                                                 ###
// #######################################################################


//#region --- workbench common

import './workbench.common.main';

//#endregion


//#region --- workbench services
import 'mote/platform/record/browser/transactionService';

//#endregion

// eslint-disable-next-line import/order
import { getSingletonServiceDescriptors } from 'mote/platform/instantiation/common/extensions';
import { InstantiationService } from 'mote/platform/instantiation/common/instantiationService';
import { ServiceCollection } from 'mote/platform/instantiation/common/serviceCollection';

const serviceCollection = new ServiceCollection();
// All Contributed Services
const contributedServices = getSingletonServiceDescriptors();
for (const [id, descriptor] of contributedServices) {
    serviceCollection.set(id, descriptor);
}
export const instantiationService = new InstantiationService(serviceCollection);
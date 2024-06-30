import { createDecorator } from "@mote/platform/instantiation/common/instantiation";
import { IModelService } from "../modelService";
import { ICollectionModel } from "@mote/client/model/model";

export const ICollectionService = createDecorator<ICollectionService>('collectionService');

export interface ICollectionService extends IModelService<ICollectionModel>{
    readonly _serviceBrand: undefined;
}
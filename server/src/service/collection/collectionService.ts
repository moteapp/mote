import { ICollectionModel } from "@mote/client/model/model";
import { ICollectionService } from "./collection.js";
import { InstantiationType, registerSingleton } from "@mote/platform/instantiation/common/extensions";
import { IStorageService } from "../storage/storage.js";

const collectionMapper = {
    'space_id': 'spaceId',
    'create_by': 'createAt',
}

class CollectionService implements ICollectionService {
    _serviceBrand: undefined;

    constructor(
        @IStorageService private storageService: IStorageService
    ) {

    }

    count(query: Record<string, any>): Promise<number> {
        throw new Error("Method not implemented.");
    }
    find(query: Record<string, any>): Promise<ICollectionModel[]> {
        return this.storageService.find<ICollectionModel>(query, 'collection', { mapper: collectionMapper });
    }

    async create(item: Partial<ICollectionModel> & Omit<ICollectionModel, "id">): Promise<number> {
        const { spaceId, createBy, ...rest } = item;
        return await this.storageService.create({
            ...rest,
            space_id: spaceId,
            create_by: createBy,
            namespace: 'collection'
        });
    }
    update(item: Partial<ICollectionModel>): Promise<ICollectionModel> {
        throw new Error("Method not implemented.");
    }
    retrieve(id: number): Promise<ICollectionModel | null> {
        throw new Error("Method not implemented.");
    }

}

registerSingleton(ICollectionService, CollectionService, InstantiationType.Delayed);
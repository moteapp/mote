import { InstantiationType, registerSingleton } from "@mote/platform/instantiation/common/extensions";
import { IStorageService } from "../storage/storage.js";
import { ISpaceService } from "./space.js";
import { ISpaceMemberModel, ISpaceModel, ITeamModel } from "@mote/client/model/model";
import { IEntityWithNamespace } from "@mote/client/model/entity";
import { Promises } from "@mote/base/common/async";


const spaceMapper = {
    'owner_id': 'ownerId',
    'created_at': 'createdAt',
}

const spaceMemberMapper = {
    'space_id': 'spaceId',
    'user_id': 'userId',
}

class SpaceService implements ISpaceService {
    _serviceBrand: undefined;

    constructor(
        @IStorageService private storageService: IStorageService
    ) {

    }

    count(query: Record<string, any>): Promise<number> {
        return this.storageService.count(query, 'space');
    }
   
    find(query: Record<string, any>): Promise<ISpaceModel[]> {
        return this.storageService.find<ISpaceModel>(query, 'space', { mapper: spaceMapper });
    }

    async create(item: Partial<ISpaceModel> & Omit<ISpaceModel, "id">): Promise<number> {
        return await this.storageService.create({
            ...item,
            namespace: 'space'
        });
    }

    update(item: Partial<ISpaceModel>): Promise<ISpaceModel> {
        throw new Error("Method not implemented.");
    }

    async retrieve(id: number): Promise<ISpaceModel> {
        const result = await this.storageService.retrieve<ISpaceModel>(id, 'space', { mapper: spaceMapper });
        return result!;
    }

    async addMember(spaceId: number, userId: number): Promise<void> {
        await this.storageService.create<any & IEntityWithNamespace>({
            space_id: spaceId,
            user_id: userId,
            namespace: 'space_member'
        });
    }

    async findAllByUser(userId: number): Promise<ISpaceModel[]> {
        const members = await this.storageService.find<ISpaceMemberModel>({ user_id: userId }, 'space_member', { mapper: spaceMemberMapper });
        const spaceIds = members.map(member => member.spaceId);

        return Promises.settled(spaceIds.map(spaceId => this.retrieve(spaceId)));
    
    }
}

registerSingleton(ISpaceService, SpaceService, InstantiationType.Delayed);
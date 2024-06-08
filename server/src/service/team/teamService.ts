import { InstantiationType, registerSingleton } from "@mote/platform/instantiation/common/extensions";
import { IStorageService } from "../storage/storage.js";
import { ITeamService } from "./team.js";
import { ITeamModel } from "@mote/client/model/model";


const userMapper = {
    'owner_id': 'ownerId',
    'created_at': 'createdAt',
}

class TeamService implements ITeamService {
    _serviceBrand: undefined;

    constructor(
        @IStorageService private storageService: IStorageService
    ) {

    }

    count(query: Record<string, any>): Promise<number> {
        return this.storageService.count(query, 'team');
    }
   
    find(query: Record<string, any>): Promise<ITeamModel[]> {
        return this.storageService.find<ITeamModel>(query, 'team', { mapper: userMapper });
    }
    async create(item: Partial<ITeamModel> & Omit<ITeamModel, "id">): Promise<void> {
        await this.storageService.create({
            ...item,
            namespace: 'team'
        });
    }
    update(item: Partial<ITeamModel>): Promise<ITeamModel> {
        throw new Error("Method not implemented.");
    }
    retrieve(id: number): Promise<ITeamModel | null> {
        throw new Error("Method not implemented.");
    }
}

registerSingleton(ITeamService, TeamService, InstantiationType.Delayed);
import { createDecorator } from "@mote/platform/instantiation/common/instantiation";
import { IModelService } from "../modelService.js";
import { ISpaceModel, ITeamModel } from "@mote/client/model/model";


export const ISpaceService = createDecorator<ISpaceService>('spaceService');

export interface ISpaceService extends IModelService<ISpaceModel>{
    readonly _serviceBrand: undefined;

    findAllByUser(userId: number): Promise<ISpaceModel[]>

    addMember(spaceId: number, userId: number): Promise<void>;
}
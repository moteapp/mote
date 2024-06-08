import { createDecorator } from "@mote/platform/instantiation/common/instantiation";
import { IModelService } from "../modelService.js";
import { ITeamModel } from "@mote/client/model/model";


export const ITeamService = createDecorator<ITeamService>('teamService');

export interface ITeamService extends IModelService<ITeamModel>{
    readonly _serviceBrand: undefined;
}
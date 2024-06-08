import { createDecorator } from "@mote/platform/instantiation/common/instantiation";
import { IModelService } from "../modelService";
import { IUserModel } from "@mote/client/model/model";


export const IUserService = createDecorator<IUserService>('userService');

export interface IUserService extends IModelService<IUserModel>{
    readonly _serviceBrand: undefined;

    findOne(query: Record<string, any>): Promise<IUserModel | null>;

    getEmailSigninToken(user: IUserModel): string;
}
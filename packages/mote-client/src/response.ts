import { ISpaceModel, IUserModel } from "@mote/client/model/model";

export interface IAuthInfo {
    user: IUserModel;
    spaces: ISpaceModel[];
}

export class MoteResponse<T extends any> {

    constructor(
        public readonly data: T, 
        public status: number, 
        public statusText: string) {
       
    }
}
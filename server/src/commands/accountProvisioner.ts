import { ITeamModel, IUserModel } from "@mote/client/model/model";

export type AccountProvisionerResult = {
    user: IUserModel;
    team: ITeamModel;
    isNewTeam: boolean;
    isNewUser: boolean;
};
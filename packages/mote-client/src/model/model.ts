import { IEntity } from "./entity";

export interface IUserModel extends IEntity {
    /**
     * User name must be 255 characters or less
     */
    username: string;
    email: string;
    jwtSecret: string;
}

export interface ITeamModel extends IEntity {
    name: string;
    subdomain: string;
    domain: string;
}
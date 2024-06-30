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

export interface ISpaceModel extends IEntity {
    name: string;
    domain: string;
    subdomain: string;
}

export interface ISpaceMemberModel extends IEntity {
    userId: number;
    spaceId: number;
}

export interface ICollectionModel extends IEntity {
    name: string;
    description: string;
    spaceId: number;
    createBy: number;
}
import { Prisma } from '@prisma/client';

//#region User related types

export enum UserRole {
    Admin = 'admin',
    Member = 'member',
    Viewer = 'viewer',
    Guest = 'guest',
}

const user = Prisma.validator<Prisma.UserDefaultArgs>()({});

export type IUser = Prisma.UserGetPayload<typeof user>;

const authenticationProvider =
    Prisma.validator<Prisma.AuthenticationProviderWhereUniqueInput>()({});

export type IAuthenticationProvider = Prisma.AuthenticationProviderGetPayload<
    typeof authenticationProvider
>;

//#endregion

const space = Prisma.validator<Prisma.SpaceDefaultArgs>()({});

export type ISpace = Prisma.SpaceGetPayload<typeof space>;

const block = Prisma.validator<Prisma.BlockDefaultArgs>()({});
const blockWithRelations = Prisma.validator<Prisma.BlockDefaultArgs>()({});

export type IBaseBlock = Prisma.BlockGetPayload<typeof blockWithRelations>;

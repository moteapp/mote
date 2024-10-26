import { Prisma } from '@prisma/client';

const user = Prisma.validator<Prisma.UserDefaultArgs>()({});

export type IUser = Prisma.UserGetPayload<typeof user>;

const authenticationProvider =
    Prisma.validator<Prisma.AuthenticationProviderWhereUniqueInput>()({});

export type IAuthenticationProvider = Prisma.AuthenticationProviderGetPayload<
    typeof authenticationProvider
>;

const space = Prisma.validator<Prisma.SpaceDefaultArgs>()({});

export type ISpace = Prisma.SpaceGetPayload<typeof space>;

const block = Prisma.validator<Prisma.BlockDefaultArgs>()({});
const blockWithRelations = Prisma.validator<Prisma.BlockDefaultArgs>()({});

export type IBaseBlock = Prisma.BlockGetPayload<typeof blockWithRelations>;

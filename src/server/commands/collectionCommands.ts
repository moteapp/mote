import { Prisma } from "@prisma/client";
import { prisma } from "mote/base/parts/storage/common/prisma";
import { CollectionPermission } from "mote/base/parts/storage/common/schema";

export type CollectionCreatorOptions = {
    name: string;
    description?: string;
    sharing: boolean;
    userId: string;
    spaceId: string;
    permission: CollectionPermission | null;
};

export async function collectionCreator({
    name,
    description,
    sharing,
    userId,
    spaceId,
    permission,
}: CollectionCreatorOptions) {
    const collection = await prisma.collection.create({
        data: {
            name,
            sharing,
            permission,
            createdBy: {
                connect: {
                    id: userId,
                },
            },
            space: {
                connect: {
                    id: spaceId,
                },
            }
        }
    });
    return collection;
}

export type CollectionListerOptions = {
    userId?: string;
    spaceId: string;
};

export async function collectionLister({
    userId,
    spaceId,
}: CollectionListerOptions) {
    const where : Prisma.CollectionWhereInput = {};
    if (userId) {
        where.createdById = userId;
    }
    where.spaceId = spaceId;
    const collections = await prisma.collection.findMany({where});
    return collections;
}
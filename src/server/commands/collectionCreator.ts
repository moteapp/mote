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
import { Prisma } from "@prisma/client";
import { match } from "ts-pattern";
import { prisma } from "mote/base/parts/storage/common/prisma";
import { IBaseBlock } from "mote/base/parts/storage/common/schema";

export type DocumentOrderBy = keyof IBaseBlock;

export async function documentLister({
    collectionId,
    orderBySorter,
}: {
    collectionId: string;
    orderBySorter?: DocumentOrderBy;
}) {
    const where : Prisma.BlockWhereInput = {
        type: 'page'
    };
    where.collectionId = collectionId;

    const orderBy : Prisma.BlockOrderByWithRelationInput = {};

    match(orderBySorter)
    .with('createdAt', () => orderBy.createdAt = 'desc')
    .with('updatedAt', () => orderBy.updatedAt = 'desc')
    .with(undefined, () => orderBy.createdAt = 'desc')
    .run();

    const documents = await prisma.block.findMany({where});
    return documents;
}
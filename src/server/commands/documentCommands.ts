import { Prisma } from "@prisma/client";
import { match } from "ts-pattern";
import { prisma } from "mote/base/parts/storage/common/prisma";
import { IBaseBlock } from "mote/base/parts/storage/common/schema";
import { ILayoutBlock, IPageBlock, ITextBlock } from "mote/editor/common/blockCommon";
import { IDocumentMetadata } from "mote/platform/request/common/document";

export type DocumentOrderBy = keyof IBaseBlock;


export type IDocumentListerOptions = {
    collectionId: string;
    orderBySorter?: DocumentOrderBy;
    skip?: number;
    limit?: number;
};

export async function documentLister({
    collectionId,
    orderBySorter,
    skip,
    limit,
}: IDocumentListerOptions) : Promise<IPageBlock[]> {
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

    const documents = await prisma.block.findMany({where, orderBy, skip, take: limit || 10});
    return documents as any as IPageBlock[];
}

export type IDocumentInformerOptions = {
    documentId: string;
}

/**
 * Return the metadata of a document, includes:
 * - createdAt
 * - updatedAt
 * - title
 * - wordCount
 * @param options 
 * @returns 
 */
export async function documentInformer({
    documentId,
}: IDocumentInformerOptions) : Promise<IDocumentMetadata> {
    const layoutBlocks: ILayoutBlock[] = await prisma.block.findMany({
        where: {
            rootId: documentId,
            parentId: documentId,
            type: 'layout',
        }
    }) as any as ILayoutBlock[];

    const metadata: IDocumentMetadata = {
        id: documentId,
        createdAt: layoutBlocks[0].createdAt,
        updatedAt: layoutBlocks[0].updatedAt,
    };

    const titleBlock = await prisma.block.findFirst({
        where: {
            rootId: documentId,
            parentId: layoutBlocks[0].id,
            type: 'text',
        }
    }) as any as ITextBlock;

    if (titleBlock) {
        metadata.title = titleBlock.content?.value.map((segment) => segment[0]).join('');
    }

    return metadata;
}
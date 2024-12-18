import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { prisma } from 'mote/base/parts/storage/common/prisma';
import { BlockRole, IBlock, IBlockAndRole, IPageBlock } from 'mote/editor/common/blockCommon';
import { Pointer } from 'mote/platform/record/common/record';
import { collectionLister } from 'mote/server/commands/collectionCommands';
import { documentLister, DocumentOrderBy } from 'mote/server/commands/documentCommands';
import { verifyJWT } from 'mote/server/common/jwt';

// This is a Data Access Layer (DAL).
// It used to centralize your data requests and authorization logic.

/**
 * Verify the token from the Authorization header.
 */
export const verifyToken = cache(async () => {

    let token: string | undefined;

    token = (await cookies()).get('credential')?.value;

    if (!token) {
        const authorization = (await headers()).get('Authorization');
        if (!authorization) {
            redirect('/');
        }

        const parts = authorization.split(' ');
        if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            } else {
                redirect('/');
            }
        } else {
            redirect('/');
        }
    }

    try {
        const { id } = verifyJWT(token);
        return { isAuth: true, userId: id };
    } catch (error)
    {
        redirect('/');
    }
});

/**
 * Fetch the user from the database.
 */
export const getUser = cache(async () => {
    console.log('[DAL] Fetching user from database');
    const { userId } = await verifyToken();

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        return user;
    } catch (error) {
        console.log('Failed to fetch user')
        return null;
    }
});

export const getUserSpaces = cache(async () => {
    console.log('[DAL] Fetching spaces from database');
    const { userId } = await verifyToken();
    
    try {
        const spaces = await prisma.userSpace.findMany({
            where: { userId },
        });
        return spaces;
    } catch (error) {
        console.log('Failed to fetch spaces')
        return null;
    }
});

export const getCollections = cache(async (spaceId?: string) => {
    console.log('[DAL] Fetching collections from database');

    if (!spaceId) {
        const spaces = await getUserSpaces();
        console.log('[DAL] spaces for collections', spaces);
        if (!spaces) {
            return null;
        }
        spaceId = spaces[0].spaceId;
    }

    const collections = await collectionLister({ spaceId });
    console.log('[DAL] collections', collections);
    return collections;
});

export const getCollection = cache(async (collectionId: string) => {
    console.log('[DAL] Fetching collection from database');
    const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
    });
    return collection;
});

export const getDocuments = cache(async (
    collectionId: string,
    orderBy?: DocumentOrderBy
) => {
    console.log('[DAL] Fetching documents from database');
    const documents = await documentLister({ collectionId, orderBySorter: orderBy });
    console.log('[DAL] documents', documents);
    return documents;
});

export const getDocument = cache(async (documentId: string) => {
    console.log('[DAL] Fetching document from database');
    const document = await prisma.block.findUnique({
        where: { id: documentId },
    }) as IPageBlock;
    return document;
});


export const syncRecord = cache(async (pointer: Pointer): Promise<IBlockAndRole|null> => {
    console.log('[DAL] Syncing record from database');
    const { id, table } = pointer;
    const { userId } = await verifyToken();
    const record = await prisma.block.findUnique({
        where: { id },
    });
    console.log('[DAL] record', record);
    if (!record) {
        return null;
    }
    return {
        block: record as IBlock,
        role: record.createdById === userId ? BlockRole.Editor : BlockRole.Reader,
    };
});
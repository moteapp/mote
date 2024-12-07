import { verifyToken } from "mote/app/lib/dal";
import { prisma } from "mote/base/parts/storage/common/prisma";
import { CollectionCreateSchema, ICollectionCreateRequest } from "mote/platform/request/common/collection";
import { collectionCreator } from "mote/server/commands/collectionCommands";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const payload : ICollectionCreateRequest = CollectionCreateSchema.parse(body);

    const auth = await verifyToken();

    const collection = await collectionCreator({...payload, userId: auth.userId, description: undefined});

    console.log('[collection] created', collection);

    return NextResponse.json({
        ok: true,
        data: collection,
        status: 200,
    });
}
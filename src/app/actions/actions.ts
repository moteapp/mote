'use server';

import { ICollectionSchema } from "mote/platform/request/common/collection";
import { redirect } from "next/navigation";
import { verifyToken } from "mote/app/lib/dal";
import { collectionCreator } from "mote/server/commands/collectionCreator";

export async function createCollectionAction(values: ICollectionSchema) {
    const auth = await verifyToken();

    const collection = await collectionCreator({...values, userId: auth.userId, description: undefined});

    redirect(`/collection/${collection.id}`);
}
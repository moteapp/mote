import isUndefined from "lodash/isUndefined";
import { CollectionPermission } from "mote/base/parts/storage/common/schema";
import { z } from "zod";

export const CollectionSchema = z.object({
    name: z.string().min(2).max(50),
    permission: z.
        nativeEnum(CollectionPermission)
        .nullish()
        .transform((val) => (isUndefined(val) ? null : val))
        ,
    sharing: z.boolean().default(true),
    spaceId: z.string(),
});

export const CollectionCreateSchema = CollectionSchema.merge(z.object({
    description: z.string().nullish(),
    icon: z.string().optional(),
}));

export type ICollectionSchema = z.infer<typeof CollectionSchema>;

export type ICollectionCreateRequest = z.infer<typeof CollectionCreateSchema>;
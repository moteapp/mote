import { useAppDispatch, useAppSelector } from "mote/app/hooks";
import { addCollection } from "mote/app/slices/collections/collectionsSlice";
import { selectCurrentSpace, selectUser } from "mote/app/slices/user/userSlice";
import { CollectionForm, CollectionFormData } from "mote/base/components/collection/collectionForm"
import { useCallback } from "react"

export const NewCollection = () => {
    const dispatch = useAppDispatch();
    const space = useAppSelector(selectCurrentSpace);
    const user = useAppSelector(selectUser);
    const handleSubmit = useCallback(async (data: CollectionFormData) => {
        dispatch(addCollection({
            ...data,
            spaceId: space.id,
            createBy: user?.id
        }));
    }, []);

    return (
        <CollectionForm handleSubmit={handleSubmit}/>
    )
}
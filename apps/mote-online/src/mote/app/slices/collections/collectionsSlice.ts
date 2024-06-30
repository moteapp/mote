import { createAppSlice } from "mote/app/createAppSlice";
import { ICollectionModel } from "@mote/client/model/model";
import * as collectionsAPI from './collectionsAPI';

export interface ICollectionsState {
    collections: ICollectionModel[];
    status: string;
}

const initialState: ICollectionsState = {
    collections: [],
    status: "idle",
}

export const collectionsSlice = createAppSlice({
    name: 'collections',
    initialState: initialState as ICollectionsState,
    reducers: create => ({
        addCollection: create.asyncThunk(
            async (collection: Partial<ICollectionModel>) => {
                const response = await collectionsAPI.createCollection(collection);
                // The value we return becomes the `fulfilled` action payload
                return response.data
            },
            {
                fulfilled: (state, action) => {
                    state.status = "logged";
                    state.collections = action.payload;
                },
            }
        ),
        fetchCollections: create.asyncThunk(
            async () => {
                const response = await collectionsAPI.getCollections();
                // The value we return becomes the `fulfilled` action payload
                return response.data
            },
            {
                fulfilled: (state, action) => {
                    state.status = "logged";
                    state.collections = action.payload;
                },
            }
        )
    }),
    selectors: {
        selectCollections: (state) => state.collections,
    }
});

// Action creators are generated for each case reducer function.
export const { addCollection, fetchCollections } = collectionsSlice.actions;

export const { selectCollections } = collectionsSlice.selectors;

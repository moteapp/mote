import { createSelector } from "@reduxjs/toolkit";
import { EditorCommands } from "mote/editor/browser/coreCommands";
import { BlockMap, BlockRole, BlockType, IBlockAndRole, IBlockProvider, LayoutStyle, Pointer } from "mote/editor/common/blockCommon";
import { createAppSlice } from "../../createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: BlockMap = {};

export type NewPagePayload = {
    spaceId: string;
    rootId?: string;
    collectionId: string | null;
    userId: string;
    parentId?: string;
};

export const blockSlice = createAppSlice({
    name: 'blocks',
    initialState,
    reducers: {
        newPage: (state, action: PayloadAction<NewPagePayload>) => {
            const parent = action.payload.parentId ? state[action.payload.parentId].block : undefined;
            const provider: IBlockProvider = {
                provideBlock: (id: string) => state[id],
            };
        },
    },
    selectors: {
        selectBlock: (state: BlockMap, id: string) => state[id],
        selectAllBlocks: (state: BlockMap) => Object.values(state),
    },
});

export const { newPage } = blockSlice.actions;
export const { selectBlock, selectAllBlocks } = blockSlice.selectors;

export const selectBlocksRecentlyViewed = createSelector([selectAllBlocks], (blocks) =>
    blocks.sort((a, b) => b.block.lastViewedAt?.getSeconds() - a.block.lastViewedAt.getSeconds())
);

export const selectBlocksRecentlyUpdated = createSelector([selectAllBlocks], (blocks) =>
    blocks.sort((a, b) => b.block.updatedAt.getSeconds() - a.block.updatedAt.getSeconds())
);

export const selectBlocksCreatedByMe = createSelector(
    [selectAllBlocks, (state, userId: string) => userId],
    (blocks, userId) =>
        blocks.filter((block) => block.block.createdById === userId)
);

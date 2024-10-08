import { createSelector } from "@reduxjs/toolkit";
import { EditorCommands } from "mote/editor/browser/coreCommands";
import { BlockMap, BlockRole, BlockType, IBlockAndRole, IBlockProvider, LayoutStyle, Pointer } from "mote/editor/common/blockCommon";
import { Transaction } from "mote/platform/editor/common/transaction";
import { createAppSlice } from "../../createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: BlockMap = {};

export type NewPagePayload = {
    spaceId: string;
    collectionId: string;
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
            const tx = Transaction.create(action.payload.userId);
            const blocks = EditorCommands.newPage({...action.payload, provider, parent, tx});
            tx.commit();
            return {...state, ...blocks};
        },
    },
    selectors: {
        selectBlock: (state: BlockMap, id: string) => state[id],
        selectAllBlocks: (state: BlockMap) => Object.values(state),
    },
});

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

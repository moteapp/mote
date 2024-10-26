import { table } from "console";
import { generateUuid } from "mote/base/common/uuid";
import { IBaseBlock } from "mote/base/parts/storage/common/schema";
import { CommandType } from "mote/platform/editor/common/editor";
import { Transaction } from "mote/platform/editor/common/transaction";
import { BlockMap, BlockRole, BlockType, IBlock, IBlockAndRole, IBlockProvider, IBlockStore, ILayoutBlock, IPageBlock, ITextBlock, LayoutStyle, newTextBlock, TextStyle } from "../common/blockCommon";
import { appendToParentOperation, CursorOperation, newSetOperation, UpdateOperation } from "../common/cursor/cursorOperations";
import { BlockModel } from "../common/model/blockModel";
import { EditorCommand } from "./editorExtensions";

export type NewPageOptions = {
    spaceId: string;
    collectionId: string | null;
    rootId?: string;
    parent?: IBlock;
    userId: string;
    store: IBlockStore;
    tx: Transaction;
}

export type IEditOperationResult = {
    blocks: BlockMap;
    operations: CursorOperation[];
}

export class EditorCommands {
    /**
     * Create a new page under the given space and collection.
     * @param spaceId 
     * @param collectionId 
     * @param rootId 
     * @param parentId 
     */
    static newPage({
        spaceId,
        collectionId,
        rootId,
        userId,
        store,
        tx
    }: NewPageOptions) {
        rootId = rootId || generateUuid();
        const pointer = { id: rootId, table: 'block', spaceId };
        const model = new BlockModel(pointer, store);
        const block: IPageBlock = {
            id: rootId,
            rootId,
            spaceId,
            parentId: null,
            children: [],
            collectionId: collectionId,
            content: null,
            type: BlockType.Page,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastViewedAt: new Date(),
            version: 1,
            createdById: userId,
        };

        tx.addOperation(newSetOperation(model, block));

        // Create a new layout block
        EditorCommands.newPageLayout(userId, model, store, tx);
    }

    static newPageLayout(userId: string, pageModel: BlockModel, store: IBlockStore, tx: Transaction) {
        const parent = pageModel.getChildrenModel();
        const rootModel = pageModel.getRootModel();
        const block: ILayoutBlock = {
            id: generateUuid(),
            rootId: pageModel.rootId,
            parentId: pageModel.id,
            children: [],
            collectionId: pageModel.collectionId,
            spaceId: pageModel.spaceId,
            type: BlockType.Layout,
            content: {
                style: LayoutStyle.Header,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            lastViewedAt: new Date(),
            version: 1,
            createdById: userId,
        };
        const model = BlockModel.createChildBlockModel(rootModel, parent, { id: block.id, table: 'block' }, store);
        // Set the block value
        tx.addOperation(newSetOperation(model, block));
        // Append the new block to the parent
        tx.addOperation(appendToParentOperation(parent, model));

        // Create a new text block as the page title
        EditorCommands.newPageTitle(userId, model, store, tx);
    }

    static newPageTitle(userId: string, layoutModel: BlockModel, store: IBlockStore, tx: Transaction) {
        const parent = layoutModel.getChildrenModel();
        const rootModel = layoutModel.getRootModel();
        const block: ITextBlock = newTextBlock({userId, parent: layoutModel.value, style: TextStyle.Title});
        const model = BlockModel.createChildBlockModel(rootModel, parent, { id: block.id, table: 'block' }, store);

        tx.addOperation(newSetOperation(model, block));
        tx.addOperation(appendToParentOperation(parent, model));
    }
}

export abstract class CoreEditorCommand<T> extends EditorCommand {
    
}
import { generateUuid } from "mote/base/common/uuid";
import { IBaseBlock } from "mote/base/parts/storage/common/schema";
import { CommandType } from "mote/platform/editor/common/editor";
import { Transaction } from "mote/platform/editor/common/transaction";
import { BlockMap, BlockRole, BlockType, IBlock, IBlockProvider, ILayoutBlock, IPageBlock, ITextBlock, LayoutStyle, TextStyle } from "../common/blockCommon";
import { CursorOperation, UpdateOperation } from "../common/cursor/cursorTypeOperations";
import { EditorCommand } from "./editorExtensions";

export type NewPageOptions = {
    spaceId: string;
    collectionId: string;
    rootId?: string;
    parent?: IBlock;
    userId: string;
    provider: IBlockProvider,
    tx: Transaction;
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
        provider,
        tx
    }: NewPageOptions) {
        rootId = rootId || generateUuid();
        const block: IPageBlock = {
            id: rootId,
            rootId,
            spaceId,
            parent: null,
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

        const operation = EditorCommands.newCreateOperation(block, block);
        EditorCommands.applyOperation(tx, operation, provider);
        // Create a new layout block
        const blocks = EditorCommands.newPageLayout(userId, block, provider, tx);
        blocks[block.id] = { block, role: BlockRole.Editor };
        return blocks;
    }

    static newPageLayout(userId: string, parent: IBaseBlock, provider: IBlockProvider, tx: Transaction) {
        const block: ILayoutBlock = {
            id: generateUuid(),
            rootId: parent.rootId,
            parent: parent,
            parentId: parent.id,
            children: [],
            collectionId: parent.collectionId,
            spaceId: parent.spaceId,
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

        const operation = EditorCommands.newCreateOperation(block, block);
        EditorCommands.applyOperation(tx, operation, provider);
        // Create a new text block as the page title
        const titleBlock = EditorCommands.newPageTitle(userId, block, provider, tx);
        const blocks: BlockMap = {};
        blocks[titleBlock.block.id] = titleBlock;
        blocks[block.id] = { block, role: BlockRole.Editor };
        return blocks;
    }

    static newPageTitle(userId: string, parent: IBlock, provider: IBlockProvider, tx: Transaction) {
        const block: ITextBlock = {
            id: generateUuid(),
            rootId: parent.rootId,
            parent: parent as IBaseBlock,
            parentId: parent.id,
            spaceId: parent.spaceId,
            children: [],
            collectionId: parent.collectionId,
            type: BlockType.Text,
            content: {
                style: TextStyle.Title,
                value: []
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            lastViewedAt: new Date(),
            version: 1,
            createdById: userId,
        };

        const operation = EditorCommands.newCreateOperation(block, block);
        EditorCommands.applyOperation(tx, operation, provider);

        return { block, role: BlockRole.Editor };
    }

    public static newUpdateOperation(
        block: IBlock,
        data: Partial<IBlock>
    ): UpdateOperation {
        return new UpdateOperation({
            id: block.id,
            table: 'block',
            path: [],
            type: CommandType.Update,
            args: data,
        });
    }

    public static newCreateOperation(
        block: IBlock,
        data: Partial<IBlock>
    ): UpdateOperation {
        return new UpdateOperation({
            id: block.id,
            table: 'block',
            path: [],
            type: CommandType.Set,
            args: data,
        });
    }

    private static applyOperation(tx: Transaction, operation: CursorOperation, provider: IBlockProvider) {
        tx.addOperation(operation.toJSON());
        return operation.runCommand(provider);
    }
}

export abstract class CoreEditorCommand<T> extends EditorCommand {
    
}
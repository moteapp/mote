import { generateUuid } from "mote/base/common/uuid";
import { IRecordService } from "mote/platform/record/common/record";
import { IOperation, OperationType } from "mote/platform/request/common/request";
import { BlockMap, BlockRole, BlockType, IBlock, IBlockAndRole, IBlockProvider, IBlockStore, ILayoutBlock, IPageBlock, ITextBlock, LayoutStyle, newTextBlock, TextStyle } from "../common/blockCommon";
import { BlockModel } from "../common/model/blockModel";
import { RecordModel } from "../common/model/recordModel";
import { EditorCommand } from "./editorExtensions";

export type NewPageOptions = {
    spaceId: string;
    collectionId: string | null;
    rootId?: string;
    parent?: IBlock;
    userId: string;
    recordService: IRecordService
}

export abstract class CoreEditorCommand<T> extends EditorCommand {
    
}

export function newPage(options: NewPageOptions) {
    const {
        spaceId,
        collectionId,
        userId,
        recordService
    } = options;
    const operations: IOperation[] = [];
    const rootId = options.rootId || generateUuid();
    const pointer = { id: rootId, table: 'block', spaceId };
    const model = new BlockModel(pointer, recordService);
    model.setRootModel(model);
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

    operations.push(newSetOperation(model, block));

    // Create a new layout block
    operations.push(...newPageLayout({ ...options, rootId, pageModel: model }));
    return operations;
}

type NewPageLayoutOptions = NewPageOptions & {
    rootId: string;
    pageModel: BlockModel
}

function newPageLayout(options: NewPageLayoutOptions): IOperation[] {
    const operations: IOperation[] = [];

    const { pageModel, userId, rootId, spaceId, collectionId } = options;
    const parent = pageModel.getChildrenModel();
    const rootModel = pageModel.getRootModel();
    const block: ILayoutBlock = {
        id: generateUuid(),
        rootId: rootId,
        parentId: pageModel.id,
        children: [],
        collectionId,
        spaceId,
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

    const model = BlockModel.createChildBlockModel(
        rootModel, parent, { id: block.id, table: 'block' }, pageModel.recordService);
    // Set the block value
    operations.push(newSetOperation(model, block));
    // Append the new block to the parent
    operations.push(newAppendToParentOperation(parent, model));

    // Create a new text block as the page title
    operations.push(...newPageTitle({
        ...options, 
        layoutModel: model,
        layoutBlock: block
    }));

    return operations;
}

type NewPageTitleOptions = NewPageOptions & {
    rootId: string;
    layoutModel: BlockModel;
    layoutBlock: ILayoutBlock;
}

function newPageTitle(options: NewPageTitleOptions) {
    const operations: IOperation[] = [];

    const { layoutModel, userId, layoutBlock } = options;

    const parent = layoutModel.getChildrenModel();
    const rootModel = layoutModel.getRootModel();
    const block: ITextBlock = newTextBlock({userId, parent: layoutBlock, style: TextStyle.Title});
    const model = BlockModel.createChildBlockModel(rootModel, parent, { id: block.id, table: 'block' }, layoutModel.recordService);

    operations.push(newSetOperation(model, block));
    operations.push(newAppendToParentOperation(parent, model));
    return operations;
}

function newSetOperation<T>(
    block: RecordModel<T>,
    data: Partial<T>
): IOperation {
    const { id , table, path } = block;
    return {id, table, path, type: OperationType.Set, args: data};
}

function newAppendToParentOperation(
    parent: RecordModel,
    child: RecordModel
): IOperation {
    return newListAfterOperation(parent, {id: child.id});
}

type ListOperationTarget = {id: string} & object | string;

function newListAfterOperation<T>(
    block: RecordModel<T>,
    data: ListOperationTarget
): IOperation {
    const { id , table, path } = block;
    return {id, table, path, type: OperationType.ListAfter, args: data};
}
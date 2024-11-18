import { match } from 'ts-pattern';
import { Event } from "mote/base/common/event";
import { generateUuid } from 'mote/base/common/uuid';
import { IBaseBlock } from "mote/base/parts/storage/common/schema";

export enum Role {
    Editor = 0,
    Reader,
}

export enum BlockType {
    Empty = '',
    Page = 'page',
    Dataview = 'dataview',
    Layout = 'layout',
    Text = 'text',
    File = 'file',
    Bookmark = 'bookmark',
    IconPage = 'iconPage',
    IconUser = 'iconUser',
    Div = 'div',
    Link = 'link',
    Cover = 'cover',
    Relation = 'relation',
    Featured = 'featured',
    Type = 'type',
    Embed = 'latex',
    Table = 'table',
    TableColumn = 'tableColumn',
    TableRow = 'tableRow',
    TableOfContents = 'tableOfContents',
    Widget = 'widget',
}

//#region Text Block

export enum TextStyle {
    Paragraph = 0,
    Header1 = 1,
    Header2 = 2,
    Header3 = 3,
    Header4 = 4,
    Quote = 5,
    Code = 6,
    Title = 7,
    Checkbox = 8,
    Bulleted = 9,
    Numbered = 10,
    Toggle = 11,
    Description = 12,
    Callout = 13,
}

export type IAnnotation = [string];

/**
 * A segment of text with optional annotations.
 * The first element is the text, the second element is an array of annotations.
 *
 * Example:
 * ```
 * ['Hello, world!', [['b'], ['a', 'www.hello.com']]]
 * ```
 * - It represents the text "Hello, world!" with a bold annotation and a link annotation.
 * - The link annotation points to "www.hello.com".
 */
export type ISegment = [string] | [string, IAnnotation[]];

export type TextContent = {
    value: ISegment[];
    style: TextStyle;
};

export interface ITextBlock extends IBaseBlock {
    type: BlockType.Text;
    content: TextContent;
}

//#endregion

export interface IPageBlock extends IBaseBlock {
    type: BlockType.Page;
}

//#region Layout Block

export enum LayoutStyle {
    Row = 0,
    Column = 1,
    Div = 2,
    Header = 3,
    TableRows = 4,
    TableColumns = 5,

    Footer = 100,
}

export interface LayoutContent {
    style: LayoutStyle;
}

export interface ILayoutBlock extends Omit<IBaseBlock, 'content'> {
    type: BlockType.Layout;
    content: LayoutContent;
}

//#endregion

export enum BlockRole {
    Editor = 0,
    Reader,
}

export type IBlock = ITextBlock | IPageBlock | ILayoutBlock;

export type IBlockAndRole = {
    role: BlockRole;
    block: IBlock;
};

//#region Block Type Guards

export function isTextBlock(block: IBlock): block is ITextBlock {
    return block.type === BlockType.Text;
}

export function isTextToggle(block: IBlock): block is ITextBlock & { content: { style: TextStyle.Toggle } } {
    return isTextBlock(block) && block.content.style === TextStyle.Toggle;
}

export function isPageBlock(block: IBlock): block is IPageBlock {
    return block.type === BlockType.Page;
}

export function isLayoutBlock(block: IBlock): block is ILayoutBlock {
    return block.type === BlockType.Layout;
}

export function isLayoutHeader(block: IBlock): block is ILayoutBlock & { content: { style: LayoutStyle.Header } } {
    return isLayoutBlock(block) && block.content.style === LayoutStyle.Header;
}

export function isLayoutRow(block: IBlock): boolean {
    return isLayoutBlock(block) && block.content.style === LayoutStyle.Row;
}

//#endregion

/**
 * Get the text value of a text block.
 * @param block ITextBlock
 * @returns 
 */
export function generateTextFromSegements(segments: ISegment[]): string {
    return segments.map(([text]) => text).join('');
}

export function getBlockClassName(block: IBlock): string {
    const classNames: string[] = [];
    const defaultClass = `block-${block.type}`;
    match(block)
    .when(isTextBlock, (block) => {
        classNames.push(`text${TextStyle[block.content.style] || 'Paragraph'}`)
    })
    .when(isLayoutBlock, (block) => {
        classNames.push(`layout${LayoutStyle[block.content.style]}`)
    })
    .run();

    classNames.push(defaultClass);
    return classNames.join(' ');
}

export interface IBlockProvider {
    provideBlock(id: string): IBlockAndRole | undefined;
}

export interface IBlockStore {
    onDidChange: Event<IBlockAndRole>;
    get(id: string): IBlockAndRole | undefined;
    set(id: string, block: IBlockAndRole): void;
    remove(id: string): void;
}

export type IBlockChild = Pick<IBaseBlock, 'id'|'type'|'content'>

export type BlockMap = Record<string, IBlockAndRole>;

export type IBaseNewBlockOptions = {
    id?: string;
    rootId?: string;
    parent?: IBlock;
    userId: string;
}

export type INewTextBlockOptions = IBaseNewBlockOptions &{
    style?: TextStyle;
}

export function newTextBlock(options: INewTextBlockOptions): ITextBlock {
    const baseBlock = newBlock({
        ...options,
        type: BlockType.Text,
    });
    const style = options.style || TextStyle.Paragraph;
    return {...baseBlock, content: { value: [], style}} as ITextBlock;
}

export type INewBlockOptions = IBaseNewBlockOptions & {
    type: BlockType;
}

export function newBlock(options: INewBlockOptions) {
    const id = options.id || generateUuid();
    const rootId = options.rootId || id;
    const type = options.type;
    const parentId = options.parent?.id || null;
    const collectionId = options.parent?.collectionId || null;
    const spaceId = options.parent?.spaceId || null;

    return {
        id,
        rootId,
        parentId,
        collectionId,
        spaceId,
        type,
        content: {},
        children: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastViewedAt: new Date(),
        version: 1,
        createdById: options.userId,
    };
}
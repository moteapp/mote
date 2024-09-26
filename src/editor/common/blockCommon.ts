import { match } from 'ts-pattern';
import { IBaseBlock } from "mote/base/parts/storage/common/schema";

/**
 * The common properties of a block component.
 */
export type IBlockComponentProps = {
    id?: string;
    rootId: string;
    block?: IBlock;
    className?: string;
}

export enum Role {
    Editor = 0,
    Reader,
}

export type Pointer = {
    table: string;
    id: string;
    spaceId?: string;
};

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
export type ISegment = [string, IAnnotation[]];

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

export function findLayoutHeader(block: IBlock): ILayoutBlock | undefined {
    const children = block.children as IBlock[];
    return children.find(isLayoutHeader);
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

export type BlockMap = { [key: string]: IBlockAndRole };

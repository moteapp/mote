import { match } from "ts-pattern";
import { IBaseBlock } from "mote/base/parts/storage/common/schema";
import { IRecordService, Pointer } from "mote/platform/record/common/record";
import { BlockType, ITextBlock, TextStyle, ILayoutBlock, IPageBlock, LayoutStyle, IBlockProvider, IBlockStore, isTextBlock, IBlock, isLayoutBlock, ISegment, IBlockChild } from "../blockCommon";
import { RecordModel } from "./recordModel";


export class BlockModel extends RecordModel<IBlock> {

    static createChildBlockModel(
        root: BlockModel | undefined,
        parent: RecordModel<string[]>,
        pointer: Pointer,
        recordService: IRecordService,
    ): BlockModel {
        let childModel = parent.getChildModel(pointer, []) as BlockModel;
        if (childModel) {
            return childModel;
        }
        childModel = new BlockModel(pointer, recordService);
        parent.addChildModel(childModel);
        childModel.setParent(parent);
        childModel.setRootModel(root);
        return childModel;
    }

    constructor(
        public pointer: Pointer,
        recordService: IRecordService,
    ) {
        super(pointer, [], recordService);
    }

    //#region Properties

    get rootId() {
        return this.value.rootId;
    }

    get spaceId() {
        return this.value.spaceId;
    }

    get collectionId() {
        return this.value.collectionId;
    }

    get parentId() {
        return this.value.parentId;
    }

    get type(): BlockType {
        return this.value.type as BlockType;
    }

    get children() {
        return this.value.children;
    }

    get className() {
        const classNames: string[] = [];
        const defaultClass = `block-${this.type}`;
        match(this.value)
        .when(isTextBlock, (value) => {
            classNames.push(`text${TextStyle[value.content.style] || 'Paragraph'}`)
        })
        .when(isLayoutBlock, (block) => {
            classNames.push(`layout${LayoutStyle[block.content.style]}`)
        })
        .otherwise(() => {});

        classNames.push(defaultClass);
        return classNames.join(' ');
    }

    getText(): string {
        if (this.isText()) {
            return this.value.content.value
                .map((segment) => segment[0])
                .join('');
        }
        return '';
    }

    //#endregion

    //#region Type Guards

    isText(): this is { value: ITextBlock } {
        return isTextBlock(this.value);
    }

    isTextCode(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Code;
        }
        return false;
    }

    isTextTitle(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Title;
        }
        return false;
    }

    isTextDescription(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Description;
        }
        return false;
    }

    isTextParagraph(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Paragraph;
        }
        return false;
    }

    isTextToggle(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Toggle;
        }
        return false;
    }

    isTextNumbered(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Numbered;
        }
        return false;
    }

    isTextBulleted(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Bulleted;
        }
        return false;
    }

    isTextCheckbox(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Checkbox;
        }
        return false;
    }

    isTextCallout(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Callout;
        }
        return false;
    }

    isTextQuote(): boolean {
        if (this.isText()) {
            return this.value.content.style === TextStyle.Quote;
        }
        return false;
    }

    isTextList(): boolean {
        return (
            this.isTextToggle() ||
            this.isTextNumbered() ||
            this.isTextBulleted() ||
            this.isTextCheckbox()
        );
    }

    isPage(): this is { value: IPageBlock } {
        return this.type === BlockType.Page;
    }

    isLayout(): this is { value: ILayoutBlock } {
        return this.type === BlockType.Layout;
    }

    isLayoutRow(): boolean {
        if (this.isLayout()) {
            return this.value.content.style === LayoutStyle.Row;
        }
        return false;
    }

    isLayoutHeader(): boolean {
        if (this.isLayout()) {
            return this.value.content.style === LayoutStyle.Header;
        }
        return false;
    }

    isSystem() {
        return this.isPage() || this.isLayout();
    }

    //#endregion

    private rootModel: BlockModel | undefined;
    setRootModel(rootModel: BlockModel | undefined) {
        this.rootModel = rootModel;
    }

    getRootModel(): BlockModel | undefined {
        return this.rootModel;
    }

    getChildrenModel(): RecordModel<string[]> {
        return this.getPropertyModel('children');
    }

    getChildrenModels(): BlockModel[] {
        const parent = this.getChildrenModel();
        if (!this.value) {
            return [];
        }
        const children = this.value.children || [];
        return children.map((child) => {
            const pointer = { id: child, table: this.pointer.table };
            return BlockModel.createChildBlockModel(this.getRootModel(), parent, pointer, this.recordService);
        });
    }

    getTextValueModel() {
        if (this.isText()) {
            return RecordModel.createChildModel<ISegment[]>(
                this,
                this.pointer,
                ['content', 'value'],
            );
        }
        throw new Error('Block is not a text block');
    }

    getContentModel() {
        return RecordModel.createChildModel<any>(
            this,
            this.pointer,
            ['content'],
        );
    }
    
    getLayoutHeaderModel() {
        const models = this.getChildrenModels();
        return models.find((model) => model.isLayoutHeader());
    }
}
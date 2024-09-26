import { IBaseBlock } from "mote/base/parts/storage/common/schema";
import { Pointer, BlockType, ITextBlock, TextStyle, ILayoutBlock, IPageBlock, LayoutStyle } from "../blockCommon";
import { RecordModel } from "./recordModel";

export class BlockModel extends RecordModel<IBaseBlock> {

    static createChildBlockModel(
        parent: RecordModel<string[]>,
        pointer: Pointer
    ): BlockModel {
        let childModel = parent.getChildModel(pointer, []) as BlockModel;
        if (childModel) {
            return childModel;
        }
        childModel = new BlockModel(pointer, []);
        parent.addChildModel(childModel);
        return childModel;
    }

    //#region Properties

    get parentId() {
        return this.value.parentId;
    }

    get type(): BlockType {
        return this.value.type as BlockType;
    }

    get children() {
        return this.value.children;
    }

    //#endregion

    //#region Type Guards

    isText(): this is { value: ITextBlock } {
        return this.type === BlockType.Text;
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

    getChildrenModel(): RecordModel<{id: string}[]> {
        return this.getPropertyModel('children') as RecordModel<{id: string}[]>;
    }

    getChildrenModels() {
        const parent = this.getChildrenModel();
        const children = this.value.children || [];
        return children.map((child) => {
            const pointer = { id: child.id, table: this.pointer.table };
            return BlockModel.createChildBlockModel(parent, pointer);
        });
    }
    
    getLayoutHeaderModel() {
        const models = this.getChildrenModels();
        return models.find((model) => model.isLayoutHeader());
    }
}
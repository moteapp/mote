import { BlockModel } from "./blockModel";
import type { IPointer, IRecord, IRecordProvider } from "../recordCommon";
import { RecordModel } from "./recordModel";

export interface ISpaceRootRecord extends IRecord {

}

export class SpaceRootModel extends RecordModel<ISpaceRootRecord> {

    static createChildSpaceModel(parentModel: SpaceRootModel, pointer: IPointer, recordProvider: IRecordProvider) : SpaceModel {
        const model = new SpaceModel(pointer, recordProvider);
        model.setParent(parentModel);
        return model;
    }

    constructor(
        pointer: IPointer,
        recordProvider: IRecordProvider
    ) {
        super(pointer, [], recordProvider);
    }

    get spaceIds() {
        return this.value.content || ['test-space'];
    }

    get spaces() {
        return this.spaceIds.map(id => 
            SpaceRootModel.createChildSpaceModel(this, { id: id, table: 'space' }, this.recordProvider)
        );
    }
}

export class SpaceModel extends RecordModel<IRecord> {

    static createChildBlockModel(parent: SpaceModel, pointer: IPointer, recordProvider: IRecordProvider) : BlockModel {
        let childModel = parent.getChildModel(pointer, []) as BlockModel;
        if (childModel) {
            return childModel;
        }
        childModel = new BlockModel(pointer, recordProvider);
        childModel.setParent(parent);
        parent.addChildModel(childModel);
        return childModel;
    }

    constructor(
        pointer: IPointer,
        recordProvider: IRecordProvider
    ) {
        super(pointer, [], recordProvider);
    }

    get pageIds() {
        return this.value.content || ['test-page'];
    }

    get pages() {
        return this.pageIds.map(id => SpaceModel.createChildBlockModel(this, { id: id, table: 'block' }, this.recordProvider));
    }
}
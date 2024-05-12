import type { IPointer, IRecord, IRecordProvider } from "./recordCommon";
import { RecordModel } from "./recordStore";

export interface ISpaceRootRecord extends IRecord {

}

export class SpaceRootModel extends RecordModel<ISpaceRootRecord> {

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
            SpaceModel.createChildModel(this, { id: id, table: 'space' }, this.recordProvider)
        );
    }
}

export class SpaceModel extends RecordModel<IRecord> {

    static createChildModel(parentModel: SpaceRootModel, pointer: IPointer, recordProvider: IRecordProvider) : SpaceModel {
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
}
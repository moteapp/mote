import { BlockModel } from "./blockModel";
import type { IPointer, IRecord, IRecordProvider } from "../recordCommon";
import { RecordModel } from "./recordModel";
import { URI } from "@mote/base/common/uri";

export interface ISpaceRootRecord extends IRecord {

}

export class SpaceRootModel extends RecordModel<ISpaceRootRecord> {

    static createChildSpaceModel(parentModel: SpaceRootModel, uri: URI, recordProvider: IRecordProvider) : SpaceModel {
        const model = new SpaceModel(uri, recordProvider);
        model.setParent(parentModel);
        return model;
    }

    constructor(
        uri: URI,
        recordProvider: IRecordProvider
    ) {
        super(uri, [], recordProvider);
    }

    get spaceIds() {
        return this.value.content || ['test-space'];
    }

    get spaces() {
        return this.spaceIds.map(id => 
            SpaceRootModel.createChildSpaceModel(this, this.uri, this.recordProvider)
        );
    }
}

export class SpaceModel extends RecordModel<IRecord> {

    static createChildBlockModel(parent: SpaceModel, uri: URI, recordProvider: IRecordProvider) : BlockModel {
        let childModel = parent.getChildModel(uri, []) as BlockModel;
        if (childModel) {
            return childModel;
        }
        childModel = new BlockModel(uri, recordProvider);
        childModel.setParent(parent);
        parent.addChildModel(childModel);
        return childModel;
    }

    constructor(
        uri: URI,
        recordProvider: IRecordProvider
    ) {
        super(uri, [], recordProvider);
    }

    get pageIds() {
        return this.value.content || ['test-page'];
    }

    get pages() {
        return this.pageIds.map(id => SpaceModel.createChildBlockModel(this, this.uri, this.recordProvider));
    }
}
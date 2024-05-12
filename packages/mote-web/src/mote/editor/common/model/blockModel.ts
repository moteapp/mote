import { URI } from "vs/base/common/uri";
import { IBlockRecord, IPointer, IRecord, IRecordProvider, ISegment } from "../recordCommon";
import { RecordModel } from "./recordModel";

export class BlockModel extends RecordModel<IBlockRecord> {

    static createChildBlockModel(
        parent: RecordModel<string[]>, 
        uri: URI, 
        recordProvider: IRecordProvider
    ) : BlockModel {
        let childModel = parent.getChildModel(uri, []) as BlockModel;
        if (childModel) {
            return childModel;
        }
        childModel = new BlockModel(uri, recordProvider);
        parent.addChildModel(childModel);
        return childModel;
    }

    constructor(
        uri: URI,
        recordProvider: IRecordProvider
    ) {
        super(uri, [], recordProvider);
    }

    get type() {
        return this.value.type;
    }

    getTitleModel() {
        return this.getPropertyModel('title');
    }

    getContentModel() {
        return this.getPropertyModel('content');
    }

    getPropertyModel<T extends keyof IRecord>(property: T): RecordModel<IRecord[T]> {
        return RecordModel.createChildModel<IRecord[T]>(this, this.uri, [property], this.recordProvider);
    }

    getChildrenModels() {
        return this.value.content.map((child: string) => {
            const uri = URI.from({scheme: this.uri.scheme, authority: this.uri.authority, path: '/' + child, query: `type=block`});
            return BlockModel.createChildBlockModel(
                this.getContentModel(), 
                uri,
                this.recordProvider
            );
        });
    }
}
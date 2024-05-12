import { IRecord, IRecordModel, ISegment, RecordMetadata } from '../../../editor/common/recordCommon';

export class RecordModel implements IRecordModel {

    constructor(
        private record: IRecord
    ) {

    }

    //#region Properties

    get id() {
        return this.record.id
    }

    get title() {
        return this.record.title
    }

    get content() {
        return this.record.content
    }

    get metadata() {
        return this.record.metadata
    }

    get version() {
        return this.record.version
    }

    get lastVersion() {
        return this.record.lastVersion
    }

    get table() {
        return this.record.table
    }

    get spaceId() {
        return this.record.spaceId
    }

    get type() {
        return this.record.type
    }

    get userId() {
        return this.record.userId
    }

    //#endregion
}
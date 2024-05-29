import { Event } from 'vs/base/common/event';
import { IRecord } from '@mote/editor/common/recordCommon';
import { URI } from 'vs/base/common/uri';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';

export const IRecordService = createDecorator<IRecordService>('recordService');

export interface IRecordService {
    readonly _serviceBrand: undefined;

    onRecordAdded: Event<IRecord>;
    onRecordRemoved: Event<IRecord>;

    createRecord(resource: URI, value: string): IRecord;

    updateRecord(record: IRecord): void;

    getRecord(resource: URI): IRecord | null;

    removeRecord(resource: URI): void;
}
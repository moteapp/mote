import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { IPointer, IRecord } from './recordCommon';
import { URI } from 'vs/base/common/uri';

export interface IDatabaseProvider {

    createRecord(resource: URI): IRecord;

    getRecord(resource: URI): IRecord | null;

    updateRecord(record: IRecord): void;

    destroyRecord(resource: URI): void;
}

export const IDatabaseService = createDecorator<IDatabaseService>('databaseService');

export interface IDatabaseService {

    readonly _serviceBrand: undefined;
    
    registerProvider(scheme: string, provider: IDatabaseProvider): void;

    getProvider(scheme: string): IDatabaseProvider;

    createRecord(resource: URI): IRecord;

    updateRecord(record: IRecord): void;

    destroyRecord(resource: URI): void;

    getRecord(resource: URI): IRecord | null;
}
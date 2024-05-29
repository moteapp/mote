import { URI } from 'mote/workbench/workbench.web.main';
import { IDatabaseProvider } from './database';
import { IRecord, generateRecordKey } from '../../../editor/common/recordCommon';
import { IStorageService } from 'mote/platform/storage/common/storage';
import { StorageScope, StorageTarget } from 'mote/platform/storage/common/storage';

export class RecordDatabaseProvider implements IDatabaseProvider {

    constructor(
        @IStorageService private readonly storageService: IStorageService
    ) {

    }

    /**
     * 
     * @param resource 
     */
    createRecord(resource: URI): IRecord {
        const params = new URLSearchParams(resource.query);
        const record: IRecord = {
            id: resource.path,
            table: resource.scheme,
            title: [],
            content: [],
            metadata: {},
            version: 0,
            lastVersion: 0,
            type: '',
            userId: params.get('userId') || '',
        };
        
        const recordKey = generateRecordKey(record);
        this.storageService.store(recordKey, JSON.stringify(record), StorageScope.PROFILE, StorageTarget.USER);

        return record;
    }
    
    getRecord(resource: URI): IRecord | null {
        const recordKey = generateRecordKey({id: resource.path, table: resource.scheme, title: [], content: [], metadata: {}, version: 0, lastVersion: 0, type: '', userId: ''});
        const record = this.storageService.get(recordKey, StorageScope.PROFILE, '');
        if (record) {
            return JSON.parse(record);
        }
        return null;
    }

    updateRecord(record: IRecord): void {
        const recordKey = generateRecordKey(record);
        this.storageService.store(recordKey, JSON.stringify(record), StorageScope.PROFILE, StorageTarget.USER);
    }

    destroyRecord(resource: URI): void {
        const recordKey = generateRecordKey({id: resource.path, table: resource.scheme, title: [], content: [], metadata: {}, version: 0, lastVersion: 0, type: '', userId: ''});
        this.storageService.remove(recordKey, StorageScope.PROFILE);
    }

}
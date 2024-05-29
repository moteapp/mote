import { Disposable } from "vs/base/common/lifecycle";
import { IRecord, IRecordProvider } from "../recordCommon";
import { IRecordService } from "./record";
import { Emitter, Event } from "vs/base/common/event";
import { URI } from "vs/base/common/uri";
import { InstantiationType, registerSingleton } from "vs/platform/instantiation/common/extensions";
import { ErrorNoTelemetry } from "vs/base/common/errors";
import { localize } from "vs/nls";
import { IStorageService, StorageScope, StorageTarget } from "mote/platform/storage/common/storage";
import { Schemas } from "mote/base/common/network";

class RecordProvider implements IRecordProvider {

    provideRecord(resource: URI): IRecord {
        throw new Error("Method not implemented.");
    }

}

/**
 * The formar of the resource: `scheme://authority/path?query#fragment`
 * @param resource 
 * @returns 
 */
function generateRecordKey(resource: URI): string {
    const params = new URLSearchParams(resource.query);
    const table = resource.authority;
    const id = resource.path;
    return `${table}:${id}`;
}

export class RecordService extends Disposable implements IRecordService {

    _serviceBrand: undefined;

    private readonly _onRecordAdded: Emitter<IRecord> = this._register(new Emitter<IRecord>());
    public readonly onRecordAdded: Event<IRecord> = this._onRecordAdded.event;

    private readonly _onRecordRemoved: Emitter<IRecord> = this._register(new Emitter<IRecord>());
    public readonly onRecordRemoved: Event<IRecord> = this._onRecordRemoved.event;

    private providers: Map<string, IRecordProvider> = new Map();

    constructor(
        @IStorageService private readonly storageService: IStorageService
    ) {
        super();
        const provider = new RecordProvider();
    }

    createRecord<T extends IRecord>(resource: URI, value: string): T {
        const params = new URLSearchParams(resource.query);
        const table = resource.authority;
        const id = resource.path.substring(1);
        const userId = params.get('userId') || '';

        const record: any = {
            table,
            id,
            userId,
            title: [[value]],
            content: [],
            metadata: {},
            version: 0,
            lastVersion: 0,
        };

        if (table === 'block') {
            const type = params.get('type') || 'block';
            record.type = type;
        }

        const key = generateRecordKey(resource);
        this.storageService.store(key, JSON.stringify(record), StorageScope.PROFILE, StorageTarget.USER);

        return record;
    }

    updateRecord(record: IRecord): void {
        const resource = URI.parse(`record://${record.table}/${record.id}`);
        const key = generateRecordKey(resource);
        this.storageService.store(key, JSON.stringify(record), StorageScope.PROFILE, StorageTarget.USER);
    }

    getRecord(resource: URI): IRecord | null {
        if (resource.scheme === Schemas.record) {
            const key = generateRecordKey(resource);
            const record = this.storageService.get(key, StorageScope.PROFILE, '');
            if (record) {
                return JSON.parse(record);
            }
            return this.createRecord(resource, '');
        }
        return this.withProvider(resource).provideRecord(resource);
    }

    removeRecord(resource: URI): void {
        throw new Error("Method not implemented.");
    }

    registerRecordProvider(scheme: string, provider: IRecordProvider): void {
        this.providers.set(scheme, provider);
    }

    protected withProvider(resource: URI): IRecordProvider {
        const provider = this.providers.get(resource.scheme);
        if (!provider) {
			const error = new ErrorNoTelemetry();
			error.message = localize('noProviderFound', "ENOPRO: No record provider found for resource '{0}'", resource.toString());

			throw error;
		}
        return provider;
    }
}

registerSingleton(IRecordService, RecordService, InstantiationType.Delayed);
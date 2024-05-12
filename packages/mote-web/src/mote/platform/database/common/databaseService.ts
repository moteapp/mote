import { IPointer, IRecord } from 'mote/editor/common/recordCommon';
import { IDatabaseProvider, IDatabaseService } from './database';
import { URI } from 'vs/base/common/uri';
import { ErrorNoTelemetry } from 'vs/base/common/errors';
import { localize } from 'vs/nls';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';


export class DatabaseService implements IDatabaseService {

    _serviceBrand: undefined;

    private providers: Map<string, IDatabaseProvider> = new Map();

    constructor() {

    }

    public registerProvider(scheme: string, provider: IDatabaseProvider): void {
        this.providers.set(scheme, provider);
    }

    public getProvider(scheme: string): IDatabaseProvider {
        return this.providers.get(scheme)!;
    }

    public createRecord(resource: URI): IRecord {
        return this.withProvider(resource).createRecord(resource);
    }

    public updateRecord(record: IRecord): void {
        const provider = this.withProvider(URI.from({scheme: record.table, path: record.id}));
        provider.updateRecord(record);
    }

    public getRecord(resource: URI): IRecord | null {
        return this.withProvider(resource).getRecord(resource);
    }

    public destroyRecord(resource: URI): void {
        this.withProvider(resource).destroyRecord(resource);
    }

    protected withProvider(resource: URI): IDatabaseProvider {
        const provider = this.providers.get(resource.scheme);
        if (!provider) {
			const error = new ErrorNoTelemetry();
			error.message = localize('noProviderFound', "ENOPRO: No database provider found for resource '{0}'", resource.toString());

			throw error;
		}
        return provider;
    }
}

//registerSingleton(IDatabaseService, DatabaseService, InstantiationType.Delayed);
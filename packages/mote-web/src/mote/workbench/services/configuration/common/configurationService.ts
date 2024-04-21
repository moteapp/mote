import { Emitter } from 'vs/base/common/event';
import { Disposable } from 'vs/base/common/lifecycle';
import { IConfigurationChangeEvent, IConfigurationService } from 'vs/platform/configuration/common/configuration';

export class NullCongirgutionService extends Disposable implements IConfigurationService {

    private readonly _onDidChangeConfiguration = this._register(new Emitter<IConfigurationChangeEvent>());
	public readonly onDidChangeConfiguration = this._onDidChangeConfiguration.event;


    getConfiguration() {
        return {};
    }
    getValue() {
        return {};
    }
    inspect() {
        return null;
    }
    keys() {
        return [];
    }
    reloadConfiguration() {
        return Promise.resolve();
    }
    setUserConfiguration() {
        return Promise.resolve();
    }
    updateValue() {
        return Promise.resolve();
    }
}
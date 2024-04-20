import { Event } from 'vs/base/common/event';
import { IUserDataProfile } from 'mote/platform/userDataProfile/common/userDataProfile';
import { createDecorator } from 'vs/platform/instantiation/common/instantiation';

export interface DidChangeUserDataProfileEvent {
	readonly previous: IUserDataProfile;
	readonly profile: IUserDataProfile;
	join(promise: Promise<void>): void;
}

export const IUserDataProfileService = createDecorator<IUserDataProfileService>('IUserDataProfileService');
export interface IUserDataProfileService {
	readonly _serviceBrand: undefined;
	readonly currentProfile: IUserDataProfile;
	readonly onDidChangeCurrentProfile: Event<DidChangeUserDataProfileEvent>;
	updateCurrentProfile(currentProfile: IUserDataProfile): Promise<void>;
	getShortName(profile: IUserDataProfile): string;
}
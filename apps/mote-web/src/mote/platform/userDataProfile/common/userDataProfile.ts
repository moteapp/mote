export interface IUserDataProfile {
	readonly id: string;
    readonly isDefault: boolean;
}

export function isUserDataProfile(thing: unknown): thing is IUserDataProfile {
    const candidate = thing as IUserDataProfile | undefined;

	return !!(candidate && typeof candidate === 'object'
		&& typeof candidate.id === 'string'
    );
}
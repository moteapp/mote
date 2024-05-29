export abstract class RemoteMessenger<LocalInterface, RemoteInterface> {
    public constructor(private channelId: string, private localInterface: LocalInterface|null) {}

    protected abstract postMessage(message: InternalMessage): void;
}

// Data that can be sent/received by a RemoteMessenger
export type SerializableData =
	number|boolean|string|undefined|null|SerializableData[]|{ readonly [key: string]: SerializableData };

export type CallbackIds = null|string|CallbackIds[]|Readonly<{
    [propertyName: string]: CallbackIds;
}>;

enum MessageType {
	RemoteReady = 'RemoteReady',
	InvokeMethod = 'InvokeMethod',
	ErrorResponse = 'ErrorResponse',
	ReturnValueResponse = 'ReturnValueResponse',
	CloseChannel = 'CloseChannel',
	OnCallbackDropped = 'OnCallbackDropped',
}

type InvokeMethodMessage = Readonly<{
	kind: MessageType.InvokeMethod;

	respondWithId: string;
	methodPath: string[];
	arguments: {
		serializable: SerializableData[];

		// Stores identifiers for callbacks within the normal `arguments`.
		// For example,
		// 	[{ foo: 'some-id-here' }, null, 'some-id-here-2']
		// means that the first argument has a property named "foo" that is a function
		// and the third argument is also a function.
		callbacks: CallbackIds[];
	};
}>;

type BaseMessage = Readonly<{
	channelId: string;
}>;

type InternalMessage = (InvokeMethodMessage) & BaseMessage;

import { RemoteMessenger, SerializableData } from "./remoteMessager";


export interface WebViewControl {
	// Evaluate the given [script] in the context of the page.
	// Unlike react-native-webview/WebView, this does not need to return true.
	injectJS(script: string): void;

	// message must be convertible to JSON
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Old code before rule was applied
	postMessage(message: any): void;
}


export class WebViewMessager<LocalInterface, RemoteInterface> extends RemoteMessenger<LocalInterface, RemoteInterface>{

    constructor(private webView: WebViewControl, channelId: string, localInterface: LocalInterface|null) {
        super(channelId, localInterface);
    }

    protected override postMessage(message: SerializableData): void {
		const webviewControl = this.webView;
		// This can happen just after the WebView unloads.
		if (!webviewControl) return;

		// This is the case in testing environments where no WebView is available.
		if (!webviewControl.injectJS) return;

		webviewControl.injectJS(`
			window.dispatchEvent(
				new MessageEvent(
					'message',
					{
						data: ${JSON.stringify(message)},
						origin: 'react-native'
					},
				),
			);
		`);
	}
}
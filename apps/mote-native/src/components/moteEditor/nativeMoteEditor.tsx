
const { shim } = require("mote/base/shim");
import { useCallback, useEffect, useRef } from "react";
import { NativeSyntheticEvent } from "react-native";
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { WebViewErrorEvent } from "react-native-webview/lib/WebViewTypes";

export interface INativeMoteEditorProps {

}

const html = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <style>
            body {
                height: 100%;
                min-width: 320px;
                min-height: 100vh;
            }
            #root {
                flex: 1;
                height: 100%;
            }
            .page-layout {
                --content-width: minmax(auto,708px);
                --margin-width: minmax(96px,1fr);
                display: grid;
                grid-template-columns: [full-start] var(--margin-left-width, var(--margin-width)) [content-start] var(--content-width) [content-end] var(--margin-right-width, var(--margin-width)) [full-end];
                width: 100%;
                padding-bottom: 30vh;
            }
            .layout-content {
                grid-column: content;
            }[contenteditable] {
                -webkit-tap-highlight-color: transparent
            }
            
            [contenteditable]:empty:after {
                content: attr(placeholder)
            }
            
            .selectable {
                max-width: 100%;
                width: 100%;
                white-space: pre-wrap;
                word-break: break-word;
                caret-color: rgb(55, 53, 47);
                padding-top: 3px;
                padding-left: 2px;
                padding-right: 2px;
                font-size: 1em;
                font-weight: inherit;
                margin: 0px;
                min-height: 1em;
                color: rgb(55, 53, 47);
                cursor: text;
            }
            
            .editable {
                max-width: 100%; 
                width: 100%; white-space: pre-wrap; 
                word-break: break-word; 
                caret-color: rgb(55, 53, 47); 
                padding: 3px 2px; min-height: 1em; 
                color: rgb(55, 53, 47); 
            }
            
            .page-content .selectable {
                margin-top: 1px;
                margin-bottom: 1px;
            }
        </style> 
    </head>
    <body>
        <div id="root"></div>
        <script>
            window.onerror = (message, source, lineno) => {
                window.ReactNativeWebView.postMessage(
                    "error: " + message + " in file://" + source + ", line " + lineno
                );
            };
            window.onunhandledrejection = (event) => {
                window.ReactNativeWebView.postMessage(
                    "error: Unhandled promise rejection: " + event
                );
            };
        </script>
    </body>
</html>
`

export const NativeMoteEditor = (props: INativeMoteEditorProps) => {

    const injectedJavaScript = `
        window.ReactNativeWebView.postMessage("start shim injected 111");
		if (!window.moteEditor) {
			// This variable is not used within this script
			// but is called using "injectJavaScript" from
			// the wrapper component.
			window.moteEditor = null;

            try {
                ${shim.injectedJs('moteEditorBundle')}
				const parentElement = document.getElementById('root');

				const moteEditor = window.createMoteEditor(parentElement, {});

                window.moteEditor = moteEditor;

                moteEditor.render("debug");

                window.ReactNativeWebView.postMessage("moteEditor created");
			} catch (e) {
				window.ReactNativeWebView.postMessage("error:" + e.message);
			}
		}
        true;
	`;

    const webviewRef = useRef<WebView>(null);

    useEffect(() => {
        if (webviewRef.current) {
           
        }
    }, [webviewRef.current]);

    const handleMessage = (e: WebViewMessageEvent) => {
        console.log('Message from webview:', e.nativeEvent.data);
    }

    const handleError = useCallback((event: WebViewErrorEvent) => {
        console.error('Error from webview:', event.nativeEvent);
    }, []);

    return (
        <WebView
            ref={webviewRef}
            source={{html: html}}
            injectedJavaScript={injectedJavaScript}
            webviewDebuggingEnabled={true}
            style={{flex: 1}}
            onMessage={handleMessage}
            onError={handleError}
        />
    )
}
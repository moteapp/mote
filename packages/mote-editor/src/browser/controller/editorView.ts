import * as platform from '@mote/base/common/platform';
import * as browser from '@mote/base/browser/browser';

import { ContentEditableInput, ContentEditableWrapper } from "./contentEditableInput";
import { EditorState } from "./editorState";

export interface IEditorViewOptions {
    state: EditorState;
}

export class EditorView {

    private dom: HTMLElement;

    private readonly: boolean = false;
    private input: ContentEditableInput;

    constructor(
        private parent: HTMLElement,
    ) {

        this.dom = document.createElement("div");
        parent.appendChild(this.dom);

        const wrapper = new ContentEditableWrapper(this.dom);
        this.input = new ContentEditableInput(wrapper, platform.OS, {
			isAndroid: browser.isAndroid,
			isChrome: browser.isChrome,
			isFirefox: browser.isFirefox,
			isSafari: browser.isSafari,
		});
    }

    public getDOMNode() {
        return this.dom;
    }
}
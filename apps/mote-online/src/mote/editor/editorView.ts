import { FastDomNode, createFastDomNode } from '@mote/base/browser/fastDomNode';
import * as platform from '@mote/base/common/platform';
import * as browser from '@mote/base/browser/browser';
import { Disposable, IDisposable } from '@mote/base/common/lifecycle';
import { BlockModel } from '@mote/editor/common/model/blockModel';
import { ContentEditableInput, ContentEditableWrapper } from './controller/contentEditableInput';

export interface IEditorViewOptions {
    placeholder?: string;
}

export class EditorView extends Disposable {

    private domNode: FastDomNode<HTMLElement>;

    private input: ContentEditableInput;

    private readonly listenersToRemove: IDisposable[] = [];

    constructor(
        private parent: HTMLElement,
        private options: IEditorViewOptions,
    ) {
        super();

        this.domNode = createFastDomNode(document.createElement('div'));
        this.domNode.setAttribute('contenteditable', 'true');
        this.domNode.setClassName('layout-content page-content');
        this.domNode.setAttribute('placeholder', options.placeholder || '');

        const wrapper = new ContentEditableWrapper(this.getDOMNode());
        this.input = new ContentEditableInput(wrapper, platform.OS, {
			isAndroid: browser.isAndroid,
			isChrome: browser.isChrome,
			isFirefox: browser.isFirefox,
			isSafari: browser.isSafari,
		});
    }

    public attachModel(model: BlockModel) {
        this.input.onType((e) => {
            console.log('type', e);
        });
    }

    public getDOMNode() {
        return this.domNode.domNode;
    }
}
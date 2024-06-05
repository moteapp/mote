
import * as platform from '@mote/base/common/platform';
import * as browser from '@mote/base/browser/browser';
import { ContentEditableInput, ContentEditableWrapper } from './contentEditableInput';
import { RecordModel } from '@mote/editor/common/model/recordModel';
import { ISegment, getTextFromSegments } from '@mote/editor/common/recordCommon';

export interface ITextBasedOptions {
    placeholder?: string;
}

export class TextEditable {

    private input: ContentEditableInput;
    
    constructor(
        private editable: HTMLElement,
        private options: ITextBasedOptions,
    ) {

        editable.setAttribute('contenteditable', 'true');
        editable.className = 'editable';

        if (options.placeholder) {
            editable.setAttribute('placeholder', options.placeholder);
        }

        const wrapper = new ContentEditableWrapper(editable);
        this.input = new ContentEditableInput(wrapper, platform.OS, {
			isAndroid: browser.isAndroid,
			isChrome: browser.isChrome,
			isFirefox: browser.isFirefox,
			isSafari: browser.isSafari,
		});
        this.registerListeners();
    }

    private registerListeners(): void {
        this.input.onType((e) => {
            console.log('type', e);
        });
    }

    public getDOMNode() {
        return this.editable;
    }

    public attachModel(model: RecordModel<ISegment[]>) {
        const content = getTextFromSegments(model.value);
        this.input.setValue(content);
        this.editable.setAttribute('data-block-id', model.id);
    }

    public dispose(): void {
        this.input.dispose();
    }
}
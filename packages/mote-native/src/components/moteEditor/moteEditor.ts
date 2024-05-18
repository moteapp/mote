import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { MoteEditorWidget } from '@mote/editor/browser/widget/moteEditorWidget';
import { BlockModel } from '@mote/editor/common/model/blockModel';
import { IRecordService } from '@mote/editor/common/services/record';


interface MoteEditorProps {
    parent: HTMLElement;
    model: BlockModel;
    recordService: IRecordService;
}

export class MoteEditor {

    private root: Root;

    constructor(
        private parent: HTMLElement,
        private recordService: IRecordService
    ) {
        this.root = createRoot(this.parent);
    }

    render(model: BlockModel) {
        this.root.render(React.createElement(MoteEditorWidget, {
			model,
			recordService: this.recordService
		}));
    }
}
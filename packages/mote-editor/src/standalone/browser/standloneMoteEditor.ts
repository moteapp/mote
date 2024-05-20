import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { IRecordService } from "@mote/editor/common/services/record";
import { BlockModel } from '@mote/editor/common/model/blockModel';
import { MoteEditorWidget } from '@mote/editor/browser/widget/moteEditorWidget';

export interface IStandaloneEditorConstructionOptions {

}

export interface IStandaloneMoteEditor {

}

export class StandaloneEditor implements IStandaloneMoteEditor {

    private root: Root;

    constructor(
        private parent: HTMLElement,
        options: Readonly<IStandaloneEditorConstructionOptions> | undefined,
        @IRecordService private recordService: IRecordService
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
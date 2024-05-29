import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { IRecordService } from "@mote/editor/common/services/record";
import { BlockModel } from '@mote/editor/common/model/blockModel';
import { MoteEditorWidget } from '@mote/editor/browser/widget/moteEditorWidget';
import { IRecordProvider } from '@mote/editor/common/recordCommon';
import { URI } from 'vs/base/common/uri';

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

    render(id: string) {
        const resource = URI.from({scheme: 'record', authority: 'block', path: '/'+id})
        const recordProvider: IRecordProvider = {
            provideRecord: (uri: URI) => { 
                return this.recordService.getRecord(uri)!;
            }
        };
        const model = new BlockModel(resource, recordProvider);
        this.root.render(React.createElement(MoteEditorWidget, {
			model,
			recordService: this.recordService
		}));
    }
}
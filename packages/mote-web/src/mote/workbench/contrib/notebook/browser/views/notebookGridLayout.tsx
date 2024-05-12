import * as DOM from 'vs/base/browser/dom';
import { MarkupCellRenderer } from './renderers/cellRenderers';
import { MarkupCell } from './cellParts/markupCell';
import { IActiveNotebookEditorDelegate } from '../notebookBrowser';
import { useEffect, useRef } from 'react';
import { MarkupCellViewModel } from '../viewModel/markupCellViewModel';
import { NotebookHead } from './notebookHead';

import './media/notebookLayout.css';
import { SpaceModel } from 'mote/editor/common/model/spaceModel';
import { BlockModel } from 'mote/editor/common/model/blockModel';
import { ViewModel } from 'mote/editor/common/viewModel/viewModel';
import { ICommandDelegate } from 'mote/editor/browser/view/viewController';
import { ViewController } from 'mote/editor/browser/view/viewController';
import { IRecordService } from 'mote/editor/common/services/record';
import { IPointer, IRecordProvider, ISegment } from 'mote/editor/common/recordCommon';
import { URI } from 'vs/base/common/uri';
import { RecordModel } from 'mote/editor/common/model/recordModel';
import { Document } from './document';

interface NotebookGirdLayoutProps {
    model: BlockModel;
    notebookEditor: IActiveNotebookEditorDelegate;
    recordService: IRecordService;
}

export const NotebookGirdLayout = (props: NotebookGirdLayoutProps) => {

    const { recordService } = props;
    
    const pageModel = props.model;

    const viewModel = new ViewModel(pageModel, recordService);
    const commandDelegate: ICommandDelegate = {
        type: (text: string, model: RecordModel<ISegment[]>) => viewModel.type(text, model),
        lineBreak: (model: RecordModel<ISegment[]>) => viewModel.lineBreak(model),
    } as any;

    const viewController = new ViewController(commandDelegate);

    return (
        <div className='notebook-layout'>
            <div></div>
            <NotebookHead
                viewController={viewController}
                model={pageModel.getTitleModel()}
            />
            <Document model={pageModel} viewController={viewController}/>
        </div>
    )
}
import * as DOM from 'vs/base/browser/dom';
import { MarkupCellRenderer } from './renderers/cellRenderers';
import { MarkupCell } from './cellParts/markupCell';
import { IActiveNotebookEditorDelegate } from '../notebookBrowser';
import { useEffect, useRef } from 'react';
import { MarkupCellViewModel } from '../viewModel/markupCellViewModel';
import { NotebookTitle } from './notebookTitle';

interface NotebookGirdLayoutProps {
    markUpCellRenderer: MarkupCellRenderer;
    notebookEditor: IActiveNotebookEditorDelegate;
    cells: any[];
}

interface MarkupCellContainerProps {
    viewCell: MarkupCellViewModel;
    markUpCellRenderer: MarkupCellRenderer;
    notebookEditor: IActiveNotebookEditorDelegate;
}

const MarkupCellContainer = (props: MarkupCellContainerProps) => {
    const containerEl = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerEl) {
            const template = props.markUpCellRenderer.renderTemplate(containerEl.current!);
            template.instantiationService.createInstance(MarkupCell, props.viewCell, template, props.notebookEditor)
        }
    }, [containerEl])

    return (
        <div ref={containerEl}></div>
    )
}

export const NotebookGirdLayout = (props: NotebookGirdLayoutProps) => {

    const renderCell = (cell:any,) => {
       return (
            <MarkupCellContainer key={cell.uri} viewCell={cell} markUpCellRenderer={props.markUpCellRenderer} notebookEditor={props.notebookEditor}/>
        )
    }

    return (
        <div>
            <NotebookTitle />
            {props.cells.map(cell => renderCell(cell))}
        </div>
    )
}
import { MonacoEditor } from 'mote/editor/browser/monacoEditor';
import { useState } from 'react';
import { IHoverService } from 'vs/platform/hover/browser/hover';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';

interface MoteEditorProps {
    height: number;
    width: number;
    hoverService: IHoverService
}

interface CellState {
    value: string;
}

export const MoteEditor = (props: MoteEditorProps) => {
    const [cells, setCells] = useState<CellState[]>([{value: ''}]);


    const renderCellList = () => {
        return cells.map((cell, index) => {
            return (
                <MonacoEditor key={index} width={props.width}/>
            );
        });
    }

    return (
        <div>
            {renderCellList()}
        </div>
    );
}
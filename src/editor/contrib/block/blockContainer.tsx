import './block.css';
import { ReactNode } from "react";
import { match } from 'ts-pattern';
import { useModelChanges } from 'mote/app/hooks/use-model';
import { IBlockComponentProps } from "mote/editor/browser/blockComponent";
import { isLayoutBlock, isTextBlock, ITextBlock } from "mote/editor/common/blockCommon";
import { DropType, SelectType } from "mote/editor/common/editorCommon";
import { BlockModel } from "mote/editor/common/model/blockModel";
import { DragTarget } from "../dnd/dropTarget";
import { ListChildren } from "../list/listChildren";
import { SelectionTarget } from "../selection/selectionTarget";
import { TextBlock } from "./textBlock";

export type BlockContainerProps = Omit<IBlockComponentProps, 'block'> & {
    blockModel: BlockModel;
};

export function BlockContainer({rootId, blockModel, ...restProps}: BlockContainerProps) {
    useModelChanges(blockModel);
    if (!blockModel.value) {
        return null;
    }
    const id = blockModel.id;
    const clxName = ['block', blockModel.className];

    let canSelect = true;
    const canDrop = true;
    let renderChildren = false;
    let object: ReactNode;
    let blockComponent: ReactNode;

    match(blockModel.value)
    .when(isTextBlock, (block) => {
        blockComponent = <TextBlock rootId={rootId} blockModel={blockModel} {...restProps}/>;
    })
    .when(isLayoutBlock, (block) => {
        canSelect = false;
        renderChildren = true;
    })
    .run();

    if (canDrop) {
        object = (
            <DragTarget rootId={rootId!} id={id} dropType={DropType.Block}>
                {blockComponent}
            </DragTarget>
        );
    } else {
        object = <div className="dropTarget">{blockComponent}</div>;
    }

    if (canSelect) {
        object = (
            <SelectionTarget id={id} type={SelectType.Block}>
                {object}
            </SelectionTarget>
        );
    } else {
        object = (
            <div id={`selectionTarget-${id}`} className="selectionTarget">
                {object}
            </div>
        );
    }

    return (
        <div 
            id={`block-${id}`} 
            className={clxName.join(' ')}
        >
            <div className="wrapMenu">

            </div>
            <div className="wrapContent">
                {object}
                {renderChildren && <ListChildren rootId={rootId} blockModel={blockModel} {...restProps} />}
            </div>
        </div>
    );
}
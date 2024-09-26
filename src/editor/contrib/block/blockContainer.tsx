import { ReactNode } from "react";
import { selectBlock } from "mote/app/store/features/block/blockSlice";
import { useAppSelector } from "mote/app/store/hooks";
import { getBlockClassName, IBlockComponentProps, isLayoutBlock, isTextBlock } from "mote/editor/common/blockCommon";
import { DropType, SelectType } from "mote/editor/common/editorCommon";
import { DragTarget } from "../dnd/dropTarget";
import { ListChildren } from "../list/listChildren";
import { SelectionTarget } from "../selection/selectionTarget";
import { TextBlock } from "./textBlock";

export type BlockContainerProps = IBlockComponentProps & {
    id: string;
};

export function BlockContainer({rootId, id}: BlockContainerProps) {
    const { block, role } = useAppSelector((state) => selectBlock(state, id));

    const clxName = ['block', getBlockClassName(block)];

    let canSelect = true;
    const canDrop = true;
    let renderChildren = false;
    let object: ReactNode;
    let blockComponent: ReactNode;

    if (isTextBlock(block)) {
        blockComponent = <TextBlock />;
    } else if (isLayoutBlock(block)) {
        canSelect = false;
        renderChildren = true;
    }

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
                {renderChildren && <ListChildren rootId={rootId} block={block} />}
            </div>
        </div>
    );
}
import { IBlock, isTextToggle } from "mote/editor/common/blockCommon";
import { BlockContainer } from "../block/blockContainer";
import { BlockModel } from "mote/editor/common/model/blockModel";
import { IBlockComponentProps } from "mote/editor/browser/blockComponent";

export type ListChildrenProps = IBlockComponentProps & {
    blockModel: BlockModel;
}

export function ListChildren({rootId, blockModel, viewController}: ListChildrenProps) {
    const cn = ['children', isTextToggle(blockModel.value) ? 'canToggle' : ''];
    const children = blockModel.getChildrenModels() || [];

    return (
        <div 
            id={`block-children-${blockModel.id}`} 
            className={cn.join(' ')}
        >
            {children.map((child, idx) => {
                const className = idx === 0 ? 'isFirst' : '';
                return (
                    <BlockContainer
                        key={child.id} 
                        className={className} 
                        viewController={viewController}
                        rootId={rootId} id={child.id} 
                        blockModel={child}
                    />
                );
            })}
        </div>
    );
}
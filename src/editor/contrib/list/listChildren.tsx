import { IBlock, IBlockComponentProps, isTextToggle } from "mote/editor/common/blockCommon";
import { BlockContainer } from "../block/blockContainer";

export type ListChildrenProps = IBlockComponentProps & {
    block: IBlock;
}

export function ListChildren({rootId, block}: ListChildrenProps) {
    const cn = ['children', isTextToggle(block) ? 'canToggle' : ''];
    const children = block.children || [];

    return (
        <div 
            id={`block-children-${block.id}`} 
            className={cn.join(' ')}
        >
            {children.map((child, idx) => {
                const className = idx === 0 ? 'isFirst' : '';
                return <BlockContainer className={className} key={child.id} rootId={rootId} id={child.id} />
            })}
        </div>
    );
}
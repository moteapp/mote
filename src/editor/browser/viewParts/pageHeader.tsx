'use client';
import { findLayoutHeader, IBlockComponentProps } from "mote/editor/common/blockCommon";
import { BlockContainer } from "mote/editor/contrib/block/blockContainer";

export type PageHeaderProps = IBlockComponentProps &{
    onKeyDown?: any;
};


export function PageHeader({rootId, block, ...blockProps}: PageHeaderProps) {
    // find the header block from the root block, we can't just pass the header block directly
    // since it's content is not fully loaded yet
    const headerBlock = findLayoutHeader(block!);
    return (
        <div className="pageHeader">
            <div id="editorSize" className="dragWrap"></div>
            <BlockContainer rootId={rootId} id={headerBlock!.id} {...blockProps}/>
        </div>
    );

}
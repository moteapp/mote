import { BlockModel } from "mote/editor/common/model/blockModel";
import { BlockContainer } from "mote/editor/contrib/block/blockContainer";
import { IBlockComponentProps } from "../blockComponent";

export type PageHeaderProps = IBlockComponentProps &{
    onKeyDown?: any;
    blockModel: BlockModel;
};


export function PageHeader({rootId, blockModel, ...blockProps}: PageHeaderProps) {
    // find the header block from the root block, we can't just pass the header block directly
    // since it's content is not fully loaded yet
    const headerModel = blockModel.getLayoutHeaderModel();
    if (!headerModel) {
        return null;
    }
    return (
        <div className="pageHeader">
            <div id="editorSize" className="dragWrap"></div>
            <BlockContainer rootId={rootId} blockModel={headerModel} {...blockProps}/>
        </div>
    );

}
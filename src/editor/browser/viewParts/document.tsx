import { IBlockComponentProps } from "mote/editor/browser/blockComponent";
import { BlockModel } from "mote/editor/common/model/blockModel";
import { BlockContainer } from "mote/editor/contrib/block/blockContainer";

export type IDocumentProps = IBlockComponentProps & {
    blockModel: BlockModel;
};

export const Document = (props: IDocumentProps) => {
    const { rootId, blockModel, viewController } = props;
    const parent = blockModel.getChildrenModel();
    const children = blockModel.getChildrenModels().filter((child) => !child.isLayoutHeader());
    return (
        <>
            {children.map((child) => (
                <BlockContainer key={`block-${child.id}`} rootId={rootId} blockModel={child} viewController={viewController} />
            ))}
        </>
    );
}
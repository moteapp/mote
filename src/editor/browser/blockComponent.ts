import { IBlock } from "../common/blockCommon";
import { BlockModel } from "../common/model/blockModel";
import { ViewController } from "./view/viewController";

/**
 * The common properties of a block component.
 */
export type IBlockComponentProps = {
    id?: string;
    rootId: string;
    block?: IBlock;
    className?: string;
    blockModel?: BlockModel;
    viewController: ViewController;
}
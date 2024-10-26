import { useEffect, useState } from "react";
import { BlockModel } from "../common/model/blockModel";
import { BlockStore } from "../common/model/blockStore";
import { ViewController } from "./view/viewController";
import { Document } from "./viewParts/document";
import { PageHeader } from "./viewParts/pageHeader";

export type EditorViewProps = {
    rootId: string;
    userId: string;
};

export function EditorView({rootId, userId}: EditorViewProps) {
    const viewController = new ViewController(userId, BlockStore.Default);
    const [blockModel, setBlockModel] = useState<BlockModel | null>(null);

    useEffect(() => {
        // Make sure block model is created on the client side since we need access the local storage
        // Todo: we should move this to the server side by fetching the block model from the server
        const pointer = {id: rootId, table: 'block'};
        const blockModel = new BlockModel(pointer, BlockStore.Default);
        blockModel.setRootModel(blockModel);
        setBlockModel(blockModel);
    }, []);
    return (
        <div
            id="editorWrapper"
            className="editorWrapper"
        >
            <div id={`editor-${rootId}`} className="editor">
                <div className="blocks">
                    {blockModel && (
                        <>
                        <PageHeader
                            rootId={rootId}
                            blockModel={blockModel}
                            viewController={viewController}
                        />
                        <Document
                            rootId={rootId}
                            blockModel={blockModel}
                            viewController={viewController}
                        />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}   
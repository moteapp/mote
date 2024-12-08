'use client';
import { useEffect, useState } from "react";
import { IRecordService } from "mote/platform/record/common/record";
import { instantiationService } from "mote/workbench/workbench.client.main";
import { BlockModel } from "../common/model/blockModel";
import { ViewController } from "./view/viewController";
import { Document } from "./viewParts/document";
import { PageHeader } from "./viewParts/pageHeader";

export type EditorViewProps = {
    rootId: string;
    userId: string;
};

export function EditorView({rootId, userId}: EditorViewProps) {
   
    const viewController = instantiationService.createInstance(ViewController, userId);

    const [blockModel, setBlockModel] = useState<BlockModel | null>(null);

    useEffect(() => {
        instantiationService.invokeFunction((accessor) => {
            console.log('initialize editor view');
            const recordService = accessor.get(IRecordService);
            // Make sure block model is created on the client side since we need access the local storage
            // Todo: we should move this to the server side by fetching the block model from the server
            const pointer = {id: rootId, table: 'block'};
            const blockModel = new BlockModel(pointer, recordService);
            blockModel.setRootModel(blockModel);
            setBlockModel(blockModel);
        });
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
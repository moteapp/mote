'use client';
import { selectBlock } from "mote/app/store/features/block/blockSlice";
import { useAppSelector } from "mote/app/store/hooks";
import { PageHeader } from "./viewParts/pageHeader";

export type EditorViewProps = {
    rootId: string;
    userId: string;
};

export function EditorView({rootId, userId}: EditorViewProps) {
    const blockAndRole = useAppSelector((state) => selectBlock(state, rootId));

    if (!blockAndRole) {
        return null;
    }
    return (
        <div
            id="editorWrapper"
            className="editorWrapper"
        >
            <div id={`editor-${rootId}`} className="editor">
                <div className="blocks">
                    <PageHeader
                        rootId={rootId}
                        block={blockAndRole.block}
                    />
                </div>
            </div>
        </div>
    )
}   
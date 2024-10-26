'use client';
import { EditorView } from "mote/editor/browser/editorView";
import { BlockModel } from "mote/editor/common/model/blockModel";
import { BlockStore } from "mote/editor/common/model/blockStore";

export default function DocPage({ params }: { params: { id: string } }) {
    return <EditorView rootId={params.id} userId="user" />;
}
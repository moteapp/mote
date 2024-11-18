import { EditorView } from "mote/editor/browser/editorView";

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
    const userId = "user";
    const { id } = await params;
    return <EditorView rootId={id} userId="user" />;
}
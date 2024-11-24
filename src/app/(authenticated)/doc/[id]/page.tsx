import { EditorView } from "mote/editor/browser/editorView";

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
    const userId = "43c5d10b-6bdf-459b-8544-5afc65a9947d";
    const { id } = await params;
    return <EditorView rootId={id} userId={userId} />;
}
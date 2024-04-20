import Editor from '@monaco-editor/react';

interface MoteEditorProps {
    height: number;
    width: number;
}

export const MoteEditor = (props: MoteEditorProps) => {
    return (
        <div>
            <Editor height={props.height} width={props.width} defaultLanguage="plaintext" defaultValue="// some comment" />;
        </div>
    );
}
import Editor from '@monaco-editor/react';

export const MoteEditor = () => {
    return (
        <div>
            <Editor height="90vh" width={"900px"} defaultLanguage="plaintext" defaultValue="// some comment" />;
        </div>
    );
}
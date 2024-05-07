import { useState } from 'react';

import { TextEditor } from "mote/editor/browser/controller/textEditor"


import './editor.css'

export const EditorPart = () => {
    const [text, setText] = useState<string>('');

    const handleChange = () => {
        
    }

    return (
        <div className="editor-container">
            <TextEditor initialText={text} />
        </div>
    )
}
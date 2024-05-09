import { useState } from 'react';

import { TextEditor } from "mote/editor/browser/controller/textEditor"


import './editor.css'
import { EditorHead } from './editorHead';

export const EditorPart = () => {
    const [text, setText] = useState<string>('');

    const handleChange = () => {
        
    }

    return (
        <div className="editor-container">
            <div></div>
            <EditorHead />
        </div>
    )
}
import * as React from 'react';
import { useRef, useState, useEffect } from 'react';

interface TextEditorProps {
    initialText: string;
    handleChange: (text: string) => void;
}

export const TextEditor = (props: TextEditorProps) => {
    const containerEl = useRef<HTMLDivElement | null>(null);

    const handleChange = (e: React.FormEvent<HTMLDivElement>) => {
        console.log(e.target);
    }

    useEffect(() => {
        if (containerEl.current) {
        }
    });

    return (
        <div 
            contentEditable 
            ref={containerEl}
            onChange={handleChange}
            dangerouslySetInnerHTML={{__html: props.initialText}}
        />
    )
}
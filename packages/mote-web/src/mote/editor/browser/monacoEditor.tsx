import { useEffect, useRef, useState } from 'react';
import { IHoverService } from 'vs/platform/hover/browser/hover';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';

interface MonacoEditorProps {
	hoverService: IHoverService
}

export const MonacoEditor = (props: MonacoEditorProps) => {
	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);

	useEffect(() => {
		if (monacoEl) {
				/*
				setEditor((editor) => {
				
					if (editor) return editor;
	
					return monacoApi.editor.create(monacoEl.current!, {
						value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
						language: 'typescript'
					}, {
						'hoverService': props.hoverService
					});
				});
				*/
	
		}

		return () => editor?.dispose();
	}, [monacoEl.current]);

	return <div ref={monacoEl}></div>;
};
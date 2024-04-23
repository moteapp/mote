import { useEffect, useRef, useState } from 'react';
import { IHoverService } from 'vs/platform/hover/browser/hover';
import * as monaco from 'vs/editor/editor.api';
import { IInstantiationService, ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { IStandaloneCodeEditor, IStandaloneEditorConstructionOptions } from 'vs/editor/standalone/browser/standaloneCodeEditor';
import { instantiationService } from 'mote/workbench/browser/web.main';
import { StandaloneEditor } from '../standalone/browser/standaloneCodeEditor';
import editorWorker from 'vs/editor/editor.worker?worker';

self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		return new editorWorker();
	}
}

interface MonacoEditorProps {
	//height: number;
    width: number;
}

var jsCode = [
	'"use strict";',
	"function Person(age) {",
	"	if (age) {",
	"		this.age = age;",
	"	}",
	"}",
	"Person.prototype.getAge = function () {",
	"	return this.age;",
	"};",
].join("\n");

export const MonacoEditor = (props: MonacoEditorProps) => {
	const [height, setHeight] = useState(55);
	const [editor, setEditor] = useState<IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);

	useEffect(() => {
		if (monacoEl) {
			setEditor((editor) => {
			
				if (editor) return editor;
				
				const options: IStandaloneEditorConstructionOptions = {
					value: jsCode,
					language: 'typescript',
					minimap: { enabled: false },
				}
				return instantiationService.createInstance(StandaloneEditor, monacoEl.current!, options);
			});
		}

		return () => editor?.dispose();
	}, [monacoEl.current]);

	useEffect(() => {
		if (editor) {
			setHeight(editor.getModel()!.getLineCount()*25);
			editor.addCommand(monaco.KeyCode.Enter, () => {
				console.log('catch enter')
			});
			var decorations = editor.createDecorationsCollection([
				{
					range: new monaco.Range(3, 1, 5, 1),
					options: {
						isWholeLine: true,
						linesDecorationsClassName: "myLineDecoration",
						description: "My description"
					},
				},
				{
					range: new monaco.Range(7, 1, 7, 24),
					options: { 
						inlineClassName: "myInlineDecoration",
						description: "My description"
					},
					
				},
			]);
		}
	}, [editor]);

	return <div ref={monacoEl} style={{height: height, width: props.width}}></div>
};
import BundledFile from "./bundledFile";

import { dirname } from 'path';

export const projectDir = dirname(dirname(__dirname));
console.log('projectDir:', projectDir);

const moteEditorBundle = new BundledFile(
	'moteEditorBundle',
	`${projectDir}/components/NoteEditor/CodeMirror/CodeMirror.ts`,
);

const gulpTasks = {
    buildMoteEditor: {
		fn: () => moteEditorBundle.build(),
	},
}


export default gulpTasks;
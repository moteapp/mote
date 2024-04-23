//import editorWorker from 'vs/editor/editor.worker?worker';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

self.MonacoEnvironment = {
    getWorker: (moduleId: string, label: string) => {
        console.log('getWorker', moduleId, label)
        return new editorWorker();
    }
}
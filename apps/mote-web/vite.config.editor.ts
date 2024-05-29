import { defineConfig } from 'vite';
import viteConfig from './vite.config';

export default defineConfig({
    ...viteConfig,
    build: {
        lib: {
            entry: './src/mote/workbench/contrib/notebook/browser/views/notebookGridLayout.tsx',
            name: 'MoteEditor',
            fileName: (format) => `mote-editor.${format}.js`
        }
    }
});
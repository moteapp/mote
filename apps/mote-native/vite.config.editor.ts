import { defineConfig } from 'vite';
//import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    process: {
      env: {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }
  },
  build: {
    minify: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: './src/components/moteEditor/createMoteEditor.ts',
      name: 'createMoteEditor',
      // the proper extensions will be added
      fileName: 'createMoteEditor',
    }
  }
})

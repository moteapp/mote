import util from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { environment } from 'mote/common/enviroment.js';
import { Context, Next } from 'koa';
import { readManifestFile } from 'mote/utils/manifest.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const viteHost = 'http://localhost:5173';
const entry = "src/main.tsx";

const readFile = util.promisify(fs.readFile);

let indexHtmlCache: Buffer | undefined;

const readIndexFile = async (): Promise<Buffer> => {
    if (environment.isProduction || environment.isTest) {
        if (indexHtmlCache) {
            return indexHtmlCache;
        }
    }

    if (environment.isTest) {
        return await readFile(path.join(__dirname, "../static/index.html"));
    }

    return (indexHtmlCache = await readFile(
        path.join(__dirname, "../../mote-online/index.html")
    ));
};

export const renderApp = async (
    ctx: Context,
    next: Next,
    options: {

    } = {}
) => {

    const page = await readIndexFile();

    const scriptTags = environment.isProduction 
        ? `<script type="module" nonce="${ctx.state.cspNonce}" src="/static/${readManifestFile()[entry]["file"]}"></script>`
        : `<script type="module" nonce="${ctx.state.cspNonce}">
            import RefreshRuntime from "${viteHost}/static/@react-refresh"
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => { }
            window.$RefreshSig$ = () => (type) => type
            window.__vite_plugin_react_preamble_installed__ = true
        </script>
        <script type="module" nonce="${ctx.state.cspNonce}" src="${viteHost}/static/@vite/client"></script>
        <script type="module" nonce="${ctx.state.cspNonce}" src="${viteHost}/static/${entry}"></script>
    `;
    ctx.body = page.toString()
        .replace(/\{script-tags\}/g, scriptTags);

}
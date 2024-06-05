import Koa, { BaseContext } from 'koa';
import Router from '@koa/router';
import send from 'koa-send';
import path from 'path';
import { fileURLToPath } from 'url';
import { userAgent, UserAgentContext } from 'koa-useragent';
import { renderApp } from './app.js';
import { ConsoleLogger } from '@mote/platform/log/common/log';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const koaRoute = new Koa();
const router = new Router();

koaRoute.use<BaseContext, UserAgentContext>(userAgent);

// serve public assets
router.use(["/images/(.*)", "/email/(.*)", "/fonts/(.*)"], async (ctx, next) => {
    const logger = new ConsoleLogger();
    let done;
    if (ctx.method === "HEAD" || ctx.method === "GET") {
        try {
            done = await send(ctx, ctx.path, {
                root: path.resolve(__dirname, "../public"),
                // 7 day expiry, these assets are mostly static but do not contain a hash
                maxAge: 7 * 24 * 60 * 60 * 1000,
                setHeaders: (res) => {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                },
            });
        } catch (err) {
            logger.error(err);
            if (err.status !== 404) {
                throw err;
            }
        }
    }
    
    if (!done) {
        await next();
    }
});

// catch all for application
router.get('(.*)', async (ctx, next) => {
    return renderApp(ctx, next, {});
});

koaRoute.use(router.routes());
import Koa, { BaseContext } from 'koa';
import Router from '@koa/router';
import send from 'koa-send';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { userAgent, UserAgentContext } from 'koa-useragent';
import compress from 'koa-compress';
import { renderApp } from './app.js';
import { ConsoleLogger } from '@mote/platform/log/common/log';
import { supportedLanguages } from '@mote/base/common/i18n/i18n';
import { formatRFC7231 } from 'date-fns';
import { environment } from 'mote/common/enviroment.js';
import { NotFoundError } from 'mote/common/errors.js';

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

if (environment.isProduction) {
    router.get("/static/(.*)", async (ctx) => {
        try {
            const pathname = ctx.path.substring(8);
            if (!pathname) {
              throw NotFoundError();
            }

            await send(ctx, pathname, {
                root: path.join(__dirname, "../../mote-online/"),
                // Hashed static assets get 1 year expiry plus immutable flag
                maxAge: 365 * 24 * 60 * 60 * 1000,
                immutable: true,
                setHeaders: (res) => {
                  res.setHeader("Service-Worker-Allowed", "/");
                  res.setHeader("Access-Control-Allow-Origin", "*");
                },
            });
        } catch (err) {
            if (err.status === 404) {
                // Serve a bad request instead of not found if the file doesn't exist
                // This prevents CDN's from caching the response, allowing them to continue
                // serving old file versions
                ctx.status = 400;
                return;
            }
            throw err;
        }
    });
}

router.use(compress());

router.get("/locales/:lng.json", async (ctx) => {
    const { lng } = ctx.params;
  
    if (!supportedLanguages.includes(lng)) {
      ctx.status = 404;
      return;
    }
  
    await send(ctx, path.join(lng, "translation.json"), {
        setHeaders: (res, _, stats) => {
            res.setHeader("Last-Modified", formatRFC7231(stats.mtime));
            res.setHeader("Cache-Control", `public, max-age=${7 * 24 * 60 * 60}`);
            res.setHeader(
            "ETag",
            crypto.createHash("md5").update(stats.mtime.toISOString()).digest("hex")
            );
        },
        root: path.join(__dirname, "../public/i18n/locales"),
    });
});

// catch all for application
router.get('(.*)', async (ctx, next) => {
    return renderApp(ctx, next, {});
});

koaRoute.use(router.routes());
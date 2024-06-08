import Koa from 'koa';
import { Server } from 'http';
import mount from 'koa-mount';
import crypto from 'crypto';
import { koaRoute } from 'mote/routes/routes.js';
import koahelmet from 'koa-helmet';
import { environment } from 'mote/common/enviroment.js';
import { authApp } from 'mote/routes/auth/authRoute.js';
import { ConsoleLogger } from '@mote/platform/log/common/log';
import { apiApp } from 'mote/routes/api/apiRoute.js';

const { contentSecurityPolicy, dnsPrefetchControl, referrerPolicy } = koahelmet;

// Construct scripts CSP based on services in use by this installation
const defaultSrc = ["'self'"];
const scriptSrc = [
  "'self'",
  "gist.github.com",
  "www.googletagmanager.com",
  "gitlab.com",
];

const styleSrc = [
  "'self'",
  "'unsafe-inline'",
  "github.githubassets.com",
  "gitlab.com",
];

// Allow to load assets from Vite
if (!environment.isProduction) {
    //scriptSrc.push(env.URL.replace(`:${env.PORT}`, ":3001"));
    scriptSrc.push("localhost:5173");
}

const logger = new ConsoleLogger();

export function initializeWeb(app: Koa = new Koa(), server?: Server) {

    app.use(mount("/auth", authApp));
    app.use(mount("/api", apiApp));

    app.use((ctx, next) => {
        ctx.state.cspNonce = crypto.randomBytes(16).toString("hex");

        return contentSecurityPolicy({
            directives: {
                defaultSrc,
                styleSrc,
                scriptSrc: [
                    ...scriptSrc,
                    environment.DEVELOPMENT_UNSAFE_INLINE_CSP
                        ? "'unsafe-inline'"
                        : `'nonce-${ctx.state.cspNonce}'`,
                ],
                mediaSrc: ["*", "data:", "blob:"],
                imgSrc: ["*", "data:", "blob:"],
                frameSrc: ["*", "data:"],
                // Do not use connect-src: because self + websockets does not work in
                // Safari, ref: https://bugs.webkit.org/show_bug.cgi?id=201591
                connectSrc: ["*"]
            },
        })(ctx, next);;
    });

    // Allow DNS prefetching for performance, we do not care about leaking requests
    // to our own CDN's
    app.use(
        dnsPrefetchControl({
            allow: true,
        })
    );
    app.use(
        referrerPolicy({
          policy: "no-referrer",
        })
    );

    // IMPORANT: This must be the last middleware added
    app.use(mount(koaRoute));

    return app;
}
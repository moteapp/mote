//import throng from 'throng';
import koa from 'koa';
import Router from 'koa-router';
import KoaLogger from 'koa-logger';
import koaHelmet from 'koa-helmet';
import stoppable from 'stoppable';
import throng from 'throng';
import http from 'http';
import { AddressInfo } from 'net';
import { Shutdown, ShutdownOrder } from './utils/shutdown.js';
import { toBeInitialized } from './apps/index.js';
import { environment } from './common/enviroment.js';
import { ConsoleLogger } from '@mote/platform/log/common/log';

let webProcessCount = 1;

// This function will only be called once in the original process
async function master() {
    
}

// This function will only be called in each forked process
async function start(id: number, disconnect: () => void) {
    const logger = new ConsoleLogger();

    const app = new koa();
    
    const server = stoppable(
        http.createServer(app.callback()),
        Shutdown.connectionGraceTimeout
    );

    // install basic middleware shared by all services
    if (environment.DEBUG.includes("http")) {
        app.use(KoaLogger((str) => logger.info("http", str)));
    }

    app.use(koaHelmet());

    const router = new Router();
    // Add a health check endpoint to all services
    router.get("/_health", async (ctx) => {
        ctx.status = 200;
        ctx.body = "OK";
    });
    app.use(router.routes());

    // loop through requested services at startup
    for (const name of ['web'] as (keyof typeof toBeInitialized)[]) {
        logger.info("lifecycle", `Initializing ${name}`);
        const initService = toBeInitialized[name];
        initService(app, server);
    }

    server.on("error", (err) => {
        throw err;
    });

    server.on("listening", () => {
        const address = server.address();
        const port = (address as AddressInfo).port;
    
        logger.info(
          "lifecycle",
          `Listening on http://localhost:${port}`
        );
    });

    server.listen(80, '0.0.0.0');

    Shutdown.add(`server-${id}`, ShutdownOrder.last, async () => {
        new Promise((resolve, reject) => {
            // Calling stop prevents new connections from being accepted and waits for
            // existing connections to close for the grace period before forcefully
            // closing them.
            server.stop((err, gracefully) => {
                disconnect();
        
                if (err) {
                    reject(err);
                } else {
                    resolve(gracefully);
                }
            });
        })
    });

    // Handle uncaught promise rejections
    process.on("unhandledRejection", (error: Error) => {
        logger.error("Unhandled promise rejection", error, {
            stack: error.stack,
        });
    });

    // Handle shutdown signals
    process.once("SIGTERM", () => Shutdown.execute());
    process.once("SIGINT", () => Shutdown.execute());
}

void throng({
    master,
    worker: start,
    count: webProcessCount,
});

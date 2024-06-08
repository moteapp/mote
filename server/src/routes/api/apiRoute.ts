import Router from '@koa/router';
import Koa from 'koa';
import bodyParser from 'koa-body';
import { AppContext, AppState } from 'mote/context/context.js';
import { authAPIRouter } from './auth/authAPI.js';
import { NotFoundError } from 'mote/common/errors.js';

const { koaBody } = bodyParser as any;

export const apiApp = new Koa<AppState, AppContext>();
const apiRouter = new Router();

// routes
apiRouter.use("/", authAPIRouter.routes());

apiRouter.get("(.*)", (ctx) => {
    ctx.throw(NotFoundError("Endpoint not found"));
});

apiApp.use(koaBody());
apiApp.use(apiRouter.routes());
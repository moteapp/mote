import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-body';
import { emailAuthRouter } from './email/emailAuth.js';
import { AppContext, AppState } from 'mote/context/context.js';

const { koaBody } = bodyParser as any;

export const authApp = new Koa<AppState, AppContext>();
export const authRouter = new Router();

authRouter.use('/', emailAuthRouter.routes());
authApp.use(koaBody());
authApp.use(authRouter.routes());
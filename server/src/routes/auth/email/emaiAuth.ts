import Router from '@koa/router';
import { validate } from 'mote/middlewares/validate.js';
import { EmailCallbackSchema, EmailReq, EmailSchema } from './emailSchema.js';
import { APIContext } from 'mote/context/context.js';

export const emailAuthRouter = new Router();

emailAuthRouter.post(
    'email', 
    validate(EmailSchema), 
    async (ctx: APIContext<EmailReq>) => {
        const { email } = ctx.input.body;

        ctx.body = {
            success: true,
            redirect: '/home'
        };
        return;
});

emailAuthRouter.get(
    'email.callback',
    validate(EmailCallbackSchema),
    async (ctx: APIContext<EmailReq>) => {
        ctx.body = {
            success: true,
        };
        return;
    }
)
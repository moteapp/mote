import Router from '@koa/router';
import { validate } from 'mote/middlewares/validate.js';
import { EmailCallbackReq, EmailCallbackSchema, EmailReq, EmailSchema } from './emailSchema.js';
import { APIContext } from 'mote/context/context.js';
import { instantiationService } from 'mote/service/service.all.js';
import { IUserService } from 'mote/service/user/user.js';
import { getUserForEmailSigninToken } from 'mote/utils/jwt.js';
import { signIn } from 'mote/utils/authentication.js';

export const emailAuthRouter = new Router();

emailAuthRouter.post(
    'email', 
    validate(EmailSchema), 
    async (ctx: APIContext<EmailReq>) => {
        const { email } = ctx.input.body;

        const user = await instantiationService.invokeFunction(async (accessor)=>{
            const userService = accessor.get(IUserService);
            const users = await userService.find({ email });
            return users[0];
        });

        if (!user) {
            ctx.body = {
                success: true,
            };
            return;
        }

        // respond with success regardless of whether an email was sent
        ctx.body = {
            success: true,
        };
        return;
});

emailAuthRouter.get(
    'email.callback',
    validate(EmailCallbackSchema),
    async (ctx: APIContext<EmailCallbackReq>) => {
        const {token} = ctx.input.query;

        const user = await getUserForEmailSigninToken(token);

        // set cookies on response and redirect to team subdomain
        await signIn(ctx, "email", {
            user,
            team: {} as any,
            isNewTeam: false,
            isNewUser: false,
        });
    }
)
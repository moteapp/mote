import Router from "@koa/router";
import { APIContext } from "mote/context/context.js";
import { AuthInfoReq } from "./authAPISchema.js";
import { IAuthInfo, MoteResponse } from "@mote/client/response";
import { safeUser } from "@mote/client/common/safe";
import { instantiationService } from "mote/service/service.all.js";
import { ISpaceService } from "mote/service/space/space.js";
import { auth } from "mote/middlewares/authentication.js";

export const authAPIRouter = new Router();

authAPIRouter.get("auth/info", auth(), async (ctx: APIContext<AuthInfoReq>) => {
    const { user } = ctx.state.auth;

    const spaces = await instantiationService.invokeFunction((accessor)=>{
        const spaceService = accessor.get(ISpaceService);
        return spaceService.findAllByUser(user.id);
    })

    const response = new MoteResponse<IAuthInfo>({
        user: safeUser(user) as any,
        spaces
    }, 200, 'ok');

    ctx.body = response;
});
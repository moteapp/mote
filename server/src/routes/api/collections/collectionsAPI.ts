import Router from "@koa/router";
import { ICollectionModel } from "@mote/client/model/model";
import { MoteResponse } from "@mote/client/response";
import { APIContext } from "mote/context/context.js";
import { auth } from "mote/middlewares/authentication.js";
import { ICollectionService } from "mote/service/collection/collection.js";
import { instantiationService } from "mote/service/service.all.js";
import { ISpaceService } from "mote/service/space/space.js";


const router = new Router();

router.post(
    "collections",
    auth(),
    async (ctx: APIContext) => {
        const { name, spaceId } = ctx.request.body;

        const { user } = ctx.state.auth;

        const collections = await instantiationService.invokeFunction(async (accessor)=>{
            const collectionService = accessor.get(ICollectionService);
            const spaceService = accessor.get(ISpaceService);
            await collectionService.create({
                name,
                spaceId,
                createBy: user.id,
            });
            return collectionService.find({ create_by: user.id });
        });

        const response = new MoteResponse<ICollectionModel[]>(collections, 200, 'ok');
    
        ctx.body = response;
    }
);

router.get(
    "collections",
    auth(),
    async (ctx: APIContext) => {
        const { user } = ctx.state.auth;

        const collections = await instantiationService.invokeFunction(async (accessor)=>{
            const collectionService = accessor.get(ICollectionService);
            return collectionService.find({ create_by: user.id });
        });

        const response = new MoteResponse<ICollectionModel[]>(collections, 200, 'ok');
    
        ctx.body = response;
    }
);


export const collectionsAPIRouter = router;
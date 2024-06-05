import { z } from 'zod';
import { DefaultContext, ParameterizedContext } from 'koa';
import formidable from 'formidable';
import { IUserModel } from './model';
import { IRouterParamContext } from 'koa-router';

export type Pagination = {
    limit: number;
    offset: number;
    nextPath: string;
};

export enum AuthenticationType {
    API = "api",
    APP = "app",
}

export type Authentication = {
    user: IUserModel;
    token: string;
    type: AuthenticationType;
};
  
export type AppState = {
    auth: Authentication | Record<string, never>;
    pagination: Pagination;
};

export type AppContext = ParameterizedContext<AppState, DefaultContext>;

export const BaseSchema = z.object({
    body: z.unknown(),
    query: z.unknown(),
    file: z.custom<formidable.File>().optional(),
});

export type BaseReq = z.infer<typeof BaseSchema>;

export type BaseRes = unknown;

export interface APIContext<ReqT = BaseReq, ResT = BaseRes>
    extends ParameterizedContext<
        AppState,
        DefaultContext & IRouterParamContext<AppState>,
        ResT
    > {
    /** Typed and validated version of request, consisting of validated body, query, etc */
    input: ReqT;
}

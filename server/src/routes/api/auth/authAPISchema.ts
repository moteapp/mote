import { z } from "zod";
import { BaseSchema } from "mote/context/context.js";

export const AuthInfoSchema = BaseSchema;

export type AuthInfoReq = z.infer<typeof AuthInfoSchema>;

import { BaseSchema } from 'mote/context/context.js';
import { z } from 'zod';

export const EmailSchema = BaseSchema.extend({
    body: z.object({
        email: z.string().email(),
    }),
});

export type EmailReq = z.infer<typeof EmailSchema>;

export const EmailCallbackSchema = BaseSchema.extend({
    query: z.object({
      token: z.string(),
    }),
});
  
export type EmailCallbackReq = z.infer<typeof EmailCallbackSchema>;
  
import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';
import { getServerSession } from 'next-auth';

const t = initTRPC.context<Context>().create();

const isAuth = t.middleware(async ({ ctx, next }) => {
    const session = await getServerSession();

    if (!session || !session.user) throw new TRPCError({ code: "UNAUTHORIZED" })

    return next({
        ctx: {
            ...ctx,
            email: session.user.email,
            user: session.user
        }
    })
})

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth) 
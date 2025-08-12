import prisma from '@/lib/prisma';
import { z } from "zod"
import { privateProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';


export const appRouter = router({
    getUserFiles: privateProcedure.query(async ({ ctx }) => {
        const files = await prisma.file.findMany({
            where: { userEmail: ctx.email }
        });
        return files;
    }),
    deleteFile: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const file = await prisma.file.findFirst({
            where: {
                id: input.id,
                userEmail: ctx.email
            }
        })

        if (!file) throw new TRPCError({ code: "NOT_FOUND" });

        await prisma.file.delete({
            where: {
                id: input.id
            }
        })

        return file
    })
});

export type AppRouter = typeof appRouter;
import prisma from '@/lib/prisma';
import { z } from "zod";
import { privateProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { UTApi } from 'uploadthing/server';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';


export const appRouter = router({
    getUserFiles: privateProcedure.query(async ({ ctx }) => {
        const files = await prisma.file.findMany({
            where: { userEmail: ctx.email }
        });
        return files;
    }),
    getUserFileById: privateProcedure.input(z.object({ fileId: z.string() })).query(async ({ ctx, input }) => {
        const file = await prisma.file.findUnique({ where: { id: input.fileId, userEmail: ctx.email } })
        if (!file) throw new TRPCError({ code: "NOT_FOUND" });
        return file
    }),
    getFile: privateProcedure
        .input(z.object({ key: z.string() }))
        .mutation(async ({ ctx, input }) => {

            const file = await prisma.file.findFirst({
                where: {
                    key: input.key,
                    userEmail: ctx.email,
                },
            })

            if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

            return file
        }),
    getFileMessages: privateProcedure.input(z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string()
    })).query(async ({ ctx, input }) => {
        const { email } = ctx;
        const { fileId, cursor } = input
        const limit = input.limit ?? INFINITE_QUERY_LIMIT

        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                userEmail: email
            }
        })

        if (!file) throw new TRPCError({ code: "NOT_FOUND" })

        const messages = await prisma.message.findMany({
            take: limit + 1,
            where: {
                fileId
            },
            orderBy: {
                createdAt: "desc"
            },
            cursor: cursor ? { id: cursor } : undefined,
            select: {
                id: true,
                isUserMessage: true,
                text: true,
                createdAt: true,
            }
        })

        let nextCursor: typeof cursor;
        if (messages.length > limit) {
            const nextItem = messages.pop()
            nextCursor = nextItem?.id
        }

        return {
            messages,
            nextCursor
        }
    }),
    getFileUploadStatus: privateProcedure.input(z.object({ fileId: z.string() })).query(async ({ input, ctx }) => {
        const file = await prisma.file.findUnique({ where: { id: input.fileId, userEmail: ctx.user.email } })

        if (!file) return { status: "PENDING" as const }

        return { status: file.uploadStatus }
    }),
    deleteFile: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const file = await prisma.file.findFirst({
            where: {
                id: input.id,
                userEmail: ctx.email
            }
        })

        if (!file) throw new TRPCError({ code: "NOT_FOUND" });

        // delete file from uploadthing
        const utapi = new UTApi({
            token: process.env.UPLOADTHING_TOKEN,
            defaultKeyType: "fileKey"
        });

        const response = await utapi.deleteFiles(file.key)

        // delete index from pinecone

        await prisma.file.delete({
            where: {
                id: input.id
            }
        })

        return { file, success: response.success }
    })
});

export type AppRouter = typeof appRouter;
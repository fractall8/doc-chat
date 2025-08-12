import { publicProcedure, router } from './trpc';

export const appRouter = router({
    test: publicProcedure.query(() => 7)
});

export type AppRouter = typeof appRouter;
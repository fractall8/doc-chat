import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createContext = async (opts: CreateNextContextOptions) => {
    return {
        req: opts.req,
        res: opts.res
    };
};

export type Context = Awaited<ReturnType<typeof createContext>>
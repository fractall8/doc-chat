"use client";

import { PropsWithChildren, useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // todo: remove hardcoded url
        httpBatchLink({
          url: `http://localhost:3000/api/trpc`,
        }),
      ],
    })
  );

  return (
    <SessionProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer />
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
};

export default Providers;

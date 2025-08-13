"use client";
import { use } from "react";
import { trpc } from "@/app/_trpc/client";
import { notFound } from "next/navigation";

interface FileIdPageProps {
  params: Promise<{
    fileId: string;
  }>;
}

const FileIdPage = ({ params }: FileIdPageProps) => {
  const { fileId } = use(params);
  const {
    data: file,
    isLoading,
    error,
  } = trpc.getUserFileById.useQuery({ fileId });

  if (error?.message === "NOT_FOUND") notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* render pdf here */}
          </div>
        </div>

        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          {/* render chat here */}
        </div>
      </div>
    </div>
  );
};

export default FileIdPage;

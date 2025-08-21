"use client";

import { trpc } from "@/app/_trpc/client";
import { Ghost, Loader2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Skeleton from "@/components/skeleton";
import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/utils/index";
import UploadButton from "@/components/upload-button";
import { useToast } from "@/lib/react-toastify";

const DashBoard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = trpc.useUtils();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { success, error } = useToast();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: ({ file }) => {
      utils.getUserFiles.invalidate();
      success(`${file.name} successfully deleted!`);
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
    onError: (e) => {
      error(e.message);
    },
  });

  return (
    <main className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-2 font-bold text-2xl sm:text-3xl text-gray-900">
          My Files
        </h1>

        <UploadButton />
      </div>

      {files && files?.length !== 0 ? (
        <ul className="mt-6 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="p-6 flex w-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 flex justify-between place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {formatDate(new Date(file.createdAt))}
                  </div>

                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    size="sm"
                    className="!px-8"
                    variant="destructive"
                  >
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={"5rem"} className="my-2" />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s upload your first PDF.</p>
        </div>
      )}
    </main>
  );
};

export default DashBoard;

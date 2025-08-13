import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    pdfUploader: f({
        pdf: {
            maxFileSize: "8MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const session = await getServerSession();

            if (!session?.user || !session.user.email) throw new UploadThingError("Unauthorized");

            return { userEmail: session.user.email };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const createdFile = await prisma.file.create({
                data: {
                    key: file.key,
                    name: file.name,
                    userEmail: metadata.userEmail,
                    url: file.ufsUrl,
                    uploadStatus: "PROCESSING"
                }
            })
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

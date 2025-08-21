import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { pinecone } from "@/lib/pinecone";
import { getHuggingFaceEmbeddings } from "@/lib/huggingface";

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

            try {
                // download PDF file
                const response = await fetch(file.ufsUrl);
                const blob = await response.blob();

                const loader = new WebPDFLoader(blob, { splitPages: true });
                const pageLevelDocs = await loader.load();

                if (!pageLevelDocs.length) throw new Error("PDF is empty");

                // texts from pdf for generating embeddings
                const texts = pageLevelDocs.map(doc => doc.pageContent);

                const embeddingsArray = await getHuggingFaceEmbeddings(texts);

                console.log(`Embeddings: ${embeddingsArray.length} pts.`);

                // vectorize and index in Pinecone
                const pineconeIndex = pinecone.index("doc-chat");

                await PineconeStore.fromDocuments(pageLevelDocs, {
                    embedDocuments: async () => embeddingsArray,
                    embedQuery: async (query: string) => {
                        const [vec] = await getHuggingFaceEmbeddings([query]);
                        return vec;
                    },
                }, {
                    pineconeIndex,
                    namespace: createdFile.id,
                });

                console.log(`Document indexed in Pinecone (namespace: ${createdFile.id})`);

                await prisma.file.update({
                    where: { id: createdFile.id },
                    data: { uploadStatus: "SUCCESS" },
                });

            } catch (error) {
                console.error("Error while processing PDF:", error);

                await prisma.file.update({
                    where: { id: createdFile.id },
                    data: { uploadStatus: "FAILED" },
                });
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

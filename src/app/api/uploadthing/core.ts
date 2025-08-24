import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { pineconeIndex } from "@/lib/pinecone";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

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

                const embeddings = new HuggingFaceInferenceEmbeddings({
                    apiKey: process.env.HF_TOKEN,
                    model: "sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
                });


                // vectorize and index in Pinecone
                await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
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

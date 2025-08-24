import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { pineconeIndex } from "@/lib/pinecone";
import prisma from "@/lib/prisma";
import { MessageScheme } from "@/lib/schemes/message-scheme";
import { PineconeStore } from "@langchain/pinecone";
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export const POST = async (req: NextRequest) => {
    const body = await req.json()

    const session = await getServerSession()

    if (!session?.user) return new Response("Unauthorized", { status: 401 })

    const { fileId, message } = MessageScheme.parse(body)


    const file = await prisma.file.findFirst({
        where: {
            id: fileId,
            userEmail: session.user.email
        }
    })

    if (!file) return new Response("Not found", { status: 404 })

    await prisma.message.create({
        data: {
            text: message,
            isUserMessage: true,
            userEmail: session.user.email,
            fileId
        }
    })

    // vectorize message

    const embeddings = new HuggingFaceInferenceEmbeddings({
        apiKey: process.env.HF_TOKEN,
        model: "sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        namespace: file.id,
        pineconeIndex
    })

    const results = await vectorStore.similaritySearch(
        message,
        4
    )

    const prevMessages = await prisma.message.findMany({
        where: {
            fileId: file.id
        },
        orderBy: {
            createdAt: "asc"
        },
        take: 6, // how many messages you want display in history
    })

    const formattedPrevMessages = prevMessages.map((msg) => ({
        role: msg.isUserMessage ? "user" as const : "assistant" as const,
        content: msg.text
    }))

    const together = createOpenAI({ apiKey: process.env.HF_TOKEN, baseURL: "https://router.huggingface.co/v1" });

    const response = streamText({
        model: together("openai/gpt-oss-120b:fireworks-ai"),
        temperature: 0,
        messages: [
            {
                role: 'system',
                content:
                    'Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.',
            },
            {
                role: 'user',
                content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \nIf you don't know the answer or there is no answer to the user's question in the provided context, just say that you don't know, don't try to make up an answer. If the answer was not in the context provided, mention it. Give the user a response in the same language in which he/she contacted.
        
                \n----------------\n
                            
                PREVIOUS CONVERSATION:
                ${formattedPrevMessages.map((message) => {
                    if (message.role === 'user')
                        return `User: ${message.content}\n`
                    return `Assistant: ${message.content}\n`
                })}
                            
                \n----------------\n
                            
                CONTEXT:
                ${results.map((r) => r.pageContent).join('\n\n')}
                            
                USER INPUT: ${message}`,
            },
        ],
        onFinish: (async ({ text }) => {
            if (text) {
                await prisma.message.create({
                    data: {
                        text,
                        isUserMessage: false,
                        fileId,
                        userEmail: session.user?.email
                    }
                })
            }
        })
    })

    return response.toTextStreamResponse();
}


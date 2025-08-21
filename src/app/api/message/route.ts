import prisma from "@/lib/prisma";
import { MessageScheme } from "@/lib/schemes/message-scheme";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

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
}
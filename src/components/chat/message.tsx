import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { ExtendedMessage } from "@/types/message";
import { Bot, User } from "lucide-react";
import { forwardRef } from "react";
import remarkGfm from "remark-gfm";
import { Table, Td, Th, Thead, Tr } from "@/components/ui/table";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end max-w-md", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-8 w-8 aspect-square items-center justify-center",
            {
              "order-2 bg-violet-500 rounded-sm": message.isUserMessage,
              "order-1 bg-zinc-800 rounded-sm": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <User color="white" className="h-3/4 w-3/4" />
          ) : (
            <Bot color="white" className="h-3/4 w-3/4" />
          )}
        </div>

        <div
          className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-4 py-2 rounded-lg inline-block", {
              "bg-violet-500 text-white": message.isUserMessage,
              "bg-gray-200 text-gray-900": !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: Table,
                  thead: Thead,
                  th: Th,
                  tr: Tr,
                  td: Td,
                }}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn("text-xs select-none mt-2 w-full text-right", {
                  "text-zinc-500": !message.isUserMessage,
                  "text-violet-300": message.isUserMessage,
                })}
              >
                {new Date(message.createdAt).toISOString()}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;

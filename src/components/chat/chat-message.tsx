import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Message {
  id?: string;
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
  isLoading?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessages({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 py-4",
        isUser ? "justify-end" : "justify-start",
        message.isLoading && "animate-pulse"
      )}
    >
      {!isUser && (
        <Avatar className='h-8 w-8'>
          <AvatarImage src='' />
          <AvatarFallback className='bg-primary text-primary-foreground'>
            AI
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%] break-words",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none",
          message.isLoading && "animate-pulse-subtle"
        )}
      >
        <p className='text-sm'>{message.content}</p>
      </div>
      {isUser && (
        <Avatar className='h-8 w-8'>
          <AvatarImage src='' />
          <AvatarFallback className='bg-muted'>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

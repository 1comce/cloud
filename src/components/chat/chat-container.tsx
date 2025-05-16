import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChatMessage, { Message } from "@/components/chat/chat-message";
import ChatInput from "@/components/chat/chat-input";
import { Document } from "../documents/document-list";
import { MessageCircle } from "lucide-react";
import { useStreamedChat } from "@/hooks/use-stream-chat";
import { ScrollArea } from "../ui/scroll-area";
import { postMessage } from "@/lib/apiAction";
interface ChatContainerProps {
  selectedDocuments: Document[];
}

export default function ChatContainer({
  selectedDocuments,
}: ChatContainerProps) {
  const { isFinished, responseText, loading, error, sendQuestion } =
    useStreamedChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Mock AI response generation
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (selectedDocuments.length === 0) {
          resolve(
            "I don't have any documents to reference. Please upload a document first so I can answer your questions based on that content."
          );
        } else {
          const selectedDocsText = selectedDocuments
            .map((doc) => doc.name)
            .join(", ");
          resolve(
            `This is a simulated AI response based on your documents: ${selectedDocsText}. In a real implementation, this would search through your documents and provide relevant information. For now, I'm acknowledging your query: "${userMessage}"`
          );
        }
      }, 1500);
    });
  };

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    await postMessage(content, "user");
    setCurrentId(`assistant-${Date.now()}`);
    try {
      await sendQuestion(content);
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentId
            ? {
                ...msg,
                content:
                  "Sorry, I encountered an error while processing your request.",
                isLoading: false,
              }
            : msg
        )
      );
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (isFinished) {
      setMessages((prev) => [
        ...prev,
        {
          id: currentId,
          content: responseText,
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isFinished]);
  // Welcome message when documents are selected
  useEffect(() => {
    if (selectedDocuments.length > 0 && messages.length === 0) {
      const welcomeMessage: Message = {
        id: `assistant-welcome`,
        content: `I'm ready to help answer questions about your ${
          selectedDocuments.length
        } document${
          selectedDocuments.length === 1 ? "" : "s"
        }. What would you like to know?`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedDocuments, messages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className='flex flex-col h-screen'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-xl'>RAG Chatbot</CardTitle>
        <CardDescription>
          {selectedDocuments.length === 0
            ? "Upload and select documents to start a conversation"
            : `Chat with your ${selectedDocuments.length} selected document${
                selectedDocuments.length === 1 ? "" : "s"
              }`}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex-1 overflow-hidden p-0'>
        <div className='flex flex-col'>
          <ScrollArea className='h-[42rem] w-full rounded-md border'>
            <div className='flex-1 overflow-y-auto p-4 chat-container'>
              {messages.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-center p-4'>
                  <MessageCircle className='h-12 w-12 text-muted-foreground/50 mb-2' />
                  <h3 className='font-medium text-lg mb-1'>
                    Start a conversation
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    {selectedDocuments.length === 0
                      ? "Upload a document first to get started"
                      : "Ask me anything about your documents"}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              )}
              {loading && (
                <ChatMessage
                  message={{
                    id: currentId,
                    content: responseText ? responseText : "Thinking...",
                    role: "assistant",
                  }}
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder={
              selectedDocuments.length === 0
                ? "Upload and select documents first..."
                : "Ask a question about your documents..."
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

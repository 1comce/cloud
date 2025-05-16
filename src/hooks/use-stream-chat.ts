import { useState, useCallback } from "react";

import { getAIReposnse } from "@/lib/apiAction";
import { postMessage } from "@/lib/apiAction";
export const useStreamedChat = () => {
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const sendQuestion = useCallback(async (question: string) => {
    setResponseText("");
    setLoading(true);
    setError(null);
    setIsFinished(false);
    try {
      const res = await getAIReposnse(question);
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response stream available.");
      }

      let done = false;

      while (!done) {
        const {
          value,
          done: doneReading,
        }: ReadableStreamReadResult<Uint8Array> = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value, { stream: true });
        setResponseText((prev) => prev + chunk);
        // console.log(chunk);
      }
      await postMessage(responseText, "assistant");
    } catch (err: any) {
      console.error("Streaming error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
      setIsFinished(true);
    }
  }, []);

  return {
    isFinished,
    responseText,
    loading,
    error,
    sendQuestion,
  };
};

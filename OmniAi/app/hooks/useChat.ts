import { useState, useEffect, useCallback } from "react";
import { useFetcher } from "@remix-run/react";

interface UseChatOptions {
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export function useChat(options: UseChatOptions = {}) {
  const fetcher = useFetcher();
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Reset state when starting a new chat
  useEffect(() => {
    if (fetcher.state === "submitting") {
      setResponse("");
      setError(null);
      setIsStreaming(true);
      options.onStart?.();
    }
  }, [fetcher.state, options]);

  // Handle streaming response
  useEffect(() => {
    if (!fetcher.data || typeof fetcher.data !== "object") return;

    // Handle error responses
    if ("error" in fetcher.data && typeof fetcher.data.error === "string") {
      const errorMessage = fetcher.data.error;
      const error = new Error(errorMessage);
      setError(error);
      setIsStreaming(false);
      options.onError?.(error);
      return;
    }

    // Handle streaming response
    if (fetcher.data instanceof ReadableStream) {
      const reader = fetcher.data.getReader();
      let buffer = "";

      async function processStream() {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              setIsStreaming(false);
              options.onComplete?.();
              break;
            }

            const text = new TextDecoder().decode(value);
            buffer += text;
            setResponse(buffer);
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Failed to read stream");
          console.error("Stream reading error:", error);
          setError(error);
          setIsStreaming(false);
          options.onError?.(error);
        }
      }

      processStream();
    }
  }, [fetcher.data, options]);

  const sendMessage = useCallback((prompt: string) => {
    if (isStreaming) return;

    const formData = new FormData();
    formData.append("prompt", prompt);

    fetcher.submit(formData, {
      method: "post",
      action: "/api/chat",
    });
  }, [fetcher, isStreaming]);

  return {
    sendMessage,
    response,
    isStreaming,
    error,
    reset: () => {
      setResponse("");
      setError(null);
      setIsStreaming(false);
    },
  };
} 
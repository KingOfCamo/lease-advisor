"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What's the total annual rent across all leases?",
  "Which leases have the highest risk flags?",
  "Summarise the portfolio for each client",
  "Are there any new enquiries to follow up on?",
  "Which leases are expiring in the next 12 months?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
      };

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      const updatedMessages = [...messages, userMessage];
      setMessages([...updatedMessages, assistantMessage]);
      setInput("");
      setIsStreaming(true);

      try {
        const apiMessages = updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.error || `Request failed with status ${response.status}`
          );
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No reader available");

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...last,
                        content: last.content + parsed.text,
                      };
                    }
                    return updated;
                  });
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (e) {
                if (e instanceof Error && e.message !== "Stream error") {
                  // skip malformed JSON, but re-throw real errors
                }
              }
            }
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant" && !last.content) {
            updated[updated.length - 1] = {
              ...last,
              content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="flex items-center gap-2 text-navy-400">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-navy-900">
                Platform Assistant
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Ask me anything about your clients, leases, analyses, portfolio,
                enquiries, or settings. I have access to all your platform data.
              </p>
            </div>
            <div className="grid gap-2 w-full max-w-lg">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left rounded-lg border border-navy-200 px-4 py-3 text-sm text-navy-700 hover:bg-navy-50 hover:border-navy-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-navy-700" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-lg px-4 py-3 text-sm",
                  message.role === "user"
                    ? "bg-navy-700 text-white"
                    : "bg-gray-100 text-navy-900"
                )}
              >
                {message.content ? (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                ) : (
                  isStreaming && (
                    <Loader2 className="h-4 w-4 animate-spin text-navy-400" />
                  )
                )}
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <Separator />

      {/* Input area */}
      <div className="p-4">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your clients, leases, analyses..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-input bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            disabled={isStreaming}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="bg-navy-700 hover:bg-navy-800 h-11 px-4"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for a new line
        </p>
      </div>
    </Card>
  );
}

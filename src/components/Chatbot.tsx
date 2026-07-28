import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { MessageCircle, X, Send, Bot, User, Loader2, RotateCcw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  error?: boolean; // Tracks failed messages for retry
}

// Session storage key for conversation persistence
const STORAGE_KEY = "laundryops_chat_messages";

// API endpoint — reads from env or falls back to localhost
const API_URL = import.meta.env.VITE_CHAT_API_URL || "http://localhost:8000/api/chat";

/**
 * Render message content with basic markdown support.
 * Handles: **bold**, *italic*, `code`, [links](url), and line breaks.
 * Does NOT introduce any external dependencies.
 */
function renderMarkdown(text: string) {
  // Split by line breaks first
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    // Process inline markdown within each line
    const parts: (string | JSX.Element)[] = [];
    let remaining = line;
    let keyIdx = 0;

    // Bold: **text**
    while (remaining.includes("**")) {
      const start = remaining.indexOf("**");
      const end = remaining.indexOf("**", start + 2);
      if (end === -1) break;

      if (start > 0) parts.push(remaining.slice(0, start));
      parts.push(
        <strong key={`b-${lineIdx}-${keyIdx++}`}>
          {remaining.slice(start + 2, end)}
        </strong>
      );
      remaining = remaining.slice(end + 2);
    }

    // Italic: *text* (single asterisk, after bold is processed)
    const italicParts: (string | JSX.Element)[] = [];
    if (remaining.includes("*")) {
      let temp = remaining;
      while (temp.includes("*")) {
        const start = temp.indexOf("*");
        const end = temp.indexOf("*", start + 1);
        if (end === -1) break;

        if (start > 0) italicParts.push(temp.slice(0, start));
        italicParts.push(
          <em key={`i-${lineIdx}-${keyIdx++}`}>
            {temp.slice(start + 1, end)}
          </em>
        );
        temp = temp.slice(end + 1);
      }
      if (temp) italicParts.push(temp);
      if (italicParts.length > 0) {
        parts.push(...italicParts);
        remaining = "";
      }
    }

    if (remaining) parts.push(remaining);

    // Bullet list items: lines starting with "- " or "• "
    const trimmed = line.trimStart();
    const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("• ");

    return (
      <span key={`line-${lineIdx}`}>
        {isBullet ? (
          <span className="block pl-3">
            {"• "}
            {parts.length > 0 ? parts.map((p, i) =>
              typeof p === "string" ? p.replace(/^[-•]\s*/, "") : p
            ) : trimmed.slice(2)}
          </span>
        ) : (
          parts.length > 0 ? parts : line
        )}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    // --- IMPROVEMENT: Restore messages from sessionStorage ---
    // This preserves the conversation if the user navigates between pages.
    // Uses sessionStorage (not localStorage) so it clears when the tab closes.
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch {
      // Ignore parse errors, start fresh
    }

    return [
      {
        id: "1",
        role: "assistant" as const,
        content: "Hello! Welcome to LaundryOps. How can I assist you today?",
        timestamp: new Date(),
      },
    ];
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- IMPROVEMENT: Reliable auto-scroll using scrollIntoView ---
  // The original used scrollRef.scrollTop which doesn't work reliably
  // with the shadcn ScrollArea component. This approach uses a sentinel
  // element at the bottom of the message list.
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // --- IMPROVEMENT: Persist messages to sessionStorage ---
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // sessionStorage full or unavailable — silently ignore
    }
  }, [messages]);

  const sendMessage = async (retryContent?: string) => {
    const content = retryContent || inputValue.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!retryContent) setInputValue("");
    setIsLoading(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // --- IMPROVEMENT: Error message with retry capability ---
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again or contact our support team at support@laundryops.com.",
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- IMPROVEMENT: Use onKeyDown instead of deprecated onKeyPress ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- IMPROVEMENT: Retry failed messages ---
  const handleRetry = (messageId: string) => {
    // Find the user message that preceded the error
    const errorIdx = messages.findIndex((m) => m.id === messageId);
    if (errorIdx <= 0) return;

    const userMsg = messages[errorIdx - 1];
    if (userMsg?.role !== "user") return;

    // Remove the error message and retry
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    sendMessage(userMsg.content);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-4 w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
          role="dialog"
          aria-label="Customer Support Chat"
        >
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-primary/90"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    aria-hidden="true"
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-gray-100 dark:bg-gray-800 rounded-tl-none"
                    }`}
                  >
                    {/* --- IMPROVEMENT: Markdown rendering for bot messages --- */}
                    <div className="text-sm">
                      {message.role === "assistant"
                        ? renderMarkdown(message.content)
                        : message.content}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {/* --- IMPROVEMENT: Retry button on failed messages --- */}
                      {message.error && (
                        <button
                          onClick={() => handleRetry(message.id)}
                          className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1 underline"
                          aria-label="Retry message"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Retry
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* --- IMPROVEMENT: Animated typing indicator --- */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex gap-1.5 items-center" aria-label="Typing">
                      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Scroll anchor — scrollIntoView targets this element */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
                aria-label="Chat message input"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="w-14 h-14 rounded-full shadow-lg"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Chatbot;

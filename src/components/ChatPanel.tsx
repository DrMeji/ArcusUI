import { useEffect, useRef, useState } from "react";
import type { Message } from "../types";
import "./ChatPanel.css";

interface ChatPanelProps {
  messages: Message[];
  isThinking: boolean;
  onSend: (text: string) => void;
}

export function ChatPanel({ messages, isThinking, onSend }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <aside className="chat-panel" aria-label="Conversation">
      <div className="chat-panel__header">
        <h2>Conversation</h2>
      </div>

      <div className="chat-panel__messages" role="log" aria-live="polite">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble chat-bubble--${msg.role}`}
          >
            <span className="chat-bubble__role">
              {msg.role === "assistant" ? "Arcus" : "You"}
            </span>
            <p>{msg.content}</p>
          </div>
        ))}
        {isThinking && (
          <div className="chat-bubble chat-bubble--assistant chat-bubble--typing">
            <span className="chat-bubble__role">Arcus</span>
            <div className="typing-dots" aria-label="Thinking">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="chat-panel__input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Arcus anything..."
          disabled={isThinking}
          aria-label="Message"
        />
        <button type="submit" disabled={!input.trim() || isThinking}>
          Send
        </button>
      </form>
    </aside>
  );
}

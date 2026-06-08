import { useState } from "react";
import { ArrowUpIcon } from "./icons/ArrowUpIcon";
import { HistoryIcon } from "./icons/HistoryIcon";
import "./MessageCompose.css";

interface MessageComposeProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (text: string) => void;
  onHistoryClick?: () => void;
}

export function MessageCompose({
  isOpen,
  onClose,
  onSend,
  onHistoryClick,
}: MessageComposeProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <>
      <div
        className={`message-compose-backdrop ${isOpen ? "message-compose-backdrop--open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <form
        className={`message-compose ${isOpen ? "message-compose--open" : ""}`}
        onSubmit={handleSubmit}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className="message-compose__history"
          aria-label="Chat"
          onClick={(e) => {
            e.stopPropagation();
            onHistoryClick?.();
          }}
        >
          <HistoryIcon />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Arcus..."
          aria-label="Message"
          autoFocus={isOpen}
        />
        <button
          type="submit"
          className="message-compose__send"
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <ArrowUpIcon />
        </button>
      </form>
    </>
  );
}

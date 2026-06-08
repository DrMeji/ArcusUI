import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpIcon } from "./icons/ArrowUpIcon";
import { ChevronDownIcon } from "./icons/ChevronDownIcon";
import { PlusIcon } from "./icons/PlusIcon";
import { AI_MODELS, type AiModelId, type Message } from "../types";
import "./HistoryPanel.css";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isThinking: boolean;
  onSend: (text: string) => void;
  aiModel: AiModelId;
  onAiModelChange: (model: AiModelId) => void;
}

export function HistoryPanel({
  isOpen,
  onClose,
  messages,
  isThinking,
  onSend,
  aiModel,
  onAiModelChange,
}: HistoryPanelProps) {
  const [input, setInput] = useState("");
  const [backdropReady, setBackdropReady] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef(0);

  const selectedModel = AI_MODELS.find((m) => m.id === aiModel) ?? AI_MODELS[0];

  useEffect(() => {
    if (!isOpen) {
      setBackdropReady(false);
      setModelOpen(false);
      return;
    }

    openedAtRef.current = performance.now();
    const timer = window.setTimeout(() => setBackdropReady(true), 340);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      const el = messagesRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 340);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isThinking, isOpen]);

  useEffect(() => {
    if (!modelOpen) return;

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (!modelRef.current?.contains(e.target as Node)) {
        setModelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modelOpen]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (!backdropReady || performance.now() - openedAtRef.current < 340) return;
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <>
      <div
        className={`history-panel-backdrop ${isOpen ? "history-panel-backdrop--open" : ""} ${backdropReady ? "history-panel-backdrop--ready" : ""}`}
        onClick={handleBackdropClick}
        aria-hidden={!isOpen}
      />
      <aside
        className={`history-panel ${isOpen ? "history-panel--open" : ""}`}
        aria-hidden={!isOpen}
        aria-label="Chat"
      >
        <div className="history-panel__header">
          <h2>Chat</h2>
        </div>

        <div ref={messagesRef} className="history-panel__messages" role="log">
          {messages.length === 0 && (
            <p className="history-panel__empty">No messages yet.</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`history-panel__bubble history-panel__bubble--${msg.role}`}
            >
              <span className="history-panel__role">
                {msg.role === "assistant" ? selectedModel.label : "You"}
              </span>
              <p>{msg.content}</p>
            </div>
          ))}
          {isThinking && (
            <div className="history-panel__bubble history-panel__bubble--assistant">
              <span className="history-panel__role">{selectedModel.label}</span>
              <div className="history-panel__typing" aria-label="Thinking">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>

        <form className="history-panel__compose" onSubmit={handleSubmit}>
          <button
            type="button"
            className="history-panel__compose-btn history-panel__compose-btn--icon"
            aria-label="Add attachment"
          >
            <PlusIcon />
          </button>

          <div className="history-panel__model" ref={modelRef}>
            <button
              type="button"
              className="history-panel__compose-btn history-panel__model-trigger"
              aria-label="Choose AI model"
              aria-expanded={modelOpen}
              aria-haspopup="listbox"
              onClick={() => setModelOpen((open) => !open)}
            >
              <span className="history-panel__model-label">{selectedModel.label}</span>
              <ChevronDownIcon />
            </button>
            {modelOpen && (
              <ul className="history-panel__model-menu" role="listbox" aria-label="AI models">
                {AI_MODELS.map((model) => (
                  <li key={model.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={aiModel === model.id}
                      className={`history-panel__model-option ${aiModel === model.id ? "history-panel__model-option--active" : ""}`}
                      onClick={() => {
                        onAiModelChange(model.id);
                        setModelOpen(false);
                      }}
                    >
                      {model.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${selectedModel.label}...`}
            disabled={isThinking}
            aria-label="Message"
          />
          <button
            type="submit"
            className="history-panel__compose-btn history-panel__compose-btn--icon history-panel__compose-btn--send"
            disabled={!input.trim() || isThinking}
            aria-label="Send message"
          >
            <ArrowUpIcon />
          </button>
        </form>
      </aside>
    </>
  );
}

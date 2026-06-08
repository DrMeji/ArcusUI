import { useState } from "react";
import { ArcCore } from "./components/ArcCore";
import { ChatPanel } from "./components/ChatPanel";
import { Header } from "./components/Header";
import { StatusBar } from "./components/StatusBar";
import type { Message } from "./types";
import "./App.css";

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Good evening. I am Arcus. How may I assist you?",
    timestamp: new Date(),
  },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

    // Placeholder — friend will wire up the real backend
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I'm ready when the backend is connected. For now, this is a UI shell.",
          timestamp: new Date(),
        },
      ]);
      setIsThinking(false);
    }, 900);
  };

  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  return (
    <div className="app">
      <div className="app__bg" aria-hidden />
      <div className="app__grid" aria-hidden />

      <Header />

      <main className="app__main">
        <section className="app__core" aria-label="Arcus core">
          <ArcCore isListening={isListening} isThinking={isThinking} />
          <button
            type="button"
            className={`voice-btn ${isListening ? "voice-btn--active" : ""}`}
            onClick={toggleListening}
            aria-pressed={isListening}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            <span className="voice-btn__ring" />
            <span className="voice-btn__icon" />
          </button>
        </section>

        <ChatPanel
          messages={messages}
          isThinking={isThinking}
          onSend={handleSend}
        />
      </main>

      <StatusBar isListening={isListening} isThinking={isThinking} />
    </div>
  );
}

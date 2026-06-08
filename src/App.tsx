import { useState } from "react";
import { HistoryPanel } from "./components/HistoryPanel";
import { MessageCompose } from "./components/MessageCompose";
import { MicListen } from "./components/MicListen";
import { OrbControls } from "./components/OrbControls";
import { ReactiveOrb } from "./components/ReactiveOrb";
import { Sidebar } from "./components/Sidebar";
import { SidebarToggle } from "./components/SidebarToggle";
import { useAudioReactive } from "./hooks/useAudioReactive";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import type { AiModelId, Message } from "./types";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarProjectsMode, setSidebarProjectsMode] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [listeningOpen, setListeningOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isThinking, setIsThinking] = useState(false);
  const [aiModel, setAiModel] = useState<AiModelId>("arcus");
  const {
    level,
    isUserSpeaking,
    isAssistantSpeaking,
    micError,
  } = useAudioReactive();

  const controlsHidden = messageOpen || listeningOpen || historyOpen;

  const openHistory = () => {
    setMessageOpen(false);
    setListeningOpen(false);
    setHistoryOpen(true);
  };
  const closeHistory = () => setHistoryOpen(false);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsThinking(true);

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

  useSpeechRecognition({
    enabled: listeningOpen,
    onFinalTranscript: handleSend,
  });

  return (
    <div
      className={`app ${sidebarOpen && sidebarProjectsMode ? "app--sidebar-wide" : ""}`}
    >
      <SidebarToggle
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((open) => !open)}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onProjectsModeChange={setSidebarProjectsMode}
      />

      <HistoryPanel
        isOpen={historyOpen}
        onClose={closeHistory}
        messages={messages}
        isThinking={isThinking}
        onSend={handleSend}
        aiModel={aiModel}
        onAiModelChange={setAiModel}
      />

      <div
        className={`app__stage ${sidebarOpen ? "app__stage--shifted" : ""} ${historyOpen ? "app__stage--history-shifted" : ""}`}
      >
        <div className="app__center">
          <ReactiveOrb
            activity={level}
            isUserSpeaking={isUserSpeaking || listeningOpen}
            isAssistantSpeaking={isAssistantSpeaking}
          />
        </div>

        <MessageCompose
          isOpen={messageOpen && !historyOpen}
          onClose={() => setMessageOpen(false)}
          onSend={handleSend}
          onHistoryClick={openHistory}
        />

        <MicListen
          isOpen={listeningOpen && !historyOpen}
          onClose={() => setListeningOpen(false)}
          onHistoryClick={openHistory}
          level={level}
          isUserSpeaking={isUserSpeaking}
          micError={micError}
        />

        {!controlsHidden && (
          <OrbControls
            onMessageClick={() => {
              setListeningOpen(false);
              setMessageOpen(true);
            }}
            onMicClick={() => {
              setMessageOpen(false);
              setListeningOpen(true);
            }}
            onHistoryClick={openHistory}
          />
        )}
      </div>
    </div>
  );
}

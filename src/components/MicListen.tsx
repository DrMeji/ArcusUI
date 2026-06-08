import { HistoryIcon } from "./icons/HistoryIcon";
import "./MicListen.css";

interface MicListenProps {
  isOpen: boolean;
  onClose: () => void;
  onHistoryClick?: () => void;
  level: number;
  isUserSpeaking: boolean;
  micError: string | null;
}

export function MicListen({
  isOpen,
  onClose,
  onHistoryClick,
  level,
  isUserSpeaking,
  micError,
}: MicListenProps) {
  const energy = Math.max(0.2, level);

  return (
    <>
      <div
        className={`mic-listen-backdrop ${isOpen ? "mic-listen-backdrop--open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <div
        className={`mic-listen ${isOpen ? "mic-listen--open" : ""}`}
        aria-hidden={!isOpen}
        role="status"
        aria-live="polite"
      >
        <button
          type="button"
          className="mic-listen__history"
          aria-label="Chat"
          onClick={(e) => {
            e.stopPropagation();
            onHistoryClick?.();
          }}
        >
          <HistoryIcon />
        </button>

        <div
          className={`mic-listen__panel ${isUserSpeaking ? "mic-listen__panel--active" : ""}`}
        >
          {micError ? (
            <span className="mic-listen__label">{micError}</span>
          ) : (
            <>
              <div className="mic-listen__bars" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="mic-listen__bar"
                    style={{
                      transform: `scaleY(${0.25 + energy * (0.5 + Math.sin(i * 1.2) * 0.2)})`,
                    }}
                  />
                ))}
              </div>
              <span className="mic-listen__label">
                {isUserSpeaking ? "Listening…" : "Listening"}
              </span>
            </>
          )}
        </div>

        <button type="button" className="mic-listen__stop" onClick={onClose}>
          Stop
        </button>
      </div>
    </>
  );
}

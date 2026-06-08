import "./OrbControls.css";

interface OrbControlsProps {
  onMessageClick?: () => void;
  onMicClick?: () => void;
  onHistoryClick?: () => void;
}

export function OrbControls({
  onMessageClick,
  onMicClick,
  onHistoryClick,
}: OrbControlsProps) {
  return (
    <div className="orb-controls" role="toolbar" aria-label="Assistant controls">
      <button
        type="button"
        className="orb-controls__btn"
        aria-label="Message"
        onClick={onMessageClick}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M5 6.75A2.75 2.75 0 0 1 7.75 4h8.5A2.75 2.75 0 0 1 19 6.75v5.5A2.75 2.75 0 0 1 16.25 15H10.2L6.8 18.1a.65.65 0 0 1-1.05-.5V15H7.75A2.75 2.75 0 0 1 5 12.25v-5.5Z"
          />
        </svg>
      </button>

      <button
        type="button"
        className="orb-controls__btn"
        aria-label="Microphone"
        onClick={onMicClick}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <rect x="10" y="4.25" width="4" height="9.75" rx="2" fill="currentColor" />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            d="M7 11.5a5 5 0 0 0 10 0"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            d="M12 16.25v2.5"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            d="M9 19.25h6"
          />
        </svg>
      </button>

      <button
        type="button"
        className="orb-controls__btn"
        aria-label="Chat"
        onClick={(e) => {
          e.stopPropagation();
          onHistoryClick?.();
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <rect x="4.5" y="13.25" width="15" height="6.75" rx="1.75" fill="currentColor" />
          <rect x="6" y="9.75" width="12" height="2.35" rx="1.175" fill="currentColor" />
          <rect x="7.5" y="6.25" width="9" height="2.35" rx="1.175" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

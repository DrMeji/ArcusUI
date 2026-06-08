import "./StatusBar.css";

interface StatusBarProps {
  isListening: boolean;
  isThinking: boolean;
}

export function StatusBar({ isListening, isThinking }: StatusBarProps) {
  const status = isThinking
    ? "Processing"
    : isListening
      ? "Listening"
      : "Standby";

  return (
    <footer className="status-bar">
      <span className="status-bar__label">System</span>
      <span className={`status-bar__value status-bar__value--${status.toLowerCase()}`}>
        {status}
      </span>
      <span className="status-bar__sep" />
      <span className="status-bar__hint">UI shell — backend not connected</span>
    </footer>
  );
}

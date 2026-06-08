import "./ArcCore.css";

interface ArcCoreProps {
  isListening: boolean;
  isThinking: boolean;
}

export function ArcCore({ isListening, isThinking }: ArcCoreProps) {
  const stateClass = isThinking
    ? "arc-core--thinking"
    : isListening
      ? "arc-core--listening"
      : "";

  return (
    <div className={`arc-core ${stateClass}`} aria-hidden>
      <div className="arc-core__orbit arc-core__orbit--outer" />
      <div className="arc-core__orbit arc-core__orbit--inner" />
      <div className="arc-core__ring" />
      <div className="arc-core__glow" />
      <div className="arc-core__center">
        <span className="arc-core__label">ARCUS</span>
      </div>
      <div className="arc-core__waveform">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="arc-core__bar"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    </div>
  );
}

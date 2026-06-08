import "./SidebarToggle.css";

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <button
      type="button"
      className={`sidebar-toggle ${isOpen ? "sidebar-toggle--open" : ""}`}
      onClick={onToggle}
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      aria-expanded={isOpen}
    >
      <svg
        className="sidebar-toggle__icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <rect
          x="4.5"
          y="5.5"
          width="15"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line
          x1="9.5"
          y1="5.5"
          x2="9.5"
          y2="18.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}

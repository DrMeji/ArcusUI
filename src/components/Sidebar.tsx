import { useState, type ComponentType } from "react";
import {
  AdvisorIcon,
  ArcusAgentIcon,
  CoderIcon,
  DashboardIcon,
  DesignerIcon,
  ExecutorIcon,
  MemorySearchIcon,
  MissionControlIcon,
  ReminderIcon,
  ResearcherIcon,
  WorkspaceIcon,
} from "./icons/sidebar/SidebarNavIcons";
import { ArcusLogo } from "./ArcusLogo";
import { SettingsIcon } from "./icons/SettingsIcon";
import "./Sidebar.css";

const MAIN_NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardIcon },
  { label: "Memory Search", icon: MemorySearchIcon },
  { label: "Workspace", icon: WorkspaceIcon },
  { label: "Reminder", icon: ReminderIcon },
  { label: "Mission Control", icon: MissionControlIcon },
  { label: "Arcus Agent", icon: ArcusAgentIcon },
] as const;

const AGENT_SUB_ITEMS = [
  { label: "Designer", icon: DesignerIcon },
  { label: "Coder", icon: CoderIcon },
  { label: "Researcher", icon: ResearcherIcon },
  { label: "Executor", icon: ExecutorIcon },
  { label: "Advisor", icon: AdvisorIcon },
] as const;

type NavItem = (typeof MAIN_NAV_ITEMS)[number]["label"];
type AgentSubItem = (typeof AGENT_SUB_ITEMS)[number]["label"];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavButton({
  label,
  icon: Icon,
  isActive,
  onClick,
  className = "",
}: {
  label: string;
  icon: ComponentType;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`sidebar__item ${isActive ? "sidebar__item--active" : ""} ${className}`.trim()}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <span className="sidebar__item-icon" aria-hidden>
        <Icon />
      </span>
      <span className="sidebar__item-label">{label}</span>
    </button>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<NavItem>("Dashboard");
  const [activeAgentSub, setActiveAgentSub] = useState<AgentSubItem | null>(null);

  const agentMode = activeItem === "Arcus Agent";

  const handleMainClick = (label: NavItem) => {
    if (label === "Arcus Agent") {
      setActiveItem("Arcus Agent");
      setActiveAgentSub(null);
      return;
    }
    setActiveItem(label);
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? "sidebar-backdrop--open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`sidebar ${isOpen ? "sidebar--open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="sidebar__header">
          <ArcusLogo className="sidebar__header-logo" />
          <span className="sidebar__title">A R C U S</span>
        </div>
        <nav className="sidebar__nav" aria-label="Main">
          {agentMode ? (
            <>
              <NavButton
                label="Arcus Agent"
                icon={ArcusAgentIcon}
                isActive
                onClick={() => {
                  setActiveItem("Dashboard");
                  setActiveAgentSub(null);
                }}
              />
              <div className="sidebar__agent-sub">
                {AGENT_SUB_ITEMS.map(({ label, icon }) => (
                  <NavButton
                    key={label}
                    label={label}
                    icon={icon}
                    isActive={activeAgentSub === label}
                    onClick={() => setActiveAgentSub(label)}
                    className="sidebar__item--sub"
                  />
                ))}
              </div>
            </>
          ) : (
            MAIN_NAV_ITEMS.map(({ label, icon }) => (
              <NavButton
                key={label}
                label={label}
                icon={icon}
                isActive={activeItem === label}
                onClick={() => handleMainClick(label)}
              />
            ))
          )}
        </nav>
        <div className="sidebar__profile">
          <button
            type="button"
            className="sidebar__profile-main"
            aria-label="Arcus Admin"
          >
            <span className="sidebar__avatar" aria-hidden>
              <ArcusLogo className="sidebar__avatar-logo" />
            </span>
            <span className="sidebar__profile-info">
              <span className="sidebar__profile-name">Arcus Admin</span>
              <span className="sidebar__profile-meta">Beta</span>
            </span>
          </button>
          <button
            type="button"
            className="sidebar__settings"
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>
        </div>
      </aside>
    </>
  );
}

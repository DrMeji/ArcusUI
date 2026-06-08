import { useEffect, useState, type ComponentType } from "react";
import {
  AdvisorIcon,
  ArcusAgentIcon,
  BackIcon,
  CoderIcon,
  DashboardIcon,
  DesignerIcon,
  ExecutorIcon,
  MemorySearchIcon,
  MissionControlIcon,
  ProjectsIcon,
  ReminderIcon,
  ResearcherIcon,
  WorkspaceIcon,
} from "./icons/sidebar/SidebarNavIcons";
import { ArcusLogo } from "./ArcusLogo";
import { ProjectsPanel } from "./ProjectsPanel";
import { SettingsIcon } from "./icons/SettingsIcon";
import "./Sidebar.css";

const MAIN_NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardIcon },
  { label: "Memory Search", icon: MemorySearchIcon },
  { label: "Workspace", icon: WorkspaceIcon },
  { label: "Reminder", icon: ReminderIcon },
  { label: "Mission Control", icon: MissionControlIcon },
  { label: "Projects", icon: ProjectsIcon },
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
  onProjectsModeChange?: (active: boolean) => void;
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

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="sidebar__back"
      onClick={onClick}
      aria-label="Back to main menu"
    >
      <span className="sidebar__item-icon" aria-hidden>
        <BackIcon />
      </span>
      <span className="sidebar__item-label">Back</span>
    </button>
  );
}

export function Sidebar({ isOpen, onClose, onProjectsModeChange }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<NavItem>("Dashboard");
  const [activeAgentSub, setActiveAgentSub] = useState<AgentSubItem | null>(null);

  const agentMode = activeItem === "Arcus Agent";
  const projectsMode = activeItem === "Projects";

  useEffect(() => {
    onProjectsModeChange?.(projectsMode);
  }, [projectsMode, onProjectsModeChange]);

  const handleMainClick = (label: NavItem) => {
    if (label === "Arcus Agent") {
      setActiveItem("Arcus Agent");
      setActiveAgentSub(null);
      return;
    }
    if (label === "Projects") {
      setActiveItem("Projects");
      setActiveAgentSub(null);
      return;
    }
    setActiveItem(label);
    setActiveAgentSub(null);
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? "sidebar-backdrop--open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`sidebar ${isOpen ? "sidebar--open" : ""} ${projectsMode ? "sidebar--projects" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="sidebar__header">
          <ArcusLogo className="sidebar__header-logo" />
          <span className="sidebar__title">A R C U S</span>
        </div>
        <nav
          className={`sidebar__nav ${projectsMode ? "sidebar__nav--projects" : ""}`}
          aria-label="Main"
        >
          {agentMode ? (
            <>
              <BackButton
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
          ) : projectsMode ? (
            <>
              <BackButton onClick={() => setActiveItem("Dashboard")} />
              <div className="sidebar__projects">
                <ProjectsPanel />
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

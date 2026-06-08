import type { ReactNode } from "react";

function IconBase({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {children}
    </svg>
  );
}

export function DashboardIcon() {
  return (
    <IconBase>
      <rect x="4.5" y="4.5" width="6.25" height="6.25" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13.25" y="4.5" width="6.25" height="6.25" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4.5" y="13.25" width="6.25" height="6.25" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13.25" y="13.25" width="6.25" height="6.25" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  );
}

export function MemorySearchIcon() {
  return (
    <IconBase>
      <circle cx="10.5" cy="10.5" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14.75 14.75L19 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.5 10.5h4M10.5 8.5v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function WorkspaceIcon() {
  return (
    <IconBase>
      <path
        d="M5 8.5h14v10a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5v-10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.5V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  );
}

export function ReminderIcon() {
  return (
    <IconBase>
      <path
        d="M12 5.25a4.25 4.25 0 0 1 4.25 4.25v2.35c0 .55.22 1.08.61 1.47l.39.39a.75.75 0 0 1-.53 1.29H7.28a.75.75 0 0 1-.53-1.29l.39-.39c.39-.39.61-.92.61-1.47V9.5A4.25 4.25 0 0 1 12 5.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10.25 18.25a1.75 1.75 0 0 0 3.5 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function MissionControlIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="6.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 5.25V3.5M12 20.5v-1.75M5.25 12H3.5M20.5 12h-1.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.1 7.1l-1.24-1.24M18.14 18.14l-1.24-1.24M16.9 7.1l1.24-1.24M7.1 16.9l-1.24 1.24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function ArcusAgentIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.25 18.75c0-3.18 2.58-5.75 5.75-5.75s5.75 2.57 5.75 5.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function DesignerIcon() {
  return (
    <IconBase>
      <path
        d="M14.5 5.5 8.75 11.25l-1.25 4.25 4.25-1.25L17.5 8.5l-3-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6.5 17.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </IconBase>
  );
}

export function CoderIcon() {
  return (
    <IconBase>
      <rect x="5" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.5 10.25 10.75 12l-2.25 1.75M15.5 10.25 13.25 12l2.25 1.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

export function ResearcherIcon() {
  return (
    <IconBase>
      <path
        d="M6.5 7.5h7.75l2.25 2.25V17a1.5 1.5 0 0 1-1.5 1.5H6.5a1.5 1.5 0 0 1-1.5-1.5V9a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14.25 7.5V9.75H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="15.75" cy="15.75" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17.75 17.75 19.5 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  );
}

export function ExecutorIcon() {
  return (
    <IconBase>
      <path
        d="M13.25 5.25 7.5 13h4.25l-1.25 5.75 6.5-9.25H12.5l.75-4.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

export function AdvisorIcon() {
  return (
    <IconBase>
      <path
        d="M7 7.5h10a1.5 1.5 0 0 1 1.5 1.5v4.75a1.5 1.5 0 0 1-1.5 1.5H12l-3 2.75V15.25H7a1.5 1.5 0 0 1-1.5-1.5V9a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 11h4M10 13.25h2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  );
}

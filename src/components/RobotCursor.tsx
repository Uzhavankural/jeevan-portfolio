import React from "react";

export interface AgentConfig {
  id: string;
  name: string;
  color: string;
  blinkDelay: string;
  pulseDelay: string;
}

export const AGENT_ROSTER: AgentConfig[] = [
  { id: "scout", name: "Scout", color: "#ff3b2f", blinkDelay: "0s", pulseDelay: "0s" },
  { id: "layout", name: "Layout", color: "#38bdf8", blinkDelay: "0.6s", pulseDelay: "0.3s" },
  { id: "typeset", name: "Typeset", color: "#34d399", blinkDelay: "1.3s", pulseDelay: "0.7s" },
  { id: "motion", name: "Motion", color: "#fbbf24", blinkDelay: "2.1s", pulseDelay: "1.1s" },
  { id: "qa", name: "QA", color: "#fb7185", blinkDelay: "0.9s", pulseDelay: "1.5s" },
  { id: "deploy", name: "Deploy", color: "#22d3ee", blinkDelay: "1.8s", pulseDelay: "0.4s" },
  { id: "copy", name: "Copy", color: "#a3e635", blinkDelay: "2.6s", pulseDelay: "0.9s" },
  { id: "lint", name: "Lint", color: "#fb923c", blinkDelay: "0.3s", pulseDelay: "1.3s" },
  { id: "index", name: "Index", color: "#2dd4bf", blinkDelay: "1.5s", pulseDelay: "1.7s" },
  { id: "render", name: "Render", color: "#60a5fa", blinkDelay: "2.4s", pulseDelay: "0.2s" },
  { id: "palette", name: "Palette", color: "#facc15", blinkDelay: "1.1s", pulseDelay: "0.8s" },
  { id: "review", name: "Review", color: "#f4f4f5", blinkDelay: "2.9s", pulseDelay: "1.4s" },
];

interface RobotCursorProps {
  agent: AgentConfig;
  innerRef: (el: HTMLDivElement | null) => void;
}

export function RobotCursor({ agent, innerRef }: RobotCursorProps) {
  return (
    <div
      ref={innerRef}
      className="pointer-events-none fixed top-0 left-0 z-50 select-none will-change-transform"
      style={{
        opacity: 0,
        transform: "translate3d(-120px, -120px, 0)",
      }}
      aria-hidden="true"
    >
      {/* Pointer arrow tip anchored precisely at (0, 0) */}
      <svg
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        className="block drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
        aria-hidden="true"
      >
        <path
          d="M1.5 1.5L15.5 9.2L8.9 11.4L6.4 17.8L1.5 1.5Z"
          fill={agent.color}
          stroke="#09090b"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Coloured name tag holding tiny robot head */}
      <div
        className="ml-3 -mt-1 inline-flex items-center gap-1.5 rounded-md bg-[#111114] px-2 py-1 shadow-[0_6px_18px_rgba(0,0,0,0.75)]"
        style={{
          border: `1.5px solid ${agent.color}`,
        }}
      >
        <svg
          width="15"
          height="16"
          viewBox="0 0 18 19"
          fill="none"
          className="shrink-0"
          aria-hidden="true"
        >
          {/* Antenna */}
          <line
            x1="9"
            y1="5"
            x2="9"
            y2="2.2"
            stroke={agent.color}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle
            cx="9"
            cy="1.8"
            r="1.5"
            fill={agent.color}
            className="robot-antenna-pulse"
            style={{ animationDelay: agent.pulseDelay }}
          />
          {/* Robot head chassis */}
          <rect
            x="2.2"
            y="5.2"
            width="13.6"
            height="11.2"
            rx="3"
            fill="#18181b"
            stroke={agent.color}
            strokeWidth="1.4"
          />
          {/* Side ear nodes */}
          <rect x="0.8" y="8.8" width="1.4" height="4" rx="0.7" fill={agent.color} />
          <rect x="15.8" y="8.8" width="1.4" height="4" rx="0.7" fill={agent.color} />
          {/* Visor & blinking LED eyes */}
          <rect x="4" y="7.8" width="10" height="5.2" rx="1.6" fill="#09090b" />
          <rect
            x="5.4"
            y="9.2"
            width="2.4"
            height="2.4"
            rx="0.6"
            fill={agent.color}
            className="robot-eye-blink"
            style={{ animationDelay: agent.blinkDelay }}
          />
          <rect
            x="10.2"
            y="9.2"
            width="2.4"
            height="2.4"
            rx="0.6"
            fill={agent.color}
            className="robot-eye-blink"
            style={{ animationDelay: agent.blinkDelay }}
          />
          {/* Mouth grill */}
          <line
            x1="6.5"
            y1="14.5"
            x2="11.5"
            y2="14.5"
            stroke="#52525b"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>

        <span
          className="font-mono text-[10px] font-semibold leading-none tracking-wide"
          style={{ color: agent.color }}
        >
          {agent.name}
        </span>
      </div>
    </div>
  );
}

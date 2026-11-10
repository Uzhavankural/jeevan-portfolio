"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Compass, Pause, Play, Square } from "lucide-react";
import { AGENT_ROSTER, RobotCursor } from "./RobotCursor";

type BuildModeType = "type" | "pop" | "wipe";
type ElementBuildState = "unbuilt" | "queued" | "building" | "built";

interface TextNodeSlice {
  node: Text;
  full: string;
}

interface BuildTarget {
  el: HTMLElement;
  index: number;
  mode: BuildModeType;
  label: string;
  section: string;
  state: ElementBuildState;
  textSlices: TextNodeSlice[] | null;
  totalChars: number;
  hadAriaLabel: boolean;
  prevAriaLabel: string | null;
}

interface ActiveSlot {
  slotIndex: number;
  target: BuildTarget;
  agentIndex: number;
  phase: "glide" | "drag" | "reveal" | "fade";
  elapsedMs: number;
  glideDuration: number;
  dragDuration: number;
  revealDuration: number;
  fadeDuration: number;
  startX: number;
  startY: number;
  rect: { left: number; top: number; width: number; height: number };
}

interface CursorMotion {
  x: number;
  y: number;
  opacity: number;
  idleSeed: number;
  idleTargetX: number;
  idleTargetY: number;
  idleTimer: number;
}

const MAX_CONCURRENT_BUILDS = 6;
const MOBILE_BREAKPOINT = 768;
const BOOT_DURATION_MS = 650;

function easeOutCubic(t: number): number {
  const u = 1 - Math.min(1, Math.max(0, t));
  return 1 - u * u * u;
}

function easeInOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeOutBack(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/** Smooth C1 trapezoid curve: ease-in (first 12%), steady cruise (middle 76%), ease-out (last 12%). */
function tourProgressCurve(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  const a = 0.12;
  const v = 1 / (1 - a);
  if (x < a) {
    return 0.5 * v * ((x * x) / a);
  }
  if (x <= 1 - a) {
    return 0.5 * v * a + v * (x - a);
  }
  const u = 1 - x;
  return 1 - 0.5 * v * ((u * u) / a);
}

function collectTextNodes(el: HTMLElement): { slices: TextNodeSlice[]; total: number } {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const slices: TextNodeSlice[] = [];
  let total = 0;
  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    const textVal = textNode.nodeValue ?? "";
    if (textVal.length > 0) {
      slices.push({ node: textNode, full: textVal });
      total += textVal.length;
    }
    current = walker.nextNode();
  }
  return { slices, total };
}

function restoreElementStyles(target: BuildTarget) {
  const { el } = target;
  if (target.textSlices) {
    for (const s of target.textSlices) {
      if (s.node.nodeValue !== s.full) {
        s.node.nodeValue = s.full;
      }
    }
    if (!target.hadAriaLabel) {
      el.removeAttribute("aria-label");
    } else if (target.prevAriaLabel !== null) {
      el.setAttribute("aria-label", target.prevAriaLabel);
    }
  }
  el.style.minHeight = "";
  el.style.opacity = "";
  el.style.transform = "";
  el.style.clipPath = "";
  el.removeAttribute("data-building");
}

function finishTargetInstant(target: BuildTarget) {
  restoreElementStyles(target);
  target.el.setAttribute("data-built", "true");
  target.state = "built";
}

export function AgentOrchestrator() {
  const [agentsOn, setAgentsOn] = useState<boolean>(false);
  const [bootVisible, setBootVisible] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [tourActive, setTourActive] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const cursorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wireframeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wireframeLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const engineRef = useRef<{
    targets: BuildTarget[];
    pending: BuildTarget[];
    slots: (ActiveSlot | null)[];
    cursors: CursorMotion[];
    rafId: number | null;
    observer: IntersectionObserver | null;
    lastTime: number;
    needsScrollAudit: boolean;
    agentsOn: boolean;
    paused: boolean;
    booting: boolean;
    isMobile: boolean;
    tourPending: boolean;
    tourRunning: boolean;
    tourStartedAt: number;
    tourDurationMs: number;
    tourStartY: number;
    tourTargetY: number;
    lastProgrammaticScrollY: number;
    idleSeconds: number;
  }>({
    targets: [],
    pending: [],
    slots: Array(MAX_CONCURRENT_BUILDS).fill(null),
    cursors: AGENT_ROSTER.map((_, i) => ({
      x: -120,
      y: -120,
      opacity: 0,
      idleSeed: i * 1.37 + 0.5,
      idleTargetX: 120 + (i % 4) * 180,
      idleTargetY: 140 + Math.floor(i / 4) * 160,
      idleTimer: 0,
    })),
    rafId: null,
    observer: null,
    lastTime: 0,
    needsScrollAudit: false,
    agentsOn: false,
    paused: false,
    booting: false,
    isMobile: false,
    tourPending: false,
    tourRunning: false,
    tourStartedAt: 0,
    tourDurationMs: 28000,
    tourStartY: 0,
    tourTargetY: 0,
    lastProgrammaticScrollY: 0,
    idleSeconds: 0,
  });

  const hideWireframe = useCallback((slotIndex: number) => {
    const wf = wireframeRefs.current[slotIndex];
    if (wf) {
      wf.style.opacity = "0";
      wf.style.transform = "translate3d(-9999px, -9999px, 0)";
      wf.style.width = "0px";
      wf.style.height = "0px";
    }
  }, []);

  const hideAllOverlays = useCallback(() => {
    for (let i = 0; i < MAX_CONCURRENT_BUILDS; i++) {
      hideWireframe(i);
    }
    for (let i = 0; i < AGENT_ROSTER.length; i++) {
      const c = cursorRefs.current[i];
      if (c) {
        c.style.opacity = "0";
      }
      engineRef.current.cursors[i].opacity = 0;
    }
  }, [hideWireframe]);

  const stopTour = useCallback((reason?: string) => {
    const eng = engineRef.current;
    if (!eng.tourRunning && !eng.tourPending) return;
    eng.tourPending = false;
    eng.tourRunning = false;
    document.documentElement.style.scrollBehavior = "";
    setTourActive(false);
    if (reason) {
      setStatusMessage(reason);
    }
  }, []);

  const completeEverythingNow = useCallback(() => {
    const eng = engineRef.current;
    eng.slots.forEach((slot, idx) => {
      if (slot) {
        finishTargetInstant(slot.target);
        eng.slots[idx] = null;
      }
      hideWireframe(idx);
    });
    eng.pending.length = 0;
    for (const target of eng.targets) {
      if (target.state !== "built") {
        finishTargetInstant(target);
      }
    }
    document.documentElement.classList.remove("build-mode", "booting");
    setBootVisible(false);
    eng.booting = false;
    hideAllOverlays();
  }, [hideAllOverlays, hideWireframe]);

  const enqueueTarget = useCallback((target: BuildTarget) => {
    const eng = engineRef.current;
    if (target.state !== "unbuilt") return;
    target.state = "queued";
    eng.pending.push(target);
    eng.pending.sort((a, b) => a.index - b.index);
  }, []);

  const startBuildEngine = useCallback(
    (resetViewportElements: boolean) => {
      const eng = engineRef.current;
      const doc = document.documentElement;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const activeCursorCount = eng.isMobile ? 6 : 12;

      if (eng.observer) {
        eng.observer.disconnect();
      }

      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-build]"));
      eng.targets = nodes.map((el, index) => {
        const rawMode = el.dataset.build;
        const mode: BuildModeType =
          rawMode === "type" || rawMode === "pop" || rawMode === "wipe"
            ? rawMode
            : "pop";
        const label =
          el.dataset.buildLabel ||
          (mode === "type" ? "TEXT" : mode === "wipe" ? "DISPLAY" : "BLOCK");
        const section = el.closest("[data-section]")?.getAttribute("data-section") ?? "page";

        if (resetViewportElements) {
          el.removeAttribute("data-built");
          el.removeAttribute("data-building");
          el.style.minHeight = "";
          el.style.opacity = "";
          el.style.transform = "";
          el.style.clipPath = "";
        }

        const alreadyBuilt = el.getAttribute("data-built") === "true";
        return {
          el,
          index,
          mode,
          label,
          section,
          state: alreadyBuilt ? "built" : "unbuilt",
          textSlices: null,
          totalChars: 0,
          hadAriaLabel: el.hasAttribute("aria-label"),
          prevAriaLabel: el.getAttribute("aria-label"),
        };
      });

      eng.pending = [];
      eng.slots = Array(MAX_CONCURRENT_BUILDS).fill(null);
      eng.idleSeconds = 0;

      // Place cursors cleanly around perimeter/center entry points
      for (let i = 0; i < AGENT_ROSTER.length; i++) {
        const edgeSide = i % 4;
        const startX =
          edgeSide === 0
            ? vw * (0.15 + ((i * 19) % 70) / 100)
            : edgeSide === 1
              ? vw - 60
              : edgeSide === 2
                ? vw * (0.2 + ((i * 23) % 60) / 100)
                : 40;
        const startY =
          edgeSide === 0
            ? 40
            : edgeSide === 1
              ? vh * (0.2 + ((i * 17) % 60) / 100)
              : edgeSide === 2
                ? vh - 80
                : vh * (0.2 + ((i * 29) % 60) / 100);
        eng.cursors[i].x = startX;
        eng.cursors[i].y = startY;
        eng.cursors[i].opacity = i < activeCursorCount ? 1 : 0;
        eng.cursors[i].idleTargetX = vw * (0.15 + ((i * 21) % 70) / 100);
        eng.cursors[i].idleTargetY = vh * (0.2 + ((i * 13) % 55) / 100);
        eng.cursors[i].idleTimer = 0.4 + (i % 5) * 0.35;
      }

      doc.classList.add("build-mode");

      // Immediate audit: reveal scrolled-past items instantly, queue visible items
      for (const t of eng.targets) {
        if (t.state === "built") continue;
        const r = t.el.getBoundingClientRect();
        if (r.bottom < -4) {
          finishTargetInstant(t);
        } else if (r.top < vh + 24 && r.bottom > 0) {
          enqueueTarget(t);
        }
      }

      const io = new IntersectionObserver(
        (entries) => {
          if (!eng.agentsOn || eng.booting) return;
          for (const entry of entries) {
            const target = eng.targets.find((t) => t.el === entry.target);
            if (!target || target.state === "built") continue;
            if (entry.isIntersecting) {
              enqueueTarget(target);
              io.unobserve(entry.target);
            } else if (entry.boundingClientRect.bottom < 0) {
              finishTargetInstant(target);
              io.unobserve(entry.target);
            }
          }
        },
        {
          threshold: 0.02,
          rootMargin: "48px 0px -8px 0px",
        }
      );

      for (const t of eng.targets) {
        if (t.state === "unbuilt") {
          io.observe(t.el);
        }
      }
      eng.observer = io;
    },
    [enqueueTarget]
  );

  // Start tour smooth scroll once hero is built (or immediately if agents are off)
  const beginTourAutoScroll = useCallback(() => {
    const eng = engineRef.current;
    if (!eng.tourPending || eng.tourRunning) return;
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    if (maxScroll <= 16) {
      eng.tourPending = false;
      setTourActive(false);
      return;
    }
    eng.tourPending = false;
    eng.tourRunning = true;
    eng.tourStartedAt = performance.now();
    eng.tourStartY = window.scrollY;
    eng.tourTargetY = maxScroll;
    eng.tourDurationMs = Math.max(24000, Math.round(maxScroll * 10.5));
    eng.lastProgrammaticScrollY = window.scrollY;
    document.documentElement.style.scrollBehavior = "auto";
    setTourActive(true);
    setStatusMessage("Tour started. Scroll or press Escape to stop.");
  }, []);

  // Main single requestAnimationFrame loop
  useEffect(() => {
    const eng = engineRef.current;

    const checkMobile = () => {
      const mobileNow = window.innerWidth < MOBILE_BREAKPOINT;
      eng.isMobile = mobileNow;
      setIsMobile(mobileNow);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // Resolve initial mode from <head> dataset (already evaluated before paint)
    const doc = document.documentElement;
    const initialMode = doc.dataset.agents === "on";
    eng.agentsOn = initialMode;
    setAgentsOn(initialMode);

    let pendingTour = false;
    try {
      pendingTour = window.sessionStorage.getItem("portfolio-tour") === "pending";
      if (pendingTour) {
        window.sessionStorage.removeItem("portfolio-tour");
      }
    } catch {
      pendingTour = false;
    }

    if (pendingTour) {
      eng.tourPending = true;
      setTourActive(true);
      doc.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
    }

    let bootTimer: number | null = null;
    if (initialMode) {
      eng.booting = true;
      setBootVisible(true);
      bootTimer = window.setTimeout(() => {
        eng.booting = false;
        doc.classList.remove("booting");
        setBootVisible(false);
        startBuildEngine(false);
      }, BOOT_DURATION_MS);
    } else {
      doc.classList.remove("build-mode", "booting");
      setBootVisible(false);
      if (pendingTour) {
        window.setTimeout(() => beginTourAutoScroll(), 350);
      }
    }

    const onScroll = () => {
      eng.needsScrollAudit = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Tour interruption listeners (wheel, touch, manual keys)
    const onWheelOrTouch = () => {
      if (eng.tourRunning || eng.tourPending) {
        stopTour("Tour stopped");
      }
    };
    window.addEventListener("wheel", onWheelOrTouch, { passive: true });
    window.addEventListener("touchstart", onWheelOrTouch, { passive: true });

    const tick = (now: number) => {
      const dtMs = eng.lastTime ? Math.min(48, now - eng.lastTime) : 16.67;
      eng.lastTime = now;

      // 1. Handle Tour auto-scroll (only if not paused)
      if (eng.tourRunning && !eng.paused) {
        // Detect scrollbar drag or manual jump
        if (Math.abs(window.scrollY - eng.lastProgrammaticScrollY) > 14) {
          stopTour("Tour stopped");
        } else {
          const elapsed = now - eng.tourStartedAt;
          const rawT = Math.min(1, elapsed / eng.tourDurationMs);
          const eased = tourProgressCurve(rawT);
          const nextY =
            eng.tourStartY + (eng.tourTargetY - eng.tourStartY) * eased;
          eng.lastProgrammaticScrollY = nextY;
          window.scrollTo(0, nextY);
          eng.needsScrollAudit = true;

          if (rawT >= 1) {
            stopTour("Tour complete");
          }
        }
      }

      // 2. Run build orchestrator tick when agents are enabled, booted, and not paused
      if (eng.agentsOn && !eng.booting && !eng.paused) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const activeCursorCount = eng.isMobile ? 6 : 12;

        // Batched DOM READ phase
        if (eng.needsScrollAudit) {
          eng.needsScrollAudit = false;
          const atPageBottom =
            window.scrollY + vh >= document.documentElement.scrollHeight - 28;

          for (const target of eng.targets) {
            if (target.state === "built") continue;
            const rect = target.el.getBoundingClientRect();

            if (rect.bottom < -4) {
              // Already scrolled past -> instant reveal!
              if (target.state === "building") {
                const slotIdx = eng.slots.findIndex(
                  (s) => s && s.target === target
                );
                if (slotIdx !== -1) {
                  eng.slots[slotIdx] = null;
                  hideWireframe(slotIdx);
                }
              }
              const qIdx = eng.pending.indexOf(target);
              if (qIdx !== -1) eng.pending.splice(qIdx, 1);
              finishTargetInstant(target);
              eng.observer?.unobserve(target.el);
            } else if (
              target.state === "unbuilt" &&
              (rect.top < vh + 24 || atPageBottom)
            ) {
              enqueueTarget(target);
              eng.observer?.unobserve(target.el);
            }
          }
        }

        // Read bounding rects ONLY for currently active slots (max 6)
        for (let sIdx = 0; sIdx < MAX_CONCURRENT_BUILDS; sIdx++) {
          const slot = eng.slots[sIdx];
          if (!slot) continue;
          const r = slot.target.el.getBoundingClientRect();
          slot.rect = {
            left: r.left,
            top: r.top,
            width: Math.max(8, r.width),
            height: Math.max(8, r.height),
          };
        }

        // Assign pending elements (in strict reading order) to free slots (max 6 concurrent)
        const busyAgents = new Set<number>();
        for (const s of eng.slots) {
          if (s) busyAgents.add(s.agentIndex);
        }

        for (let sIdx = 0; sIdx < MAX_CONCURRENT_BUILDS; sIdx++) {
          if (eng.slots[sIdx] !== null || eng.pending.length === 0) continue;
          const nextTarget = eng.pending.shift()!;
          if (nextTarget.state === "built") continue;

          const r = nextTarget.el.getBoundingClientRect();
          if (r.bottom < -4) {
            finishTargetInstant(nextTarget);
            continue;
          }

          // Pick closest available idle cursor from active roster
          let chosenAgent = -1;
          let bestDist = Infinity;
          for (let a = 0; a < activeCursorCount; a++) {
            if (busyAgents.has(a)) continue;
            const c = eng.cursors[a];
            const dx = c.x - r.left;
            const dy = c.y - r.top;
            const d = dx * dx + dy * dy;
            if (d < bestDist) {
              bestDist = d;
              chosenAgent = a;
            }
          }
          if (chosenAgent === -1) break;

          busyAgents.add(chosenAgent);
          nextTarget.state = "building";

          let revealDuration = 260;
          if (nextTarget.mode === "type") {
            const { slices, total } = collectTextNodes(nextTarget.el);
            nextTarget.textSlices = slices;
            nextTarget.totalChars = total;
            revealDuration = Math.min(540, Math.max(200, total * 7));
          } else if (nextTarget.mode === "wipe") {
            revealDuration = 380;
          }

          eng.slots[sIdx] = {
            slotIndex: sIdx,
            target: nextTarget,
            agentIndex: chosenAgent,
            phase: "glide",
            elapsedMs: 0,
            glideDuration: 200,
            dragDuration: 185,
            revealDuration,
            fadeDuration: 130,
            startX: eng.cursors[chosenAgent].x,
            startY: eng.cursors[chosenAgent].y,
            rect: {
              left: r.left,
              top: r.top,
              width: Math.max(8, r.width),
              height: Math.max(8, r.height),
            },
          };
        }

        // Advance active build slots & write DOM updates
        let anyActiveWork = false;
        for (let sIdx = 0; sIdx < MAX_CONCURRENT_BUILDS; sIdx++) {
          const slot = eng.slots[sIdx];
          if (!slot) continue;
          anyActiveWork = true;
          slot.elapsedMs += dtMs;

          const wf = wireframeRefs.current[sIdx];
          const wfLabel = wireframeLabelRefs.current[sIdx];
          const cursor = eng.cursors[slot.agentIndex];
          const agentCfg = AGENT_ROSTER[slot.agentIndex];
          const { left, top, width, height } = slot.rect;

          cursor.opacity = 1;

          if (slot.phase === "glide") {
            const p = Math.min(1, slot.elapsedMs / slot.glideDuration);
            const e = easeOutCubic(p);
            cursor.x = slot.startX + (left - slot.startX) * e;
            cursor.y = slot.startY + (top - slot.startY) * e;
            if (wf) {
              wf.style.opacity = "0";
            }
            if (p >= 1) {
              slot.phase = "drag";
              slot.elapsedMs = 0;
              if (wfLabel) {
                wfLabel.textContent = `${agentCfg.name.toUpperCase()} · ${slot.target.label}`;
              }
            }
          } else if (slot.phase === "drag") {
            const p = Math.min(1, slot.elapsedMs / slot.dragDuration);
            const e = easeInOutCubic(p);
            const curW = Math.max(2, width * e);
            const curH = Math.max(2, height * e);
            cursor.x = left + curW;
            cursor.y = top + curH;

            if (wf) {
              wf.style.opacity = "1";
              wf.style.transform = `translate3d(${left}px, ${top}px, 0)`;
              wf.style.width = `${curW}px`;
              wf.style.height = `${curH}px`;
            }

            if (p >= 1) {
              slot.phase = "reveal";
              slot.elapsedMs = 0;
              const el = slot.target.el;
              el.setAttribute("data-building", "true");

              if (slot.target.mode === "type" && slot.target.textSlices) {
                el.style.minHeight = `${height}px`;
                if (!slot.target.hadAriaLabel) {
                  const fullJoined = slot.target.textSlices
                    .map((s) => s.full)
                    .join("");
                  el.setAttribute("aria-label", fullJoined);
                }
                for (const s of slot.target.textSlices) {
                  s.node.nodeValue = "";
                }
              } else if (slot.target.mode === "pop") {
                el.style.opacity = "0";
                el.style.transform = "translate3d(0, 10px, 0) scale(0.95)";
              } else if (slot.target.mode === "wipe") {
                el.style.clipPath = "inset(0 100% 0 0)";
              }
            }
          } else if (slot.phase === "reveal") {
            const p = Math.min(1, slot.elapsedMs / slot.revealDuration);
            const el = slot.target.el;

            if (wf) {
              wf.style.opacity = "1";
              wf.style.transform = `translate3d(${left}px, ${top}px, 0)`;
              wf.style.width = `${width}px`;
              wf.style.height = `${height}px`;
            }

            if (slot.target.mode === "type" && slot.target.textSlices) {
              const targetCount = Math.floor(slot.target.totalChars * p);
              let remaining = targetCount;
              for (const slice of slot.target.textSlices) {
                if (remaining <= 0) {
                  slice.node.nodeValue = "";
                } else if (remaining >= slice.full.length) {
                  slice.node.nodeValue = slice.full;
                  remaining -= slice.full.length;
                } else {
                  slice.node.nodeValue = slice.full.slice(0, remaining);
                  remaining = 0;
                }
              }
              cursor.x = Math.min(
                vw - 90,
                left + Math.min(width, 24 + width * easeOutCubic(p))
              );
              cursor.y = top + Math.min(height, Math.max(12, height * 0.65));
            } else if (slot.target.mode === "pop") {
              const e = easeOutBack(p);
              const inv = 1 - Math.min(1, p * 1.15);
              el.style.opacity = `${Math.min(1, p * 1.35)}`;
              el.style.transform = `translate3d(0, ${(10 * inv).toFixed(2)}px, 0) scale(${(
                0.95 +
                0.05 * e
              ).toFixed(4)})`;
              cursor.x = Math.min(vw - 90, left + width + 6);
              cursor.y = Math.max(18, top - 6);
            } else {
              // wipe left to right
              const e = easeOutCubic(p);
              const rightInset = Math.max(0, 100 * (1 - e));
              el.style.clipPath = `inset(0 ${rightInset.toFixed(2)}% 0 0)`;
              cursor.x = Math.min(vw - 80, left + width * e);
              cursor.y = top + height * 0.5;
            }

            if (p >= 1) {
              finishTargetInstant(slot.target);
              slot.phase = "fade";
              slot.elapsedMs = 0;
            }
          } else if (slot.phase === "fade") {
            const p = Math.min(1, slot.elapsedMs / slot.fadeDuration);
            if (wf) {
              wf.style.opacity = `${(1 - p).toFixed(2)}`;
              wf.style.transform = `translate3d(${left}px, ${top}px, 0)`;
              wf.style.width = `${width}px`;
              wf.style.height = `${height}px`;
            }
            if (p >= 1) {
              hideWireframe(sIdx);
              eng.slots[sIdx] = null;
            }
          }
        }

        // Check if hero finished so pending Tour can launch smoothly
        if (eng.tourPending && !eng.tourRunning) {
          const heroTargets = eng.targets.filter((t) => t.section === "hero");
          const heroDone =
            heroTargets.length > 0 && heroTargets.every((t) => t.state === "built");
          if (heroDone) {
            beginTourAutoScroll();
          }
        }

        // Idle patrol for non-busy cursors
        if (anyActiveWork || eng.pending.length > 0) {
          eng.idleSeconds = 0;
        } else {
          eng.idleSeconds += dtMs / 1000;
        }

        for (let a = 0; a < activeCursorCount; a++) {
          if (busyAgents.has(a)) continue;
          const c = eng.cursors[a];
          c.idleTimer -= dtMs / 1000;
          if (c.idleTimer <= 0) {
            c.idleTimer = 1.8 + ((a * 0.37) % 1.4);
            const angle = now * 0.0006 + c.idleSeed;
            // Keep idle cursors along safe outer margins/corners so content stays unobstructed
            const zone = a % 4;
            if (zone === 0) {
              c.idleTargetX = Math.max(16, vw * 0.03 + Math.cos(angle) * 18);
              c.idleTargetY = Math.max(84, Math.min(vh - 110, vh * (0.18 + ((a * 0.19) % 0.6))));
            } else if (zone === 1) {
              c.idleTargetX = Math.min(vw - 110, vw * 0.91 + Math.sin(angle) * 16);
              c.idleTargetY = Math.max(84, Math.min(vh - 110, vh * (0.2 + ((a * 0.23) % 0.58))));
            } else if (zone === 2) {
              c.idleTargetX = Math.max(24, Math.min(vw - 110, vw * (0.12 + ((a * 0.17) % 0.72))));
              c.idleTargetY = 74 + Math.sin(angle) * 12;
            } else {
              c.idleTargetX = Math.max(24, Math.min(vw - 110, vw * (0.14 + ((a * 0.21) % 0.68))));
              c.idleTargetY = Math.max(96, vh - 112 + Math.cos(angle) * 14);
            }
          }
          const lerp = Math.min(1, (dtMs / 1000) * 3.0);
          c.x += (c.idleTargetX - c.x) * lerp;
          c.y += (c.idleTargetY - c.y) * lerp;
          // Dim subtly after sitting completely idle so reading stays effortless
          const targetOpacity = eng.idleSeconds > 1.2 ? 0.36 : 0.85;
          c.opacity += (targetOpacity - c.opacity) * Math.min(1, (dtMs / 1000) * 4);
        }

        // Write cursor DOM transforms
        for (let i = 0; i < AGENT_ROSTER.length; i++) {
          const dom = cursorRefs.current[i];
          if (!dom) continue;
          if (i >= activeCursorCount) {
            dom.style.opacity = "0";
            continue;
          }
          const c = eng.cursors[i];
          dom.style.opacity = c.opacity.toFixed(2);
          dom.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(
            1
          )}px, 0)`;
        }
      }

      eng.rafId = window.requestAnimationFrame(tick);
    };

    eng.rafId = window.requestAnimationFrame(tick);

    return () => {
      if (bootTimer) window.clearTimeout(bootTimer);
      if (eng.rafId !== null) window.cancelAnimationFrame(eng.rafId);
      eng.observer?.disconnect();
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheelOrTouch);
      window.removeEventListener("touchstart", onWheelOrTouch);
    };
  }, [beginTourAutoScroll, enqueueTarget, hideWireframe, startBuildEngine, stopTour]);

  const handleTogglePause = useCallback(() => {
    const eng = engineRef.current;
    const nextPaused = !eng.paused;
    eng.paused = nextPaused;
    setPaused(nextPaused);
    document.documentElement.dataset.paused = nextPaused ? "true" : "false";
    setStatusMessage(nextPaused ? "Animations paused" : "Animations resumed");
  }, []);

  const handleToggleAgents = useCallback(() => {
    const eng = engineRef.current;
    const next = !eng.agentsOn;
    eng.agentsOn = next;
    setAgentsOn(next);

    const doc = document.documentElement;
    doc.dataset.agents = next ? "on" : "off";

    try {
      window.localStorage.setItem("portfolio-agents", next ? "on" : "off");
    } catch {
      // Ignore storage errors in restricted environments
    }

    // Keep URL clean or synced if ?agents= was set
    const url = new URL(window.location.href);
    if (url.searchParams.has("agents")) {
      url.searchParams.set("agents", next ? "on" : "off");
      window.history.replaceState({}, "", url.toString());
    }

    if (!next) {
      doc.dataset.agentsForced = "false";
      completeEverythingNow();
      setStatusMessage("Build agents turned off");
    } else {
      doc.dataset.agentsForced = "true";
      if (eng.paused) {
        eng.paused = false;
        setPaused(false);
        doc.dataset.paused = "false";
      }
      startBuildEngine(true);
      setStatusMessage("Build agents turned on");
    }
  }, [completeEverythingNow, startBuildEngine]);

  const handleStartTour = useCallback(() => {
    try {
      window.sessionStorage.setItem("portfolio-tour", "pending");
      window.localStorage.setItem("portfolio-agents", "on");
    } catch {
      // Ignore storage errors
    }
    const url = new URL(window.location.href);
    if (url.searchParams.get("agents") === "off") {
      url.searchParams.set("agents", "on");
      window.location.href = url.toString();
      return;
    }
    window.location.reload();
  }, []);

  // Keyboard shortcuts: T = tour, A = agents, P = pause, Esc = stop tour
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (engineRef.current.tourRunning || engineRef.current.tourPending) {
          stopTour("Tour stopped");
          return;
        }
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "p") {
        e.preventDefault();
        handleTogglePause();
      } else if (key === "a") {
        e.preventDefault();
        handleToggleAgents();
      } else if (key === "t") {
        e.preventDefault();
        handleStartTour();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleStartTour, handleToggleAgents, handleTogglePause, stopTour]);

  // Roving tabindex fallback for role="toolbar" when native focusgroup is unsupported
  useEffect(() => {
    const bar = toolbarRef.current;
    if (!bar) return;
    if ("focusGroup" in HTMLElement.prototype) return;

    const buttons = Array.from(bar.querySelectorAll<HTMLButtonElement>("button"));
    if (buttons.length === 0) return;

    buttons.forEach((b, idx) => {
      b.tabIndex = idx === 0 ? 0 : -1;
    });

    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLButtonElement;
      if (!buttons.includes(target)) return;
      buttons.forEach((b) => {
        b.tabIndex = b === target ? 0 : -1;
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const current = document.activeElement as HTMLButtonElement | null;
      const idx = current ? buttons.indexOf(current) : -1;
      if (idx === -1) return;

      const rtl = getComputedStyle(bar).direction === "rtl";
      let step = 0;
      if (e.key === "ArrowRight") step = rtl ? -1 : 1;
      else if (e.key === "ArrowLeft") step = rtl ? 1 : -1;
      else if (e.key === "Home") {
        e.preventDefault();
        buttons[0].focus();
        return;
      } else if (e.key === "End") {
        e.preventDefault();
        buttons[buttons.length - 1].focus();
        return;
      } else {
        return;
      }

      e.preventDefault();
      const nextIdx = (idx + step + buttons.length) % buttons.length;
      buttons[nextIdx].focus();
    };

    bar.addEventListener("focusin", onFocusIn);
    bar.addEventListener("keydown", onKeyDown);
    return () => {
      bar.removeEventListener("focusin", onFocusIn);
      bar.removeEventListener("keydown", onKeyDown);
    };
  }, [tourActive]);

  const activeAgentLabel = isMobile ? "6 BUILD AGENTS" : "12 BUILD AGENTS";

  return (
    <>
      {/* Short Boot Loader (immediately visible pre-hydration via html.booting CSS) */}
      <div
        className={`boot-loader fixed inset-0 z-[60] flex-col items-center justify-center gap-4 bg-[#09090b] transition-opacity duration-200 ${
          bootVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-live="polite"
      >
        <progress
          aria-label="Initializing portfolio build agents"
          className="boot-spinner"
        />
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-200">
            Booting {activeAgentLabel}
          </p>
          <p className="font-mono text-[11px] text-zinc-500">
            Scout · Layout · Typeset · Motion · QA · Deploy
          </p>
        </div>
      </div>

      {/* Blue Wireframe Box Pool (max 6 concurrent builds) */}
      <div
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: MAX_CONCURRENT_BUILDS }).map((_, idx) => (
          <div
            key={idx}
            ref={(el) => {
              wireframeRefs.current[idx] = el;
            }}
            className="fixed top-0 left-0 border border-blue-500/90 bg-blue-500/[0.05] will-change-transform"
            style={{
              opacity: 0,
              width: 0,
              height: 0,
              transform: "translate3d(-9999px, -9999px, 0)",
            }}
          >
            {/* 4 crisp blue corner handles */}
            <span className="absolute -top-[3px] -left-[3px] h-1.5 w-1.5 bg-blue-400" />
            <span className="absolute -top-[3px] -right-[3px] h-1.5 w-1.5 bg-blue-400" />
            <span className="absolute -bottom-[3px] -left-[3px] h-1.5 w-1.5 bg-blue-400" />
            <span className="absolute -bottom-[3px] -right-[3px] h-1.5 w-1.5 bg-blue-400" />

            {/* Small blue label tag */}
            <span
              ref={(el) => {
                wireframeLabelRefs.current[idx] = el;
              }}
              className="absolute -top-5 left-0 whitespace-nowrap bg-blue-600 px-1.5 py-0.5 font-mono text-[9px] font-semibold leading-none tracking-wider text-white"
            >
              BUILD
            </span>
          </div>
        ))}
      </div>

      {/* Robot Cursor Layer (12 desktop, 6 on phones) */}
      <div
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
        aria-hidden="true"
      >
        {AGENT_ROSTER.map((agent, idx) => (
          <RobotCursor
            key={agent.id}
            agent={agent}
            innerRef={(el) => {
              cursorRefs.current[idx] = el;
            }}
          />
        ))}
      </div>

      {/* Screen-reader live region outside toolbar */}
      <p role="status" className="visually-hidden">
        {statusMessage}
      </p>

      {/* Compact Bottom Controls Dock (solid zinc matte, no glass card) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] sm:bottom-5">
        <div
          ref={toolbarRef}
          role="toolbar"
          {...({ focusgroup: "toolbar wrap" } as Record<string, string>)}
          aria-label="Portfolio build and playback controls"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#111114] p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.78)]"
        >
          {/* Pause / Resume */}
          <button
            type="button"
            onClick={handleTogglePause}
            aria-label={paused ? "Resume animations" : "Pause animations"}
            title={paused ? "Resume (P)" : "Pause (P)"}
            className="btn-secondary min-h-9 px-2.5 py-1.5 text-xs sm:px-3"
          >
            {paused ? (
              <Play className="h-3.5 w-3.5 text-[#ff3b2f]" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5 text-zinc-300" aria-hidden="true" />
            )}
            <span>{paused ? "Resume" : "Pause"}</span>
            <kbd className="hidden rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 font-mono text-[10px] leading-none text-zinc-400 sm:inline-block">
              P
            </kbd>
          </button>

          <span
            role="separator"
            aria-orientation="vertical"
            className="h-5 w-px border-l border-zinc-800"
          />

          {/* Agents On / Off toggle */}
          <button
            type="button"
            onClick={handleToggleAgents}
            aria-pressed={agentsOn}
            aria-label="Build agents"
            title="Toggle build agents (A)"
            className={`btn-secondary min-h-9 px-2.5 py-1.5 text-xs sm:px-3 ${
              agentsOn
                ? "border-[#ff3b2f]/60 bg-[#18181b] text-zinc-100"
                : "text-zinc-400"
            }`}
          >
            <Bot
              className={`h-3.5 w-3.5 ${
                agentsOn ? "text-[#ff3b2f]" : "text-zinc-500"
              }`}
              aria-hidden="true"
            />
            <span>Agents</span>
            <span
              className={`rounded px-1 py-0.5 font-mono text-[10px] font-semibold uppercase leading-none ${
                agentsOn
                  ? "bg-[#ff3b2f]/15 text-[#ff3b2f]"
                  : "bg-zinc-800 text-zinc-400"
              }`}
              aria-hidden="true"
            >
              {agentsOn ? "On" : "Off"}
            </span>
            <kbd className="hidden rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 font-mono text-[10px] leading-none text-zinc-400 sm:inline-block">
              A
            </kbd>
          </button>

          <span
            role="separator"
            aria-orientation="vertical"
            className="h-5 w-px border-l border-zinc-800"
          />

          {/* Tour action / Stop Tour when running */}
          {tourActive ? (
            <button
              type="button"
              onClick={() => stopTour("Tour stopped")}
              aria-label="Stop tour"
              title="Stop tour (Esc)"
              className="btn-primary min-h-9 px-2.5 py-1.5 text-xs sm:px-3"
            >
              <Square className="h-3 w-3 fill-current" aria-hidden="true" />
              <span>Stop</span>
              <kbd className="hidden rounded border border-zinc-950/30 bg-zinc-950/20 px-1 py-0.5 font-mono text-[10px] leading-none text-zinc-950 sm:inline-block">
                ESC
              </kbd>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartTour}
              aria-label="Start guided tour"
              title="Reload, build hero, and auto-scroll tour (T)"
              className="btn-secondary min-h-9 px-2.5 py-1.5 text-xs sm:px-3"
            >
              <Compass className="h-3.5 w-3.5 text-[#ff3b2f]" aria-hidden="true" />
              <span>Tour</span>
              <kbd className="hidden rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 font-mono text-[10px] leading-none text-zinc-400 sm:inline-block">
                T
              </kbd>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

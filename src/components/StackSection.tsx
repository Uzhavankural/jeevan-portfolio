import React from "react";
import { RESUME_DATA } from "@/data/resume";

export function StackSection() {
  const { stackTools } = RESUME_DATA;

  return (
    <section
      id="stack"
      data-section="stack"
      aria-labelledby="stack-heading"
      className="border-b border-zinc-900 bg-[#09090b] py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              data-build="type"
              data-build-label="SECTION 02"
              className="font-mono text-xs uppercase tracking-[0.22em] text-[#ff3b2f]"
            >
              02 / Tooling & Stack
            </p>
            <h2
              id="stack-heading"
              data-build="wipe"
              data-build-label="STACK · H2"
              className="mt-2 font-display text-4xl uppercase leading-none tracking-tight text-zinc-50 text-balance sm:text-5xl"
            >
              Tools I ship with
            </h2>
          </div>
          <p
            data-build="type"
            data-build-label="MARQUEE NOTE"
            className="font-mono text-xs text-zinc-400"
          >
            Every marketing, creative, AI, and web tool from my workflow · hover to pause
          </p>
        </div>
      </div>

      {/* Endless Marquee moving LEFT TO RIGHT, faded edges, pauses on hover */}
      <div
        data-build="pop"
        data-build-label="MARQUEE"
        className="marquee-wrap marquee-fade relative mt-10 overflow-hidden py-3"
      >
        <div className="marquee-track flex items-center gap-4">
          {/* Primary track */}
          <ul className="flex shrink-0 items-center gap-4 pr-4">
            {stackTools.map((tool) => (
              <li
                key={`primary-${tool.name}`}
                className="flex shrink-0 items-center gap-3 rounded-lg border border-zinc-800 bg-[#111114] px-5 py-3.5 transition-colors hover:border-[#ff3b2f]/60"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full bg-[#ff3b2f]"
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap font-sans text-sm font-medium text-zinc-100 sm:text-base">
                  {tool.name}
                </span>
                <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {tool.group}
                </span>
              </li>
            ))}
          </ul>

          {/* Seamless duplicate track hidden from assistive tech */}
          <ul
            aria-hidden="true"
            className="marquee-duplicate flex shrink-0 items-center gap-4 pr-4"
          >
            {stackTools.map((tool) => (
              <li
                key={`dup-${tool.name}`}
                className="flex shrink-0 items-center gap-3 rounded-lg border border-zinc-800 bg-[#111114] px-5 py-3.5"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff3b2f]" />
                <span className="whitespace-nowrap font-sans text-sm font-medium text-zinc-100 sm:text-base">
                  {tool.name}
                </span>
                <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {tool.group}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

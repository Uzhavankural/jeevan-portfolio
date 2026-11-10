import React from "react";
import { RESUME_DATA } from "@/data/resume";

export function RecordSection() {
  const { recordTimeline } = RESUME_DATA;

  return (
    <section
      id="record"
      data-section="record"
      aria-labelledby="record-heading"
      className="border-b border-zinc-900 bg-[#09090b] py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p
            data-build="type"
            data-build-label="SECTION 03"
            className="font-mono text-xs uppercase tracking-[0.22em] text-[#ff3b2f]"
          >
            03 / Experience & Education
          </p>
          <h2
            id="record-heading"
            data-build="wipe"
            data-build-label="RECORD · H2"
            className="mt-2 font-display text-4xl uppercase leading-none tracking-tight text-zinc-50 text-balance sm:text-6xl"
          >
            The Record
          </h2>
          <p
            data-build="type"
            data-build-label="RECORD SUB"
            className="mt-4 text-sm leading-relaxed text-zinc-400 text-pretty sm:text-base"
          >
            Chronological log of roles, launched products, and academic engineering background.
          </p>
        </div>

        {/* Vertical Timeline */}
        <ol className="relative mt-12 space-y-6 border-l border-zinc-800 pl-6 sm:pl-9">
          {recordTimeline.map((entry, idx) => (
            <li
              key={entry.id}
              data-build="pop"
              data-build-label={`ENTRY 0${idx + 1}`}
              className="relative rounded-lg border border-zinc-800 bg-[#111114] p-5 sm:p-6"
            >
              {/* Timeline marker dot */}
              <span
                aria-hidden="true"
                className="absolute -left-[31px] top-6 h-3 w-3 rounded-full border-2 border-[#09090b] bg-[#ff3b2f] sm:-left-[43px]"
              />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="rounded border border-[#ff3b2f]/40 bg-[#ff3b2f]/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#ff3b2f]">
                    {entry.kind}
                  </span>
                  <span className="font-mono text-xs text-zinc-400">
                    {entry.period}
                  </span>
                </div>
                <span className="font-mono text-xs font-medium text-zinc-300">
                  {entry.organization}
                </span>
              </div>

              <h3
                data-build="type"
                data-build-label="ROLE TITLE"
                className="mt-3 font-display text-2xl uppercase tracking-tight text-zinc-50 sm:text-3xl"
              >
                {entry.title}
              </h3>

              <p
                data-build="type"
                data-build-label="SUMMARY"
                className="mt-2 text-sm leading-relaxed text-zinc-300 text-pretty"
              >
                {entry.summary}
              </p>

              <ul className="mt-4 space-y-1.5 border-t border-zinc-800/80 pt-3.5 text-sm text-zinc-400">
                {entry.highlights.map((item, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-2.5">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-500"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

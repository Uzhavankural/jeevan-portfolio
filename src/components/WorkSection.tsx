import React from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { RESUME_DATA } from "@/data/resume";

export function WorkSection() {
  const { workSection } = RESUME_DATA;

  return (
    <section
      id="work"
      data-section="work"
      aria-labelledby="work-heading"
      className="border-b border-zinc-900 bg-[#09090b] py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Section Header: Heading + short line on left, 3 stats on right */}
        <div className="grid grid-cols-1 items-end gap-8 border-b border-zinc-800/80 pb-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p
              data-build="type"
              data-build-label="SECTION 01"
              className="font-mono text-xs uppercase tracking-[0.22em] text-[#ff3b2f]"
            >
              01 / Selected Work
            </p>
            <h2
              id="work-heading"
              data-build="wipe"
              data-build-label="WORK · H2"
              className="mt-2 font-display text-4xl uppercase leading-none tracking-tight text-zinc-50 text-balance sm:text-6xl"
            >
              {workSection.heading}
            </h2>
            <p
              data-build="type"
              data-build-label="WORK INTRO"
              className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 text-pretty sm:text-base"
            >
              {workSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:col-span-6">
            {workSection.stats.map((stat) => (
              <div
                key={stat.label}
                data-build="pop"
                data-build-label="METRIC"
                className="rounded-lg border border-zinc-800 bg-[#111114] p-3.5 sm:p-4"
              >
                <p className="font-display text-2xl tracking-tight text-zinc-50 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400 sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Text-only Project Cards (3–4 bullet points, tech chips, live/code links) */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {workSection.projects.map((project, idx) => (
            <article
              key={project.id}
              data-build="pop"
              data-build-label={`CARD 0${idx + 1}`}
              className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-[#111114] p-6 transition-colors hover:border-zinc-700"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#ff3b2f]">
                    {project.category}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400">
                    {project.period}
                  </span>
                </div>

                <h3
                  data-build="type"
                  data-build-label="PROJECT"
                  className="mt-4 font-display text-2xl uppercase leading-tight tracking-tight text-zinc-50 text-balance"
                >
                  {project.title}
                </h3>

                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-zinc-300">
                  {project.bullets.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      data-build="type"
                      data-build-label="BULLET"
                      className="flex items-start gap-2.5"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff3b2f]"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-5 border-t border-zinc-800/80">
                {/* Tech / tool chips */}
                <ul
                  data-build="pop"
                  data-build-label="CHIPS"
                  aria-label={`${project.title} stack`}
                  className="flex flex-wrap gap-1.5"
                >
                  {project.chips.map((chip) => (
                    <li
                      key={chip}
                      className="rounded border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 font-mono text-[11px] text-zinc-300"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>

                {/* Live / Code links */}
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary px-3.5 py-2 text-xs min-h-9"
                    >
                      <span>{project.liveLabel}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn-secondary px-3.5 py-2 text-xs min-h-9"
                    >
                      <span>{project.liveLabel}</span>
                    </button>
                  )}

                  {project.codeUrl ? (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-3.5 py-2 text-xs min-h-9"
                    >
                      <span>{project.codeLabel}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      title={`${project.codeLabel} — not publicly hosted`}
                      className="btn-secondary px-3.5 py-2 text-xs min-h-9"
                    >
                      <Lock className="h-3 w-3" aria-hidden="true" />
                      <span>{project.codeLabel}</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

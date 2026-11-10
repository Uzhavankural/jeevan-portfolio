import React from "react";
import { Check } from "lucide-react";
import { RESUME_DATA } from "@/data/resume";

export function AboutSection() {
  const { about, person } = RESUME_DATA;

  return (
    <section
      id="about"
      data-section="about"
      aria-labelledby="about-heading"
      className="border-b border-zinc-900 bg-[#09090b] py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left: Heading + 2 Short Paragraphs + Languages */}
          <div className="lg:col-span-6">
            <p
              data-build="type"
              data-build-label="SECTION 04"
              className="font-mono text-xs uppercase tracking-[0.22em] text-[#ff3b2f]"
            >
              04 / About & Capabilities
            </p>
            <h2
              id="about-heading"
              data-build="wipe"
              data-build-label="ABOUT · H2"
              className="mt-2 font-display text-4xl uppercase leading-none tracking-tight text-zinc-50 text-balance sm:text-6xl"
            >
              Marketer who builds
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-300 text-pretty sm:text-base">
              {about.paragraphs.map((para, pIdx) => (
                <p key={pIdx} data-build="type" data-build-label={`BIO 0${pIdx + 1}`}>
                  {para}
                </p>
              ))}
            </div>

            <div
              data-build="pop"
              data-build-label="LANGUAGES"
              className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-lg border border-zinc-800 bg-[#111114] px-4 py-2.5"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                Languages
              </span>
              {person.languages.map((lang) => (
                <span
                  key={lang.name}
                  className="font-mono text-xs text-zinc-200"
                >
                  {lang.name}{" "}
                  <span className="text-zinc-500">({lang.level})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: 9-Skill Grid */}
          <div className="lg:col-span-6">
            <h3
              data-build="type"
              data-build-label="SKILLS TITLE"
              className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400"
            >
              Core Skills
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {about.skills.map((skill, sIdx) => (
                <li
                  key={skill}
                  data-build="pop"
                  data-build-label={`SKILL 0${sIdx + 1}`}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-[#111114] px-4 py-3.5 text-sm font-medium text-zinc-100"
                >
                  <Check
                    className="h-4 w-4 shrink-0 text-[#ff3b2f]"
                    aria-hidden="true"
                  />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4 Principles I Work By */}
        <div className="mt-14 border-t border-zinc-800/80 pt-12">
          <h3
            data-build="type"
            data-build-label="PRINCIPLES"
            className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400"
          >
            4 Principles I Work By
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.principles.map((principle) => (
              <article
                key={principle.number}
                data-build="pop"
                data-build-label={`RULE ${principle.number}`}
                className="rounded-lg border border-zinc-800 bg-[#111114] p-5"
              >
                <span className="font-mono text-xs font-semibold tracking-widest text-[#ff3b2f]">
                  {principle.number}
                </span>
                <h4
                  data-build="type"
                  data-build-label="PRINCIPLE"
                  className="mt-2 font-display text-xl uppercase tracking-tight text-zinc-50"
                >
                  {principle.title}
                </h4>
                <p
                  data-build="type"
                  data-build-label="DETAIL"
                  className="mt-2 text-sm leading-relaxed text-zinc-400 text-pretty"
                >
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

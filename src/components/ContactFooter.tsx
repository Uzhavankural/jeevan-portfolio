"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Copy, Globe, Mail } from "lucide-react";
import { RESUME_DATA } from "@/data/resume";

export function ContactFooter() {
  const { person } = RESUME_DATA;
  const [copyStatus, setCopyStatus] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setCopyStatus("Email address copied to clipboard");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyStatus("Could not copy email automatically");
    }
  };

  return (
    <section
      id="contact"
      data-section="contact"
      aria-labelledby="contact-heading"
      className="bg-[#09090b] pt-20 pb-28 sm:pt-28 sm:pb-32"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Big Call-to-Action Card */}
        <div
          data-build="pop"
          data-build-label="CTA CARD"
          className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#111114] p-7 sm:p-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255, 59, 47, 0.16) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p
                data-build="type"
                data-build-label="SECTION 05"
                className="font-mono text-xs uppercase tracking-[0.22em] text-[#ff3b2f]"
              >
                05 / Contact
              </p>
              <h2
                id="contact-heading"
                data-build="wipe"
                data-build-label="CONTACT · H2"
                className="mt-3 font-display text-4xl uppercase leading-[0.95] tracking-tight text-zinc-50 text-balance sm:text-6xl"
              >
                Let&apos;s grow your next campaign or product
              </h2>
              <p
                data-build="type"
                data-build-label="CONTACT COPY"
                className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 text-pretty sm:text-base"
              >
                Open to digital marketing campaigns, Meta Ads lead generation, content strategy, and Next.js web builds. Reach out directly by email or LinkedIn.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${person.email}`}
                  className="btn-primary text-sm"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>Email Jeevan</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="btn-secondary text-sm"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[#ff3b2f]" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span>{copied ? "Copied email" : "Copy email"}</span>
                </button>
              </div>
              <p role="status" className="visually-hidden">
                {copyStatus}
              </p>
            </div>

            {/* Email + Social Links Column */}
            <div className="space-y-3 lg:col-span-5">
              <a
                href={`mailto:${person.email}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3.5 transition-colors hover:border-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ff3b2f]"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                    Email
                  </p>
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {person.email}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#ff3b2f]" aria-hidden="true" />
              </a>

              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3.5 transition-colors hover:border-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ff3b2f]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 shrink-0 text-zinc-300"
                    aria-hidden="true"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      LinkedIn
                    </p>
                    <p className="truncate text-sm font-medium text-zinc-100">
                      /in/jeevan-srinivasan
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
              </a>

              <a
                href={person.uzhavarmarketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/70 px-4 py-3.5 transition-colors hover:border-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ff3b2f]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Globe className="h-4 w-4 shrink-0 text-zinc-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Live Build
                    </p>
                    <p className="truncate text-sm font-medium text-zinc-100">
                      uzhavarmarket.netlify.app
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-zinc-900 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p className="font-mono">
            {person.name} · {person.city}
          </p>
          <p className="font-mono">
            Shortcuts: <span className="text-zinc-300">T</span> Tour ·{" "}
            <span className="text-zinc-300">A</span> Agents ·{" "}
            <span className="text-zinc-300">P</span> Pause
          </p>
        </footer>
      </div>
    </section>
  );
}

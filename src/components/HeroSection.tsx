import React from "react";
import { ArrowDownRight, MapPin } from "lucide-react";
import { RESUME_DATA } from "@/data/resume";

export function HeroSection() {
  const { person, heroStats } = RESUME_DATA;

  return (
    <section
      data-section="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-dvh flex-col justify-between overflow-x-clip border-b border-zinc-900 bg-[#09090b]"
    >
      {/* Top minimal navigation header */}
      <header
        data-build="pop"
        data-build-label="HEADER"
        className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 pt-5 pb-3 sm:px-8"
      >
        <a
          href="#top"
          className="inline-flex shrink-0 items-center gap-2 font-display text-2xl tracking-wide text-zinc-100 transition-colors hover:text-[#ff3b2f]"
          aria-label="Jeevan Srinivasan home"
        >
          <span>JS</span>
          <span className="h-2 w-2 rounded-full bg-[#ff3b2f]" aria-hidden="true" />
        </a>

        <nav aria-label="Primary" className="flex flex-wrap items-center justify-end gap-0.5 sm:gap-2">
          {[
            { href: "#work", label: "Work" },
            { href: "#stack", label: "Stack" },
            { href: "#record", label: "Record" },
            { href: "#about", label: "About" },
            { href: "#contact", label: "Contact" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-1.5 py-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100 active:scale-[0.97] sm:px-3 sm:text-xs"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Hero Stage */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pt-4 pb-24 sm:px-8 lg:pt-8 lg:pb-28">
        {/* Giant PORTFOLIO backdrop + Centered Headshot Stage (Desktop behind/center, Mobile top frame) */}
        <div className="relative flex flex-col items-center lg:pointer-events-none lg:absolute lg:inset-0 lg:justify-end">
          {/* Giant PORTFOLIO metallic gradient word behind portrait */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none text-center lg:absolute lg:inset-x-0 lg:top-[5%]"
          >
            <p
              data-build="wipe"
              data-build-label="PORTFOLIO"
              className="hero-portfolio-word font-display uppercase"
            >
              PORTFOLIO
            </p>
          </div>

          {/* Portrait + Soft red radial glow */}
          <div className="relative -mt-6 flex w-full max-w-[300px] items-end justify-center sm:-mt-10 sm:max-w-[350px] lg:mt-0 lg:max-w-[380px] xl:max-w-[440px]">
            <div
              data-build="pop"
              data-build-label="PORTRAIT"
              className="relative z-10 w-full"
            >
              {/* Soft red radial glow under/behind centered portrait */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[-20%] bottom-[6%] top-[14%] rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 58%, rgba(255, 59, 47, 0.34) 0%, rgba(255, 59, 47, 0.12) 45%, transparent 74%)",
                }}
              />
              <img
                src="/headshot.png"
                alt="Black and white portrait of Jeevan Srinivasan in a black blazer"
                width={1122}
                height={1402}
                fetchPriority="high"
                decoding="async"
                className="headshot-fade relative z-10 mx-auto block h-auto w-full max-h-[380px] object-contain object-bottom grayscale contrast-[1.18] brightness-[0.98] sm:max-h-[440px] lg:max-h-[76dvh]"
              />
              {/* Bottom fallback gradient for browsers without mask-image */}
              <div
                aria-hidden="true"
                className="headshot-fade-fallback pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden h-28 bg-gradient-to-t from-[#09090b] to-transparent"
              />
            </div>
          </div>
        </div>

        {/* Left & Right Editorial Content */}
        <div className="relative z-20 -mt-8 grid grid-cols-1 items-end gap-8 lg:mt-0 lg:grid-cols-12 lg:gap-6">
          {/* Left Column */}
          <div className="flex flex-col items-start gap-3.5 lg:col-span-4">
            <p
              data-build="type"
              data-build-label="GREETING"
              className="font-script text-3xl leading-none text-zinc-200 sm:text-4xl"
            >
              {person.greeting}
            </p>

            <h1
              id="hero-heading"
              tabIndex={-1}
              data-build="wipe"
              data-build-label="NAME · H1"
              className="font-display text-5xl uppercase leading-[0.92] tracking-tight text-zinc-50 text-balance sm:text-6xl xl:text-7xl"
            >
              {person.name}
            </h1>

            <p
              data-build="type"
              data-build-label="ROLE"
              className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#ff3b2f] sm:text-sm"
            >
              {person.role}
            </p>

            <p
              data-build="type"
              data-build-label="BIO"
              className="max-w-sm text-sm leading-relaxed text-zinc-300 text-pretty sm:text-base"
            >
              {person.heroBio}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div data-build="pop" data-build-label="CTA">
                <a href="#work" className="btn-primary text-sm">
                  <span>View work</span>
                  <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <p
                data-build="type"
                data-build-label="CITY"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400"
              >
                <MapPin className="h-3.5 w-3.5 text-[#ff3b2f]" aria-hidden="true" />
                <span>Based in {person.city}</span>
              </p>
            </div>
          </div>

          {/* Center spacer for portrait on lg+ */}
          <div className="hidden lg:col-span-4 lg:block" aria-hidden="true" />

          {/* Right Column: 3 Real Stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-4 lg:ml-auto lg:w-full lg:max-w-[280px] lg:grid-cols-1">
            {heroStats.map((stat, idx) => (
              <div
                key={stat.label}
                data-build="pop"
                data-build-label={`STAT 0${idx + 1}`}
                className="rounded-lg border border-zinc-800 bg-[#111114] px-4 py-3.5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-3xl tracking-tight text-zinc-50 sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff3b2f]">
                    0{idx + 1}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs font-medium uppercase tracking-wider text-zinc-200">
                  {stat.label}
                </p>
                {stat.detail ? (
                  <p className="mt-0.5 text-xs text-zinc-400">{stat.detail}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

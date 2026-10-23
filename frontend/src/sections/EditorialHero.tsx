import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Stamp } from '../design-system/Stamp';
import { Marquee } from '../design-system/Marquee';
import type { DemoProfile } from '../types/swarm';

gsap.registerPlugin(ScrollTrigger);

interface EditorialHeroProps {
  onStart: () => void;
  onLoadDemo: (profile: DemoProfile) => void;
  demoProfiles: DemoProfile[];
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  onStart,
  onLoadDemo,
  demoProfiles,
}) => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.reveal-word');
      gsap.fromTo(
        words,
        { y: '105%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1.1,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.15,
        }
      );
    }

    if (underlineRef.current) {
      const length = underlineRef.current.getTotalLength();
      gsap.set(underlineRef.current, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(underlineRef.current, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.out',
        delay: 0.8,
      });
    }
  }, []);

  return (
    <div className="w-full">
      {/* Editorial Hero Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (8 cols): Giant Left-Aligned Serif Headline */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-3">
              <span className="font-mono-ledger text-xs uppercase tracking-widest text-cobalt dark:text-cobalt-dark font-semibold">
                01 / AUTONOMOUS DOSSIER INITIATIVE
              </span>
              <span className="h-px w-12 bg-hairline dark:bg-night-hairline" />
              <Stamp text="STATUS: OPERATIONAL" variant="emerald" size="sm" rotation={0} />
            </div>

            <h1
              ref={headlineRef}
              className="font-display text-5xl sm:text-7xl lg:text-[5.8rem] font-normal tracking-tightest leading-[0.92] text-ink dark:text-night-bone"
            >
              <span className="block overflow-hidden">
                <span className="reveal-word inline-block mr-3">Seven</span>
                <span className="reveal-word inline-block mr-3">agents.</span>
                <span className="reveal-word inline-block mr-3">One</span>
                <span className="reveal-word inline-block">student.</span>
              </span>
              <span className="block overflow-hidden mt-2">
                <span className="reveal-word inline-block mr-3">A</span>
                <span className="reveal-word inline-block mr-3">future,</span>
                <span className="reveal-word inline-block relative italic text-cobalt dark:text-cobalt-dark mr-3">
                  fully researched.
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 overflow-visible pointer-events-none"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <path
                      ref={underlineRef}
                      d="M2 9C75 3 225 1 298 7"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-ink-muted dark:text-night-muted max-w-2xl leading-relaxed pt-2">
              ScholarSwarm is an autonomous research bureau. When a candidate uploads credentials,
              seven specialized agents crawl accredited institutions across Canada, Germany, and
              Singapore, evaluate criteria with strict evidentiary citations, and draft a fact-checked statement of purpose.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="pt-4 flex flex-wrap items-center gap-8 font-mono-ledger text-xs">
              <button
                onClick={onStart}
                data-cursor="LAUNCH"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-cobalt hover:bg-cobalt-hover text-white font-semibold uppercase tracking-widest transition-colors duration-200 shadow-sm"
              >
                <span>OPEN CASE INTAKE</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button
                onClick={() => {
                  const rahul = demoProfiles.find((p) => p.id === 'rahul') || demoProfiles[0];
                  if (rahul) onLoadDemo(rahul);
                }}
                data-cursor="INSPECT"
                className="text-ink dark:text-night-bone underline decoration-hairline hover:decoration-cobalt hover:text-cobalt transition-colors uppercase tracking-widest underline-offset-8"
              >
                Inspect Sample Case File (Rahul / 8.2 CGPA)
              </button>
            </div>
          </div>

          {/* Right Column (4 cols): Case File Index List */}
          <div className="lg:col-span-4 border border-hairline dark:border-night-hairline p-6 bg-white dark:bg-night-sheet shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-hairline dark:border-night-hairline font-mono-ledger text-[11px] uppercase tracking-widest text-ink-muted dark:text-night-muted">
              <span>INDEX: CANDIDATE FILES</span>
              <span>3 PROFILES</span>
            </div>

            <p className="text-xs text-ink-muted dark:text-night-muted mt-3 mb-4 leading-normal">
              Select a candidate case to observe autonomous multi-agent verification across diverse academic disciplines:
            </p>

            <div className="space-y-3 font-mono-ledger text-xs">
              {demoProfiles.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => onLoadDemo(p)}
                  data-cursor="SELECT"
                  className="p-3 border border-hairline dark:border-night-hairline hover:border-cobalt dark:hover:border-cobalt bg-canvas dark:bg-night-bg cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink dark:text-night-bone group-hover:text-cobalt transition-colors">
                      CASE 0{idx + 1} — {p.name.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-cobalt dark:text-cobalt-dark font-semibold">
                      GPA {p.cgpa}
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-muted dark:text-night-muted truncate mt-1">
                    {p.education_level}
                  </div>
                  <div className="text-[10px] text-ink-faint dark:text-night-muted/60 mt-1 uppercase">
                    Target: {p.target_countries.join(' • ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-hairline dark:border-night-hairline text-[10px] font-mono-ledger text-ink-muted dark:text-night-muted">
              [ 100% UNSTRUCTURED TEXT ADAPTABLE / ZERO CODE CHANGES ]
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker of Real Portals */}
      <Marquee />

      {/* Editorial Numbered "How It Operates" Grid */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-20 border-b border-hairline dark:border-night-hairline">
        <div className="flex items-center gap-3 mb-12">
          <span className="font-mono-ledger text-xs uppercase tracking-widest text-ink-muted dark:text-night-muted">
            02 / BUREAU METHODOLOGY
          </span>
          <span className="h-px flex-1 bg-hairline dark:bg-night-hairline" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3 border-t-2 border-ink dark:border-night-bone pt-4">
            <span className="font-display text-4xl text-cobalt dark:text-cobalt-dark block">01</span>
            <h3 className="font-display text-2xl font-normal text-ink dark:text-night-bone">
              Document Ingestion & Proof
            </h3>
            <p className="font-sans text-sm text-ink-muted dark:text-night-muted leading-relaxed">
              Resumes and academic transcripts are parsed mathematically. CGPA is normalized against WES tables (both 10.0 and 4.0 scales). GitHub repositories are inspected directly for code commits, eliminating self-reported fluff.
            </p>
          </div>

          <div className="space-y-3 border-t-2 border-ink dark:border-night-bone pt-4">
            <span className="font-display text-4xl text-cobalt dark:text-cobalt-dark block">02</span>
            <h3 className="font-display text-2xl font-normal text-ink dark:text-night-bone">
              Live Official Crawler & Criteria Audit
            </h3>
            <p className="font-sans text-sm text-ink-muted dark:text-night-muted leading-relaxed">
              Scouts crawl verified governmental (.gc.ca, daad.de) and university domains. Trafilatura extracts requirements to test 5 explicit criteria: GPA minimum, degree match, field focus, nationality eligibility, and IELTS/TOEFL requirements.
            </p>
          </div>

          <div className="space-y-3 border-t-2 border-ink dark:border-night-bone pt-4">
            <span className="font-display text-4xl text-cobalt dark:text-cobalt-dark block">03</span>
            <h3 className="font-display text-2xl font-normal text-ink dark:text-night-bone">
              Adversarial Synthesis & SOP Studio
            </h3>
            <p className="font-sans text-sm text-ink-muted dark:text-night-muted leading-relaxed">
              A Critic Agent executes adversarial checks against hallucinated claims. The top 5 matches are presented in a dossier sheet with exact evidence quotes, and an admissions Statement of Purpose is compiled with paragraph-level fact-checking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

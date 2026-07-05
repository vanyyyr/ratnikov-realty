"use client";

import { Badge } from "@/components/ui/badge";
import FadeIn from "./FadeIn";

interface Case {
  id: string;
  title: string;
  text: string;
  result: string | null;
}

interface CasesProps {
  label: string;
  title: string;
  cases: Case[];
}

export default function Cases({ label, title, cases }: CasesProps) {
  return (
    <section id="cases" className="py-20 sm:py-28 bg-card">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-14">
          <SectionLabel>{label}</SectionLabel>
          <SectionHeading>{title}</SectionHeading>
        </FadeIn>
        <div className="grid sm:grid-cols-2 gap-5">
          {cases.map((c, idx) => (
            <FadeIn key={c.id} delay={idx * 0.08}>
              <div className="border border-border/40 rounded-xl p-6 bg-background hover:border-brand/20 transition-colors h-full">
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                  {c.text}
                </p>
                {c.result && (
                  <Badge className="bg-brand-light text-brand border-brand/20 text-xs">
                    {c.result}
                  </Badge>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-4">
      <span className="block w-6 h-[1.5px] bg-brand rounded-full" />
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {children}
    </h2>
  );
}

"use client";

import FadeIn from "./FadeIn";

interface Service {
  title: string;
  text: string;
}

interface AboutProps {
  label: string;
  title: string;
  description: string;
  servicesTitle: string;
  services: Service[];
  setlTitle: string;
  setText: string;
  partner: string;
}

export default function About({
  label,
  title,
  description,
  servicesTitle,
  services,
  setlTitle,
  setText,
  partner,
}: AboutProps) {
  return (
    <section id="about" className="pt-28 sm:pt-32 pb-20 sm:pb-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <FadeIn>
          <SectionLabel>{label}</SectionLabel>
          <SectionHeading className="mb-6">{title}</SectionHeading>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-[15px] sm:text-base leading-relaxed mb-14 max-w-3xl">
            {description}
          </p>
        </FadeIn>

        {/* Services — более свободный layout, не cookie-cutter 2x2 */}
        <div className="space-y-6 mb-14">
          <FadeIn delay={0.15}>
            <h3 className="text-lg font-semibold text-foreground">
              {servicesTitle}
            </h3>
          </FadeIn>
          {services.map((item, i) => (
            <FadeIn key={i} delay={0.2 + i * 0.05}>
              <ServiceCard item={item} index={i} />
            </FadeIn>
          ))}
        </div>

        {/* Setl Group */}
        <FadeIn delay={0.3}>
          <div className="border border-border/60 rounded-xl p-6 sm:p-7 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {setlTitle}
              </h3>
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-brand bg-brand-light px-2.5 py-1 rounded-md">
                {partner}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{setText}</p>
          </div>
        </FadeIn>
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

function SectionHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-3xl sm:text-4xl font-bold text-foreground tracking-tight ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {children}
    </h2>
  );
}

function ServiceCard({ item, index }: { item: Service; index: number }) {
  return (
    <div
      className="group flex items-start gap-4 py-5 border-b border-border/40 last:border-b-0 cursor-default transition-all hover:pl-1"
    >
      <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-brand-light flex items-center justify-center text-brand text-xs font-bold mt-0.5">
        {index + 1}
      </span>
      <div>
        <h4 className="text-[15px] font-semibold text-foreground mb-1.5 leading-snug">
          {item.title}
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
          {item.text}
        </p>
      </div>
    </div>
  );
}

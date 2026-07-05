"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import FadeIn from "./FadeIn";

interface HeroProps {
  greeting: string;
  name: string;
  role: string;
  line1: string;
  line2: string;
  cta: string;
  cian: string;
  cianUrl: string;
  scrollTo: (id: string) => void;
}

/**
 * Hero-секция: портрет + текст, чистый тёмный фон с тонким noise-эффектом.
 * Без parallax, без bullet points — минимализм.
 */
export default function Hero({
  greeting,
  name,
  role,
  line1,
  line2,
  cta,
  cian,
  cianUrl,
  scrollTo,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden grain-overlay"
      style={{ backgroundColor: "#0f1117" }}
    >
      {/* Тонкая accent-линия снизу hero */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full py-28 lg:py-0">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-16">
          {/* Портрет */}
          <FadeIn className="flex-shrink-0">
            <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[360px] lg:h-[360px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              <div className="w-full h-full p-[2px] bg-gradient-to-br from-brand/30 via-transparent to-white/10 rounded-2xl">
                <img
                  src="/portrait.jpg"
                  alt={name}
                  className="w-full h-full object-cover rounded-2xl"
                  width={640}
                  height={640}
                />
              </div>
            </div>
          </FadeIn>

          {/* Текст */}
          <div className="text-center lg:text-left max-w-xl">
            <FadeIn>
              <p className="text-brand/80 text-xs sm:text-sm font-medium uppercase tracking-[0.25em] mb-5">
                {greeting}
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1
                className="text-[clamp(2.75rem,8vw,4.5rem)] font-bold text-white tracking-tight leading-[1.05] mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {name}
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="text-white/70 text-lg sm:text-xl font-medium mb-8">
                {role}
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-white/50 text-[15px] sm:text-base leading-relaxed mb-10 max-w-md mx-auto lg:mx-0">
                {line1}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-brand/70 text-sm mb-10 max-w-md mx-auto lg:mx-0">
                {line2}
              </p>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button
                  onClick={() => scrollTo("contact")}
                  className="bg-brand hover:bg-brand/85 text-white h-12 px-8 text-[15px] font-medium rounded-lg shadow-lg transition-all"
                >
                  {cta}
                  <ArrowRight size={17} />
                </Button>
                <a
                  href={cianUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/12 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/20 h-12 px-8 text-[15px] font-medium rounded-lg transition-all bg-transparent"
                >
                  {cian}
                  <ExternalLink size={15} />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

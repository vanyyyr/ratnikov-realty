"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FadeIn from "./FadeIn";

interface FaqItem {
  question: string;
  answer: string;
}

interface FAQProps {
  label: string;
  title: string;
  items: FaqItem[];
}

export default function FAQ({ label, title, items }: FAQProps) {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-14">
          <SectionLabel>{label}</SectionLabel>
          <SectionHeading>{title}</SectionHeading>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-border/50 rounded-xl px-6 mb-2.5 bg-card data-[state=open]:shadow-sm transition-shadow"
              >
                <AccordionTrigger className="text-left text-[15px] font-semibold text-foreground hover:text-brand hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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

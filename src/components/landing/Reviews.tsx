"use client";

import FadeIn from "./FadeIn";

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  source: string | null;
  createdAt: string;
}

interface ReviewsProps {
  label: string;
  title: string;
  placeholder: string;
  reviews: Review[];
  locale: string;
}

export default function Reviews({
  label,
  title,
  placeholder,
  reviews,
  locale,
}: ReviewsProps) {
  return (
    <section id="reviews" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-14">
          <SectionLabel>{label}</SectionLabel>
          <SectionHeading>{title}</SectionHeading>
        </FadeIn>

        {reviews.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {reviews.map((r, idx) => (
              <FadeIn key={r.id} delay={idx * 0.08}>
                <ReviewCard review={r} locale={locale} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn>
            <div className="text-center py-16 px-8 rounded-2xl max-w-xl mx-auto border border-border/40">
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                {placeholder}
              </p>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review, locale }: { review: Review; locale: string }) {
  const { name, text, rating, createdAt } = review;
  return (
    <div className="border border-border/50 rounded-xl p-6 h-full flex flex-col bg-card hover:border-brand/20 transition-colors">
      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < rating ? "text-amber-400" : "text-border"}`}
          >
            ★
          </span>
        ))}
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed flex-1 mb-5">
        &ldquo;{text}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-3 border-t border-border/30">
        <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{name}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString(
              locale === "ru" ? "ru-RU" : "en-US",
              { month: "long", year: "numeric" },
            )}
          </p>
        </div>
      </div>
    </div>
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
}: {
  children: React.ReactNode;
}) {
  return (
    <h2
      className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {children}
    </h2>
  );
}

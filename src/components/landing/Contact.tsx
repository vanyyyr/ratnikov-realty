"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, MapPin, Send } from "lucide-react";
import FadeIn from "./FadeIn";

interface ContactProps {
  label: string;
  title: string;
  subtitle: string;
  nameField: string;
  phoneField: string;
  reasonField: string;
  reasonPlaceholder: string;
  reasons: string[];
  commentField: string;
  commentPlaceholder: string;
  submitText: string;
  requiredText: string;
  phoneFormatted: string;
  phoneRaw: string;
  address: string;
  locale: string;
  loading: boolean;
  formData: {
    name: string;
    phone: string;
    serviceType: string;
    comment: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phone: string;
      serviceType: string;
      comment: string;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  onError: () => void;
}

export default function Contact({
  label,
  title,
  subtitle,
  nameField,
  phoneField,
  reasonField,
  reasonPlaceholder,
  reasons,
  commentField,
  commentPlaceholder,
  submitText,
  requiredText,
  phoneFormatted,
  phoneRaw,
  address,
  locale,
  loading,
  formData,
  setFormData,
  onSubmit,
}: ContactProps) {
  const mapText =
    locale === "ru" ? "Показать на карте" : "Show on map";

  return (
    <section id="contact" className="py-20 sm:py-28 bg-card">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-10">
          <SectionLabel>{label}</SectionLabel>
          <SectionHeading className="mb-4">{title}</SectionHeading>
          <p className="text-muted-foreground text-[15px] sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-medium">
                  {nameField} *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder={nameField}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-medium">
                  {phoneField} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder={phoneField}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs font-medium">
                {reasonField}
              </Label>
              <select
                id="reason"
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, serviceType: e.target.value }))
                }
                className="flex h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand"
              >
                <option value="">{reasonPlaceholder}</option>
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment" className="text-xs font-medium">
                {commentField}
              </Label>
              <textarea
                id="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, comment: e.target.value }))
                }
                placeholder={commentPlaceholder}
                rows={3}
                className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand focus-visible:border-brand resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-brand hover:bg-brand/85 text-white w-full h-12 text-[15px] font-medium rounded-lg shadow-lg shadow-brand/15 transition-all disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  {submitText}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={16} />
                  {submitText}
                </span>
              )}
            </Button>
          </form>
        </FadeIn>

        {/* Контактная информация */}
        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-muted-foreground text-sm">
            <a
              href={"tel:" + phoneRaw}
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Phone size={15} className="text-brand flex-shrink-0" />
              {phoneFormatted}
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-brand flex-shrink-0" />
              {address}
            </span>
            <a
              href={`https://yandex.ru/maps/?text=${encodeURIComponent(address || "Санкт-Петербург")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand hover:underline"
            >
              <MapPin className="w-4 h-4" />
              {mapText}
            </a>
          </div>
        </FadeIn>

        {/* Yandex Map */}
        <FadeIn delay={0.3}>
          <div className="mt-6 rounded-xl overflow-hidden border border-border/40">
            <iframe
              title="Yandex Map"
              src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(address || "Санкт-Петербург")}&z=16`}
              width="100%"
              height={300}
              className="border-0"
              loading="lazy"
            />
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

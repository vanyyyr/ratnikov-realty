"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Menu,
  BarChart3,
  ShieldCheck,
  Megaphone,
  Handshake,
  MessageCircle,
  ChevronDown,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  ExternalLink,
  Quote,
  Star,
  Globe,
  PhoneCall,
} from "lucide-react";

/* ──────────────────────────── helpers ──────────────────────────── */

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-red-700 mb-4">
      {children}
    </span>
  );
}

function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-3xl sm:text-4xl font-bold text-foreground tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
}

/* ──────────────────────────── page ──────────────────────────── */

export default function Home() {
  const { locale, setLocale, t } = useI18n();

  const nav = t("nav");
  const hero = t("hero");
  const about = t("about");
  const advantages = t("advantages");
  const services = t("services");
  const stats = t("stats");
  const reviews = t("reviews");
  const contact = t("contact");
  const faq = t("faq");
  const exitIntent = t("exitIntent");
  const floating = t("floating");
  const footer = t("footer");

  /* state */
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceType: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  // Callback dialog state
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "" });
  const [callbackLoading, setCallbackLoading] = useState(false);

  // Exit intent state
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [exitIntentForm, setExitIntentForm] = useState({ name: "", phone: "" });
  const [exitIntentLoading, setExitIntentLoading] = useState(false);

  // Floating buttons visibility (hide on scroll down, show on scroll up)
  const [floatingVisible, setFloatingVisible] = useState(true);

  /* scroll listener */
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 60);
          setFloatingVisible(currentScrollY < lastScrollY || currentScrollY < 100);
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  /* form */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error(contact.required);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          serviceType: formData.serviceType || undefined,
          comment: formData.comment || undefined,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.duplicate) {
          toast.warning(contact.duplicateWarning);
        } else {
          toast.success(contact.success);
        }
        setFormData({ name: "", phone: "", serviceType: "", comment: "" });
      } else {
        toast.error(contact.error);
      }
    } catch {
      toast.error(contact.error);
    } finally {
      setLoading(false);
    }
  };

  /* advantage icons */
  const advIcons = [BarChart3, ShieldCheck, Megaphone, Handshake];

  /* callback form handler */
  const handleCallbackSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!callbackForm.name.trim() || !callbackForm.phone.trim()) {
      toast.error(contact.required);
      return;
    }
    setCallbackLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: callbackForm.name,
          phone: callbackForm.phone,
          serviceType: locale === "ru" ? "Обратный звонок" : "Callback",
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.duplicate) {
          toast.warning(contact.duplicateWarning);
        } else {
          toast.success(contact.callbackSuccess);
        }
        setCallbackForm({ name: "", phone: "" });
        setCallbackOpen(false);
        sessionStorage.setItem("formSubmitted", "true");
      } else {
        toast.error(contact.error);
      }
    } catch {
      toast.error(contact.error);
    } finally {
      setCallbackLoading(false);
    }
  }, [callbackForm, locale, contact]);

  /* exit intent form handler */
  const handleExitIntentSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!exitIntentForm.name.trim() || !exitIntentForm.phone.trim()) {
      toast.error(contact.required);
      return;
    }
    setExitIntentLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: exitIntentForm.name,
          phone: exitIntentForm.phone,
          serviceType: "Exit Intent",
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.duplicate) {
          toast.warning(contact.duplicateWarning);
        } else {
          toast.success(exitIntent.success);
        }
        setExitIntentForm({ name: "", phone: "" });
        setExitIntentOpen(false);
        sessionStorage.setItem("formSubmitted", "true");
      } else {
        toast.error(contact.error);
      }
    } catch {
      toast.error(contact.error);
    } finally {
      setExitIntentLoading(false);
    }
  }, [exitIntentForm, exitIntent, contact]);

  /* exit intent listener */
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 5 && !sessionStorage.getItem("exitIntentShown") && !sessionStorage.getItem("formSubmitted")) {
        setExitIntentOpen(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    return () => document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  /* nav links */
  const navLinks = [
    { label: nav.about, id: "about" },
    { label: nav.services, id: "services" },
    { label: nav.reviews, id: "reviews" },
    { label: nav.contact, id: "contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center select-none"
          >
            <span
              className={`text-[14px] font-semibold tracking-tight transition-colors ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              {locale === "ru" ? "Личная визитка" : "Personal Card"}
            </span>
          </button>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`text-[13px] font-medium transition-colors ${
                  scrolled
                    ? "text-foreground/70 hover:text-red-700"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Lang toggle */}
            <div className="flex items-center bg-black/5 rounded-md p-[3px]">
              {(["ru", "en"] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLocale(lng)}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-[5px] transition-all duration-200 ${
                    locale === lng
                      ? "bg-red-700 text-white shadow-sm"
                      : scrolled
                        ? "text-foreground/50 hover:text-foreground"
                        : "text-white/50 hover:text-white"
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>

            <Button
              onClick={() => scrollTo("contact")}
              className="bg-red-700 hover:bg-red-800 text-white h-9 px-5 text-[13px] font-medium rounded-md"
              size="default"
            >
              {hero.cta}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className={`lg:hidden transition-colors ${
                  scrolled ? "text-foreground" : "text-white"
                }`}
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] pt-10">
              <SheetTitle className="text-base font-semibold tracking-tight mb-8">
                {locale === "ru" ? "Личная визитка" : "Personal Card"}
              </SheetTitle>

              <nav className="flex flex-col gap-1">
                {navLinks.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => scrollTo(l.id)}
                    className="text-left text-[15px] font-medium text-foreground/80 hover:text-red-700 transition-colors py-3 border-b border-border/50"
                  >
                    {l.label}
                  </button>
                ))}
              </nav>

              <div className="flex items-center bg-gray-100 rounded-md p-[3px] w-fit mt-8">
                {(["ru", "en"] as const).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => setLocale(lng)}
                    className={`px-3 py-1.5 text-[12px] font-bold uppercase rounded-[5px] transition-all ${
                      locale === lng
                        ? "bg-red-700 text-white"
                        : "text-foreground/50"
                    }`}
                  >
                    {lng}
                  </button>
                ))}
              </div>

              <Button
                onClick={() => scrollTo("contact")}
                className="bg-red-700 hover:bg-red-800 text-white w-full h-11 mt-6 text-[14px] font-medium"
              >
                {hero.cta}
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {/* ═══════════════════ HERO ═══════════════════ */}
        <section
          id="hero"
          className="relative min-h-screen flex items-center bg-[#0A0A0A] overflow-hidden"
        >
          {/* background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0A0A0A] to-red-950/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_50%,rgba(185,28,28,0.08),transparent)]" />

          {/* thin red accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-700" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 lg:py-0">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text content */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <FadeIn>
                  <p className="text-red-500/90 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] mb-6">
                    {hero.greeting}
                  </p>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <h1 className="text-[clamp(2.75rem,8vw,5rem)] font-bold text-white tracking-tight leading-[1.05] mb-3">
                    {hero.name}
                  </h1>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <p className="text-red-500 text-lg sm:text-xl font-medium mb-6">
                    {hero.title}
                  </p>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <p className="text-white/50 text-[15px] sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10">
                    {hero.subtitle}
                  </p>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Button
                      onClick={() => scrollTo("contact")}
                      className="bg-red-700 hover:bg-red-800 text-white h-12 px-8 text-[15px] font-medium rounded-lg shadow-lg shadow-red-900/30 hover:shadow-red-900/40 transition-shadow"
                    >
                      {hero.cta}
                      <ArrowRight size={17} />
                    </Button>
                    <a
                      href="https://cian.ru/cat.php?deal_type=sale&engine_version=extended"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/90 hover:bg-white/10 hover:text-white hover:border-white/25 h-12 px-8 text-[15px] font-medium rounded-lg transition-all bg-transparent"
                    >
                      {hero.cian}
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </FadeIn>
              </div>

              {/* Photo */}
              <FadeIn delay={0.3} className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute -left-2 top-6 bottom-6 w-[3px] bg-gradient-to-b from-red-700 via-red-600 to-red-800 rounded-full hidden sm:block" />
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
                    <Image
                      src="/hero-photo.jpg"
                      alt={hero.name}
                      width={380}
                      height={507}
                      className="w-auto h-auto max-h-[50vh] lg:max-h-[75vh] object-cover object-top"
                      priority
                      fetchPriority="high"
                    />
                  </div>
                  {/* Decorative corner */}
                  <div className="absolute -bottom-3 -right-3 w-20 h-20 border-2 border-red-700/20 rounded-2xl -z-10 hidden sm:block" />
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-white/50 text-[10px] uppercase tracking-[0.25em]">
              {hero.scroll}
            </span>
            <ChevronDown className="text-white/50 animate-bounce" size={18} />
          </div>
        </section>

        {/* ═══════════════════ ABOUT ═══════════════════ */}
        <section id="about" className="pt-28 sm:pt-32 pb-20 sm:pb-28 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
                <FadeIn>
                  <SectionLabel>{about.label}</SectionLabel>
                  <SectionHeading className="mb-6">{about.title}</SectionHeading>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <p className="text-muted-foreground text-[15px] sm:text-base leading-relaxed mb-8">
                    {about.description}
                  </p>
                </FadeIn>

                {/* Mission box */}
                <FadeIn delay={0.2}>
                  <div className="bg-gray-50 border border-gray-200/60 rounded-xl p-6 sm:p-7 mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                      {about.mission}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {about.missionText}
                    </p>
                  </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <Badge className="bg-red-700 text-white hover:bg-red-800 text-xs px-4 py-1.5 rounded-md font-medium">
                    {about.partner}
                  </Badge>
                </FadeIn>
              </div>
            </div>
        </section>

        {/* ═══════════════════ ADVANTAGES ═══════════════════ */}
        <section className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14 sm:mb-16">
              <SectionLabel>{advantages.label}</SectionLabel>
              <SectionHeading>{advantages.title}</SectionHeading>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
              {advantages.items.map((item, i) => {
                const Icon = advIcons[i];
                return (
                  <FadeIn key={i} delay={i * 0.1}>
                    <Card className="group h-full border-gray-200/80 hover:border-red-200 hover:shadow-lg hover:shadow-red-700/[0.04] transition-all duration-300 py-0">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-700 transition-colors duration-300">
                            <Icon
                              size={21}
                              className="text-red-700 group-hover:text-white transition-colors duration-300"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-[15px] sm:text-base font-semibold text-foreground mb-2 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════ SERVICES ═══════════════════ */}
        <section id="services" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14 sm:mb-16">
              <SectionLabel>{services.label}</SectionLabel>
              <SectionHeading className="mb-4">{services.title}</SectionHeading>
              <p className="text-muted-foreground text-[15px] sm:text-base max-w-2xl mx-auto leading-relaxed">
                {services.subtitle}
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {services.items.map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <Card className="group h-full border-gray-200/80 hover:border-red-200 hover:shadow-lg hover:shadow-red-700/[0.04] transition-all duration-300 py-0">
                    <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                      <span className="text-4xl sm:text-5xl font-bold text-red-700/20 group-hover:text-red-700/35 transition-colors duration-300 mb-4 block leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-[15px] font-semibold text-foreground mb-3 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                        {item.text}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ STATS ═══════════════════ */}
        <section className="py-20 sm:py-24 bg-[#0A0A0A] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(185,28,28,0.06),transparent)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {stats.items.map((item, i) => (
                <FadeIn key={i} delay={i * 0.1} className="text-center">
                  <div className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white mb-2 tracking-tight">
                    {item.value}
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm uppercase tracking-[0.12em] font-medium">
                    {item.label}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ REVIEWS ═══════════════════ */}
        <section id="reviews" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14 sm:mb-16">
              <SectionLabel>{reviews.label}</SectionLabel>
              <SectionHeading>{reviews.title}</SectionHeading>
            </FadeIn>

            <FadeIn>
              <div className="text-center py-16 sm:py-20 px-6 sm:px-10 bg-gray-50 rounded-2xl max-w-2xl mx-auto border border-gray-200/60">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-6">
                  <Quote size={28} className="text-red-700/40" />
                </div>
                <p className="text-muted-foreground text-[15px] sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
                  {reviews.placeholder}
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-gray-200 fill-gray-200"
                    />
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════════════ FAQ ═══════════════════ */}
        <section id="faq" className="py-20 sm:py-28 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14 sm:mb-16">
              <SectionLabel>{faq.label}</SectionLabel>
              <SectionHeading>{faq.title}</SectionHeading>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Accordion type="single" collapsible className="w-full">
                {faq.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border-gray-200/80 bg-white rounded-xl px-6 mb-3 shadow-sm data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left text-[15px] font-semibold text-foreground hover:text-red-700 hover:no-underline py-5">
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

        {/* ═══════════════════ CONTACT ═══════════════════ */}
        <section id="contact" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Left: info */}
              <div className="lg:col-span-2">
                <FadeIn>
                  <SectionLabel>{contact.label}</SectionLabel>
                  <SectionHeading className="mb-4">{contact.title}</SectionHeading>
                  <p className="text-muted-foreground text-[15px] sm:text-base leading-relaxed mb-10">
                    {contact.subtitle}
                  </p>
                </FadeIn>

                <FadeIn delay={0.15}>
                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 justify-start gap-3 text-[14px] font-medium border-gray-200 bg-white hover:border-red-200 hover:bg-red-50 hover:text-red-700 rounded-lg"
                    >
                      <a
                        href="https://t.me/ilyaratnikov"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle size={19} className="text-red-700" />
                        Telegram
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 justify-start gap-3 text-[14px] font-medium border-gray-200 bg-white hover:border-red-200 hover:bg-red-50 hover:text-red-700 rounded-lg"
                    >
                      <a href="https://max.ru" target="_blank" rel="noopener noreferrer">
                        <MessageCircle size={19} className="text-red-700" />
                        Макс
                      </a>
                    </Button>
                    <Button
                      onClick={() => setCallbackOpen(true)}
                      className="h-12 justify-start gap-3 text-[14px] font-medium bg-red-700 hover:bg-red-800 text-white rounded-lg"
                    >
                      <PhoneCall size={19} />
                      {contact.callbackButton}
                    </Button>
                  </div>
                </FadeIn>

                {/* Contact info below messenger buttons */}
                <FadeIn delay={0.25}>
                  <div className="mt-10 space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <Phone size={16} className="text-red-700/70 flex-shrink-0" />
                      <a href="tel:+79892467798" className="hover:text-red-700 transition-colors">+7 (989) 246-77-98</a>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <MapPin size={16} className="text-red-700/70 flex-shrink-0" />
                      <span>{footer.address}</span>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right: form */}
              <FadeIn delay={0.1} className="lg:col-span-3">
                <form
                  onSubmit={handleSubmit}
                  className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200/60"
                >
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-medium">
                        {contact.name} *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder={contact.name}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-medium">
                        {contact.phone} *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, phone: e.target.value }))
                        }
                        placeholder={contact.phone}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-5">
                    <Label className="text-xs font-medium">
                      {contact.serviceType}
                    </Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(v) =>
                        setFormData((p) => ({ ...p, serviceType: v }))
                      }
                    >
                      <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder={contact.serviceType} />
                      </SelectTrigger>
                      <SelectContent>
                        {contact.serviceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 mb-6">
                    <Label htmlFor="comment" className="text-xs font-medium">
                      {contact.comment}
                    </Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, comment: e.target.value }))
                      }
                      placeholder={contact.commentPlaceholder}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-red-700 hover:bg-red-800 text-white w-full h-12 text-[15px] font-medium rounded-lg shadow-lg shadow-red-700/20 hover:shadow-red-700/30 transition-shadow disabled:opacity-70"
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
                        {contact.submit}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send size={16} />
                        {contact.submit}
                      </span>
                    )}
                  </Button>
                </form>
              </FadeIn>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="bg-[#0A0A0A] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">
            {/* Contacts */}
            <div>
              <p className="text-sm font-semibold tracking-tight mb-6">
                {locale === "ru" ? "Личная визитка" : "Personal Card"}
              </p>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
                {footer.contacts}
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+79892467798"
                  className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm"
                >
                  <Phone size={15} className="text-red-500/80 flex-shrink-0" />
                  +7 (989) 246-77-98
                </a>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <MapPin size={15} className="text-red-500/80 flex-shrink-0" />
                  {footer.address}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
                {footer.quickLinks}
              </h3>
              <nav className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => scrollTo(l.id)}
                    className="text-left text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {l.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
                {footer.followMe}
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://t.me/ilyaratnikov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm"
                >
                  <MessageCircle size={15} className="flex-shrink-0" />
                  {footer.telegram}
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm"
                >
                  <Globe size={15} className="flex-shrink-0" />
                  {footer.vk}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/40 text-xs">
              &copy; 2025 {hero.name}. {footer.rights}
            </p>
            <p className="text-white/40 text-xs">{footer.madeIn}</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════ FLOATING BUTTONS ═══════════════════ */}
      <TooltipProvider delayDuration={300}>
        <div
          className={`fixed bottom-6 right-6 z-40 flex flex-col gap-3 transition-all duration-300 ${
            floatingVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://t.me/ilyaratnikov"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 sm:w-[56px] sm:h-[56px] bg-[#229ED9] hover:bg-[#1a8bc4] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all animate-pulse-slow"
                aria-label={floating.telegram}
              >
                <Send size={22} className="sm:w-5 sm:h-5" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs font-medium">
              {floating.telegram}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://max.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 sm:w-[56px] sm:h-[56px] bg-[#1a1a1a] hover:bg-[#333] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all animate-pulse-slow"
                aria-label={floating.max}
              >
                <MessageCircle size={22} className="sm:w-5 sm:h-5" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs font-medium">
              {floating.max}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* ═══════════════════ CALLBACK DIALOG ═══════════════════ */}
      <Dialog open={callbackOpen} onOpenChange={setCallbackOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{contact.callbackTitle}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {contact.callbackDescription}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCallbackSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="cb-name" className="text-xs font-medium">{contact.name} *</Label>
              <Input
                id="cb-name"
                value={callbackForm.name}
                onChange={(e) => setCallbackForm((p) => ({ ...p, name: e.target.value }))}
                placeholder={contact.name}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cb-phone" className="text-xs font-medium">{contact.phone} *</Label>
              <Input
                id="cb-phone"
                type="tel"
                value={callbackForm.phone}
                onChange={(e) => setCallbackForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder={contact.phone}
                required
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={callbackLoading}
              className="bg-red-700 hover:bg-red-800 text-white w-full h-12 text-[15px] font-medium rounded-lg disabled:opacity-70"
            >
              {callbackLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {contact.callbackSubmit}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PhoneCall size={16} />
                  {contact.callbackSubmit}
                </span>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════ EXIT INTENT DIALOG ═══════════════════ */}
      <Dialog open={exitIntentOpen} onOpenChange={setExitIntentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-700">{exitIntent.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              {exitIntent.description}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExitIntentSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="ei-name" className="text-xs font-medium">{exitIntent.name} *</Label>
              <Input
                id="ei-name"
                value={exitIntentForm.name}
                onChange={(e) => setExitIntentForm((p) => ({ ...p, name: e.target.value }))}
                placeholder={exitIntent.name}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ei-phone" className="text-xs font-medium">{exitIntent.phone} *</Label>
              <Input
                id="ei-phone"
                type="tel"
                value={exitIntentForm.phone}
                onChange={(e) => setExitIntentForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder={exitIntent.phone}
                required
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={exitIntentLoading}
              className="bg-red-700 hover:bg-red-800 text-white w-full h-12 text-[15px] font-medium rounded-lg disabled:opacity-70"
            >
              {exitIntentLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {exitIntent.submit}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={16} />
                  {exitIntent.submit}
                </span>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
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
  ArrowUp,
  ExternalLink,
  Quote,
  Star,
  Globe,
  PhoneCall,
} from "lucide-react";

/* ──────────────────────────── helpers ──────────────────────────── */

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) {
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  }
  return raw;
}

function useCountUp(target: string, visible: boolean) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!visible) return;
    const numMatch = target.match(/[\d.]+/);
    if (!numMatch) {
      // Use requestAnimationFrame to avoid synchronous setState in effect
      requestAnimationFrame(() => setDisplay(target));
      return;
    }
    const num = parseFloat(numMatch[0]);
    const suffix = target.replace(numMatch[0], "");
    const duration = 1500;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      setDisplay(Number.isInteger(num) ? Math.round(current) + suffix : current.toFixed(1) + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);
  return display;
}

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
        transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.98)",
        filter: visible ? "blur(0)" : "blur(4px)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center sm:items-start text-xs font-semibold uppercase tracking-[0.2em] text-red-700 mb-4">
      <span className="block w-8 h-0.5 bg-red-700 mb-3" />
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

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const display = useCountUp(value, visible);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white mb-2 tracking-tight">
        {display}
      </div>
      <div className="text-white/60 text-xs sm:text-sm uppercase tracking-[0.12em] font-medium">
        {label}
      </div>
    </div>
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroParallax, setHeroParallax] = useState(0);
  const [siteSettings, setSiteSettings] = useState({
    cianUrl: "https://cian.ru/cat.php?deal_type=sale&engine_version=extended",
    telegram: "https://t.me/ilyaratnikov",
    maxUrl: "https://max.ru",
    vk: "#",
    instagram: "#",
    whatsapp: "#",
    phoneRaw: "+79892467798",
    phone: "+7 (989) 246-77-98",
    address: "Офис: ул. Комсомола, 41",
    metrikaId: "",
    showReviews: true,
  });
  const [dbReviews, setDbReviews] = useState<
    { id: string; name: string; text: string; rating: number; source: string | null; createdAt: string }[]
  >([]);

  /* load public settings */
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        setSiteSettings((prev) => ({
          ...prev,
          cianUrl: s.cian_profile_url || prev.cianUrl,
          telegram: s.social_telegram || prev.telegram,
          maxUrl: s.max_profile_url || prev.maxUrl,
          vk: s.social_vk || prev.vk,
          instagram: s.social_instagram || prev.instagram,
          whatsapp: s.social_whatsapp || prev.whatsapp,
          phoneRaw: s.phone || prev.phoneRaw,
          phone: s.phone ? formatPhone(s.phone) : prev.phone,
          address: s.address ? "Офис: " + s.address : prev.address,
          metrikaId: s.yandex_metrika_id || prev.metrikaId,
          showReviews: s.show_reviews !== "false",
        }));

        // Yandex Metrika
        if (s.yandex_metrika_id) {
          if (!document.getElementById("yandex-metrika")) {
            const script = document.createElement("script");
            script.id = "yandex-metrika";
            script.innerHTML = `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
              ym(${s.yandex_metrika_id},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});
            `;
            document.head.appendChild(script);
          }
        }
      })
      .catch(() => {});

    // Load reviews
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDbReviews(data);
      })
      .catch(() => {});
  }, []);

  // Callback dialog state
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "" });
  const [callbackLoading, setCallbackLoading] = useState(false);

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
          const total = document.documentElement.scrollHeight - window.innerHeight;
          setScrollProgress(total > 0 ? (currentScrollY / total) * 100 : 0);
          setHeroParallax(currentScrollY * 0.3);
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

  /* nav links */
  const navLinks = [
    { label: nav.about, id: "about" },
    { label: nav.services, id: "services" },
    ...(siteSettings.showReviews ? [{ label: nav.reviews, id: "reviews" }] : []),
    { label: nav.contact, id: "contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-red-700 z-[60] transition-[width] duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] animate-[slideDown_0.3s_ease-out]"
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
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0A0A0A] to-red-950/20" style={{ transform: `translateY(${heroParallax}px)` }} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_50%,rgba(185,28,28,0.08),transparent)]" style={{ transform: `translateY(${heroParallax}px)` }} />

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
                      className="bg-red-700 hover:bg-red-800 text-white h-12 px-8 text-[15px] font-medium rounded-lg shadow-lg shadow-red-900/30 hover:shadow-red-900/40 transition-shadow btn-glow"
                    >
                      {hero.cta}
                      <ArrowRight size={17} />
                    </Button>
                    <a
                      href={siteSettings.cianUrl}
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
                    <Card className="group h-full border-gray-200/80 hover:border-red-200 hover:shadow-lg hover:shadow-red-700/[0.06] hover:-translate-y-1 transition-all duration-300 py-0">
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
                <FadeIn key={i} delay={i * 0.12}>
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
                <FadeIn key={i} delay={i * 0.1}>
                  <StatItem value={item.value} label={item.label} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ REVIEWS ═══════════════════ */}
        {siteSettings.showReviews && (
        <section id="reviews" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-14 sm:mb-16">
              <SectionLabel>{reviews.label}</SectionLabel>
              <SectionHeading>{reviews.title}</SectionHeading>
            </FadeIn>

            {dbReviews.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {dbReviews.map((r, idx) => (
                  <FadeIn key={r.id} delay={idx * 0.08}>
                    <Card className="bg-gray-50 border-gray-200/60 hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={15}
                                className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                              />
                            ))}
                          </div>
                          <Quote size={18} className="text-red-200" />
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed flex-1 mb-5">
                          &ldquo;{r.text}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 pt-3 border-t border-gray-200/60">
                          <div className="w-9 h-9 bg-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {r.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {r.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(r.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeIn>
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </section>
        )}

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
                        href={siteSettings.telegram}
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
                      <a href={siteSettings.maxUrl} target="_blank" rel="noopener noreferrer">
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
                      <a href={"tel:" + siteSettings.phoneRaw} className="hover:text-red-700 transition-colors">{siteSettings.phone}</a>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground text-sm">
                      <MapPin size={16} className="text-red-700/70 flex-shrink-0" />
                      <span>{siteSettings.address}</span>
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
                  href={"tel:" + siteSettings.phoneRaw}
                  className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm"
                >
                  <Phone size={15} className="text-red-500/80 flex-shrink-0" />
                  {siteSettings.phone}
                </a>
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <MapPin size={15} className="text-red-500/80 flex-shrink-0" />
                  {siteSettings.address}
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
                  href={siteSettings.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm"
                >
                  <MessageCircle size={15} className="flex-shrink-0" />
                  {footer.telegram}
                </a>
                <a
                  href={siteSettings.vk}
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
          {/* Back to top button */}
          {scrolled && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="w-11 h-11 sm:w-12 sm:h-12 bg-white border border-gray-200 hover:border-red-200 text-foreground hover:text-red-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                  aria-label="Наверх"
                >
                  <ArrowUp size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs font-medium">
                {locale === "ru" ? "Наверх" : "Back to top"}
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={siteSettings.telegram}
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
                href={siteSettings.maxUrl}
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
    </div>
  );
}
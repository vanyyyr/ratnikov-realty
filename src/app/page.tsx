"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n-context";
import { toast } from "sonner";

/* ─── Landing components ─── */
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Cases from "@/components/landing/Cases";
import Reviews from "@/components/landing/Reviews";
import FAQ from "@/components/landing/FAQ";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import FloatingButtons from "@/components/landing/FloatingButtons";
import CallbackDialog from "@/components/landing/CallbackDialog";

/* ─── helpers ─── */

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length === 11) {
    return `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
  }
  return raw;
}

/* ─── page ─── */

export default function Home() {
  const { locale, setLocale, t } = useI18n();

  const nav = t("nav");
  const hero = t("hero");
  const about = t("about");
  const cases = t("cases");
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
  const [floatingVisible, setFloatingVisible] = useState(true);
  const [siteSettings, setSiteSettings] = useState({
    cianUrl: "https://cian.ru/cat.php?deal_type=sale&engine_version=extended",
    telegram: "https://t.me/ilyaratnikov",
    maxUrl: "https://max.ru",
    phoneRaw: "+79892467798",
    phone: "+7 (989) 246-77-98",
    address: "Санкт-Петербург",
    showReviews: true,
    showCases: true,
  });
  const [dbReviews, setDbReviews] = useState<
    { id: string; name: string; text: string; rating: number; source: string | null; createdAt: string }[]
  >([]);
  const [dbCases, setDbCases] = useState<
    { id: string; title: string; text: string; result: string | null }[]
  >([]);

  /* load public settings + data */
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        setSiteSettings((prev) => ({
          ...prev,
          cianUrl: s.cian_profile_url || prev.cianUrl,
          telegram: s.social_telegram || prev.telegram,
          maxUrl: s.max_profile_url || prev.maxUrl,
          phoneRaw: s.phone || prev.phoneRaw,
          phone: s.phone ? formatPhone(s.phone) : prev.phone,
          address: s.address || prev.address,
          showReviews: s.show_reviews !== "false",
          showCases: s.show_cases !== "false",
        }));

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

    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDbReviews(data);
      })
      .catch(() => {});

    fetch("/api/cases")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDbCases(data);
      })
      .catch(() => {});
  }, []);

  // Callback dialog state
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "" });
  const [callbackLoading, setCallbackLoading] = useState(false);

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

  /* contact form */
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

  /* callback form */
  const handleCallbackSubmit = useCallback(
    async (e: FormEvent) => {
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
        } else {
          toast.error(contact.error);
        }
      } catch {
        toast.error(contact.error);
      } finally {
        setCallbackLoading(false);
      }
    },
    [callbackForm, locale, contact],
  );

  /* nav links */
  const navLinks = [
    { label: nav.about, id: "about" },
    ...(siteSettings.showCases && dbCases.length > 0
      ? [{ label: cases.label, id: "cases" }]
      : []),
    ...(siteSettings.showReviews
      ? [{ label: nav.reviews, id: "reviews" }]
      : []),
    { label: nav.contact, id: "contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <Navbar
        scrolled={scrolled}
        navLinks={navLinks}
        scrollTo={scrollTo}
        locale={locale}
        setLocale={setLocale}
        ctaText={hero.cta}
        heroName={hero.name}
        onMobileOpenChange={setMobileOpen}
        mobileOpen={mobileOpen}
      />

      <main className="flex-1">
        {/* Hero */}
        <Hero
          greeting={hero.greeting}
          name={hero.name}
          role={hero.role}
          line1={hero.line1}
          line2={hero.line2}
          cta={hero.cta}
          cian={hero.cian}
          cianUrl={siteSettings.cianUrl}
          scrollTo={scrollTo}
        />

        {/* About + Services */}
        <About
          label={about.label}
          title={about.title}
          description={about.description}
          servicesTitle={about.servicesTitle}
          services={about.services as unknown as Array<{ title: string; text: string }>}
          setlTitle={about.setlTitle}
          setText={about.setText}
          partner={about.partner}
        />

        {/* Cases */}
        {siteSettings.showCases && dbCases.length > 0 && (
          <Cases label={cases.label} title={cases.title} cases={dbCases} />
        )}

        {/* Reviews */}
        {siteSettings.showReviews && (
          <Reviews
            label={reviews.label}
            title={reviews.title}
            placeholder={reviews.placeholder}
            reviews={dbReviews}
            locale={locale}
          />
        )}

        {/* FAQ */}
        <FAQ
          label={faq.label}
          title={faq.title}
          items={
            faq.items as unknown as Array<{ question: string; answer: string }>
          }
        />

        {/* Contact */}
        <Contact
          label={contact.label}
          title={contact.title}
          subtitle={contact.subtitle}
          nameField={contact.name}
          phoneField={contact.phone}
          reasonField={contact.reason}
          reasonPlaceholder={contact.reasonPlaceholder}
          reasons={contact.reasons as unknown as string[]}
          commentField={contact.comment}
          commentPlaceholder={contact.commentPlaceholder}
          submitText={contact.submit}
          requiredText={contact.required}
          phoneFormatted={siteSettings.phone}
          phoneRaw={siteSettings.phoneRaw}
          address={siteSettings.address}
          locale={locale}
          loading={loading}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onError={() => toast.error(contact.error)}
        />
      </main>

      {/* Footer */}
      <Footer
        name={hero.name}
        city={footer.madeIn}
        telegram={siteSettings.telegram}
        maxUrl={siteSettings.maxUrl}
      />

      {/* Floating buttons */}
      <FloatingButtons
        visible={floatingVisible}
        scrolled={scrolled}
        scrollToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        telegramUrl={siteSettings.telegram}
        maxUrl={siteSettings.maxUrl}
        telegramLabel={floating.telegram}
        maxLabel={floating.max}
        topLabel={locale === "ru" ? "Наверх" : "Back to top"}
      />

      {/* Callback dialog */}
      <CallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        formData={callbackForm}
        setFormData={setCallbackForm}
        loading={callbackLoading}
        onSubmit={handleCallbackSubmit}
        nameField={contact.name}
        phoneField={contact.phone}
        title={contact.callbackTitle}
        description={contact.callbackDescription}
        submitText={contact.callbackSubmit}
      />
    </div>
  );
}

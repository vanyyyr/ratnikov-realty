"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Logo from "./Logo";

interface NavItem {
  label: string;
  id: string;
}

interface NavbarProps {
  scrolled: boolean;
  navLinks: NavItem[];
  scrollTo: (id: string) => void;
  locale: string;
  setLocale: (l: "ru" | "en") => void;
  ctaText: string;
  heroName: string;
  onMobileOpenChange: (open: boolean) => void;
  mobileOpen: boolean;
}

export default function Navbar({
  scrolled,
  navLinks,
  scrollTo,
  locale,
  setLocale,
  ctaText,
  heroName,
  onMobileOpenChange,
  mobileOpen,
}: NavbarProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--background)]/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo className={scrolled ? "" : "text-white"} />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className={`text-[13px] font-medium transition-colors ${
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-3">
          <LangToggle locale={locale} setLocale={setLocale} scrolled={scrolled} />
          <Button
            onClick={() => scrollTo("contact")}
            className="bg-brand hover:bg-brand/90 text-white h-9 px-5 text-[13px] font-medium rounded-lg"
            size="default"
          >
            {ctaText}
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
          <SheetTrigger asChild>
            <button
              className={`lg:hidden transition-colors ${
                scrolled ? "text-foreground" : "text-white"
              }`}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] pt-10">
            <SheetTitle className="text-base font-semibold tracking-tight mb-8">
              {heroName}
            </SheetTitle>
            <nav className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="text-left text-[15px] font-medium text-foreground/80 hover:text-brand transition-colors py-3 border-b border-border/50"
                >
                  {l.label}
                </button>
              ))}
            </nav>
            <div className="mt-8">
              <LangToggle locale={locale} setLocale={setLocale} scrolled={false} />
            </div>
            <Button
              onClick={() => scrollTo("contact")}
              className="bg-brand hover:bg-brand/90 text-white w-full h-11 mt-6 text-[14px] font-medium"
            >
              {ctaText}
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function LangToggle({
  locale,
  setLocale,
  scrolled,
}: {
  locale: string;
  setLocale: (l: "ru" | "en") => void;
  scrolled: boolean;
}) {
  return (
    <div
      className={`flex items-center rounded-md p-[3px] ${
        scrolled ? "bg-secondary" : "bg-white/10"
      }`}
    >
      {(["ru", "en"] as const).map((lng) => (
        <button
          key={lng}
          onClick={() => setLocale(lng)}
          className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-[5px] transition-all duration-200 ${
            locale === lng
              ? "bg-brand text-white shadow-sm"
              : scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/50 hover:text-white"
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}

interface LogoProps {
  className?: string;
}

/**
 * Текстовый логотип «Ратников» — фамилия в serif-стиле с тонким акцентом.
 */
export default function Logo({ className = "" }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-display text-foreground tracking-tight select-none ${className}`}
    >
      <span className="font-normal" style={{ fontFamily: "var(--font-display)" }}>
        Ратников
      </span>
      <span className="h-[2px] w-3 bg-brand rounded-full mt-1" />
    </span>
  );
}

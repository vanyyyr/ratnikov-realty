interface LogoProps {
  className?: string;
}

/**
 * Минималистичный логотип — квадрат с буквой Р.
 */
export default function Logo({ className = "" }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-foreground tracking-tight select-none ${className}`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand">
        <span className="text-xs font-bold text-white">Р</span>
      </span>
    </span>
  );
}
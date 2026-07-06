interface LogoProps {
  className?: string;
}

/**
 * Minimalist logo: a colored dot without text.
 */
export default function Logo({ className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="h-3 w-3 bg-brand rounded-full" />
    </span>
  );
}
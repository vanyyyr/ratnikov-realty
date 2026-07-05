interface FooterProps {
  name: string;
  city: string;
  telegram: string;
  maxUrl: string;
}

export default function Footer({ name, city, telegram, maxUrl }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1117] text-white mt-auto">
      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            &copy; {year} {name}
          </p>
          <div className="flex items-center gap-5">
            <a
              href={telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              Telegram
            </a>
            <a
              href={maxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              Max
            </a>
          </div>
          <p className="text-white/30 text-xs">{city}</p>
        </div>
      </div>
    </footer>
  );
}

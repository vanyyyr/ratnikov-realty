"use client";

import { Send, MessageCircle, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingButtonsProps {
  visible: boolean;
  scrolled: boolean;
  scrollToTop: () => void;
  telegramUrl: string;
  maxUrl: string;
  telegramLabel: string;
  maxLabel: string;
  topLabel: string;
}

export default function FloatingButtons({
  visible,
  scrolled,
  scrollToTop,
  telegramUrl,
  maxUrl,
  telegramLabel,
  maxLabel,
  topLabel,
}: FloatingButtonsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={`fixed bottom-6 right-6 z-40 flex flex-col gap-3 transition-all duration-300 ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        {/* Наверх */}
        {scrolled && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-card border border-border hover:border-brand/30 text-foreground hover:text-brand rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                aria-label={topLabel}
              >
                <ArrowUp size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs font-medium">
              {topLabel}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Telegram */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#229ED9] hover:bg-[#1a8bc4] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              aria-label={telegramLabel}
            >
              <Send size={20} />
            </a>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs font-medium">
            {telegramLabel}
          </TooltipContent>
        </Tooltip>

        {/* Max */}
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={maxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#0f1117] hover:bg-[#1a1a2a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all border border-white/10"
              aria-label={maxLabel}
            >
              <MessageCircle size={20} />
            </a>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs font-medium">
            {maxLabel}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

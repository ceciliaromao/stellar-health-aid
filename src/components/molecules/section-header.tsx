"use client";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface SectionHeaderProps {
  title: string;
  href?: string; // se existir mostra botão Ver tudo
  className?: string;
  rightAdornment?: React.ReactNode; // permitir algo custom no futuro
  "aria-label"?: string;
}

export function SectionHeader({
  title,
  href,
  className,
  rightAdornment,
  ...rest
}: Readonly<SectionHeaderProps>) {
  return (
    <div
      className={cn("flex items-center justify-between mb-3", className)}
      {...rest}
    >
      <h2 className="text-[15px] font-semibold tracking-tight text-gray-800">
        {title}
      </h2>
      {rightAdornment ? (
        <div className="flex items-center">{rightAdornment}</div>
      ) : href ? (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 pl-4 pr-2 h-9 rounded-full border border-black/80 text-[13px] font-medium hover:bg-black/5 transition"
          aria-label={`Ver tudo de ${title}`}
        >
          <span>Ver tudo</span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-black text-base font-bold">
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      ) : null}
    </div>
  );
}

export default SectionHeader;

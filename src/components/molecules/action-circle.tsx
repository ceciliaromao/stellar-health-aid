"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ActionCircleProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  className?: string;
}

export function ActionCircle({ href, label, icon, className }: Readonly<ActionCircleProps>) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        className
      )}
    >
      <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400 text-black shadow-md transition-transform active:scale-95">
        <span className="[&>svg]:w-7 [&>svg]:h-7">{icon}</span>
      </span>
      <span className="text-xs font-medium text-center text-neutral-800 select-none">{label}</span>
    </Link>
  );
}

interface RowProps {
  children: React.ReactNode;
}

export function ActionCirclesRow({ children }: Readonly<RowProps>) {
  return (
    <div className="flex items-center justify-around w-full pt-2 pb-1">{children}</div>
  );
}

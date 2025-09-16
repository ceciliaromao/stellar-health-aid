"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { CommunityCard, type CommunityItem } from "@/components/molecules/community-card";
import { cn } from "@/lib/utils";

export interface CommunityCarouselProps {
  items: CommunityItem[];
  onDonate?: (id: string) => void;
  onDetails?: (id: string) => void;
  className?: string;
}

export function CommunityCarousel({ items, onDonate, onDetails, className }: Readonly<CommunityCarouselProps>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const children = Array.from(el.children);
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      const dist = Math.abs(rect.left - el.getBoundingClientRect().left - 16); // padding offset
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setIndex(closest);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6 scrollbar-none"
        style={{ scrollSnapType: "x mandatory" }}
        aria-label="Casos da comunidade"
      >
        {items.map((item) => (
          <div key={item.id} className="snap-start">
            <CommunityCard {...item} onDonate={onDonate} onDetails={onDetails} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            aria-label={`Ir para card ${i + 1}`}
            onClick={() => {
              const el = containerRef.current;
              if (!el) return;
              const child = el.children[i] as HTMLElement | undefined;
              if (child) {
                el.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" });
              }
            }}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition",
              i === index ? "bg-yellow-400 scale-110" : "bg-gray-300 hover:bg-gray-400"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default CommunityCarousel;
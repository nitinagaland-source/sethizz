"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  href?: string;
  price?: string | number;
  meta?: { label: string; value: string }[];
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  onSlideClick?: (slide: CoverflowSlide, index: number) => void;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(160px, 26vw, 290px)",
  gap = 0.05,
  loop = true,
  showCaption = false,
  showPagination = false,
  showNavigation = false,
  onSlideClick,
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    startX: number;
    startY: number;
    x: number;
    pos: number;
    v: number;
    t: number;
    moved: boolean;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  // Paint straight to the DOM.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const diff = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (diff > 6) {
      drag.moved = true;
    }

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const moved = drag.moved;
    dragRef.current = null;
    if (moved) {
      const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
      settle(clamp(Math.round(posRef.current + carried)));
    }
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const handleCardClick = (e: React.MouseEvent, slide: CoverflowSlide, index: number) => {
    e.stopPropagation();
    if (dragRef.current?.moved) return;

    if (index === selected) {
      // Direct purchase / subpage navigation
      if (onSlideClick) {
        onSlideClick(slide, index);
      } else if (slide.href) {
        window.location.href = slide.href;
      }
    } else {
      // Bring slide to center
      goTo(index);
    }
  };

  const active = slides[selected];

  return (
    <div
      className={cn("w-full", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden py-8 sm:py-10 outline-none select-none active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isCurrent = index === selected;
              return (
                <div
                  key={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  onClick={(e) => handleCardClick(e, slide, index)}
                  className={cn(
                    "absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl will-change-transform cursor-pointer transition-all duration-300 group/card",
                    isCurrent ? "scale-[1.02]" : "opacity-75 hover:opacity-100",
                    cardClassName,
                  )}
                  style={{ width: "var(--cf-card)" }}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    className="h-full w-full select-none object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />

                  {/* Gradient Title & Price Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                    <div>
                      <span className="text-white text-xs font-bold block truncate drop-shadow-md">
                        {slide.title}
                      </span>
                      {slide.price && (
                        <span className="text-emerald-400 text-[11px] font-extrabold block drop-shadow-sm">
                          {slide.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-2 sm:left-4 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/70 p-2.5 text-white backdrop-blur transition hover:bg-black cursor-pointer border border-white/20 active:scale-95 shadow-lg"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-2 sm:right-4 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/70 p-2.5 text-white backdrop-blur transition hover:bg-black cursor-pointer border border-white/20 active:scale-95 shadow-lg"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-2 flex flex-col items-center px-4 duration-300 animate-in fade-in max-w-md mx-auto"
        >
          <p className="text-base sm:text-lg font-extrabold tracking-tight text-white text-center">
            {active.title}
          </p>
          {active.subtitle && (
            <p className="mt-0.5 text-xs sm:text-[13px] text-zinc-400 text-center">
              {active.subtitle}
            </p>
          )}

          {/* Direct Buy / View Product CTA Button */}
          <button
            type="button"
            onClick={(e) => handleCardClick(e, active, selected)}
            className="mt-4 inline-flex items-center justify-center gap-2 h-11 px-6 w-full max-w-[260px] rounded-full bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer border border-white/20"
          >
            <ShoppingBag size={14} className="text-zinc-950" />
            <span>View Product & Buy</span>
            <ArrowUpRight size={14} />
          </button>

          {active.meta && active.meta.length > 0 && (
            <dl className="mt-4 w-full max-w-[260px] text-[11.5px] bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl border border-zinc-800 text-zinc-300 space-y-1.5 shadow-inner">
              {active.meta.map((row) => (
                <div key={row.label} className="flex justify-between items-center py-0.5 border-b border-zinc-800/80 last:border-0">
                  <dt className="text-zinc-400 text-[11px]">{row.label}</dt>
                  <dd className="font-semibold text-white text-[11.5px]">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "size-2 rounded-full transition-all cursor-pointer",
                index === selected ? "w-6 bg-white" : "bg-white/30 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

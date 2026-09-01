import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLightbox } from "./Lightbox";
import { hotspotsFor } from "@/lib/hotspots";

const HINT_KEY_BASE = "almedia-link-lightbox-hint-seen-v2";

export function UploadSlot({
  slotId,
  caption,
  className,
  overlay,
  ratio = "phone",
  media = "image",
  src,
  hint = false,
  hintDelayMs = 0,
  emphasize = false,
  scale = 1,
  zoom,
  offsetY = 0,
  startAt = 0,
}: {
  slotId?: string;
  caption: string;
  className?: string;
  overlay?: ReactNode;
  ratio?: "phone" | "wide" | "icon";
  media?: "image" | "video" | undefined;
  src?: string | undefined;
  hint?: boolean | undefined;
  hintDelayMs?: number | undefined;
  emphasize?: boolean | undefined;
  scale?: number | undefined;
  zoom?: number | undefined;
  offsetY?: number | undefined;
  startAt?: number | undefined;
}) {
  const isVideo = media === "video";
  const lightbox = useLightbox();
  const spots = hotspotsFor(slotId);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [showHint, setShowHint] = useState(false);
  const mediaSrc = src && isVideo && startAt > 0 ? `${src}#t=${startAt}` : src;

  const hintKey = `${HINT_KEY_BASE}:${slotId ?? caption}`;

  useEffect(() => {
    if (!hint || !src) return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(hintKey) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const el = wrapRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          if (hintDelayMs > 0) {
            timer = setTimeout(() => setShowHint(true), hintDelayMs);
          } else {
            setShowHint(true);
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [hint, src, hintKey, hintDelayMs]);

  const dismissHint = () => {
    setShowHint(false);
    try {
      window.localStorage.setItem(hintKey, "1");
    } catch {
      /* ignore */
    }
  };

  const openLightbox = () => {
    if (!src || !lightbox) return;
    if (showHint) dismissHint();
    lightbox.open({
      src: mediaSrc ?? src,
      caption,
      media,
      hotspots: spots,
      zoom: zoom ?? scale,
      badge: emphasize,
    });
  };


  const inner = src ? (
    isVideo ? (
      <video
        src={mediaSrc}
        muted
        loop
        controls
        preload="metadata"
        playsInline
        aria-label={caption}
        onLoadedMetadata={(event) => {
          if (startAt > 0) event.currentTarget.currentTime = startAt;
        }}
        onTimeUpdate={(event) => {
          if (startAt > 0 && event.currentTarget.currentTime < startAt) {
            event.currentTarget.currentTime = startAt;
          }
        }}
        onClick={(e) => e.stopPropagation()}
        className="block h-auto w-full rounded-3xl bg-cream object-contain"
      />
    ) : (
      <img
        src={src}
        alt={caption}
        className={
          "block w-full rounded-3xl " +
          (ratio === "icon" ? "aspect-square object-contain" : "h-auto")
        }
      />
    )
  ) : (
    <span
      className={
        "max-w-sm text-center font-medium leading-snug text-midnight/70 " +
        (ratio === "icon" ? "text-[11px]" : "text-xs leading-relaxed sm:text-sm")
      }
    >
      {caption}
    </span>
  );

  const frame =
    ratio === "phone"
      ? "aspect-[9/16] mx-auto w-full max-w-[380px]"
      : ratio === "icon"
        ? "aspect-square mx-auto w-full max-w-[190px]"
        : "aspect-[16/10] w-full";

  const baseWidth = ratio === "phone" ? 380 : ratio === "icon" ? 190 : 0;
  const scaleStyle =
    scale !== 1 && baseWidth
      ? { maxWidth: `${Math.round(baseWidth * scale)}px` }
      : undefined;

  const sizeOnly =
    ratio === "phone"
      ? "mx-auto w-full max-w-[380px]"
      : ratio === "icon"
        ? "mx-auto w-full max-w-[190px]"
        : "w-full";

  const frameClass = src
    ? "relative block rounded-3xl bg-transparent " + sizeOnly
    : "relative flex items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-sky/40 bg-sky/10 " +
      frame +
      (ratio === "icon" ? " p-2.5" : " p-5");

  return (
    <div
      ref={wrapRef}
      className={"relative " + (className ?? "")}
      {...(offsetY ? { style: { marginTop: `${offsetY}px` } } : {})}
    >
      {src ? (
        <button
          type="button"
          onClick={openLightbox}
          aria-label={`Expand image: ${caption}`}
          {...(scaleStyle ? { style: scaleStyle } : {})}
          className={
            frameClass +
            " cursor-zoom-in outline-none transition-transform duration-200 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-lead focus-visible:ring-offset-2"
          }
        >
          {inner}
          {emphasize ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[14%] top-[14%] grid size-9 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#E5322D] text-base font-bold leading-none text-pure-white shadow-lg ring-4 ring-cream"
            >
              1
            </span>
          ) : null}
          {showHint ? (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1 rounded-[1.75rem] ring-[3px] ring-lead"
                style={{ animation: "hint-halo 1.8s ease-out infinite" }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl bg-midnight/25"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lead text-pure-white shadow-2xl"
                style={{ animation: "hint-tap 1.4s ease-in-out infinite" }}
              >
                <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5M11 8v6M8 11h6" />
                </svg>
              </span>
            </>
          ) : null}
          {overlay}
        </button>
      ) : (
        <div className={frameClass}>
          {inner}
          {overlay}
        </div>
      )}


      {spots.length > 0 ? (
        <ul className="sr-only">
          {spots.map((s, i) => (
            <li key={i}>
              {s.type === "good" ? "Good" : "Avoid"}: {s.label}. {s.note}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

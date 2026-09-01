import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Hotspot } from "@/lib/hotspots";

type LightboxItem = {
  src: string;
  caption: string;
  media?: "image" | "video" | undefined;
  hotspots?: Hotspot[];
  zoom?: number | undefined;
  badge?: boolean | undefined;
};

const LightboxContext = createContext<{ open: (item: LightboxItem) => void } | null>(null);

export function useLightbox() {
  return useContext(LightboxContext);
}

function MarkerIcon({ type }: { type: Hotspot["type"] }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === "good" ? <path d="M20 6L9 17l-5-5" /> : <path d="M18 6L6 18M6 6l12 12" />}
    </svg>
  );
}

function Marker({
  spot,
  active,
  onActivate,
  onDismiss,
}: {
  spot: Hotspot;
  active: boolean;
  onActivate: () => void;
  onDismiss: () => void;
}) {
  const isGood = spot.type === "good";
  // The connector runs outward from the element it points at, so the note
  // never covers the thing it is describing.
  const flip = spot.x < 50;

  return (
    <div
      className={
        "absolute flex -translate-y-1/2 items-center " +
        (active ? "z-50 " : "z-10 ") +
        (flip ? "-translate-x-full flex-row-reverse" : "flex-row")
      }
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
    >
      <span
        aria-hidden="true"
        className={
          "size-2.5 shrink-0 rounded-full ring-2 " +
          (isGood ? "bg-lead ring-pure-white" : "bg-sky ring-pure-white")
        }
      />
      <span
        aria-hidden="true"
        style={spot.lineLength ? { width: `${spot.lineLength}px` } : undefined}
        className={
          "h-px shrink-0 " +
          (spot.lineLength ? "" : "w-8 sm:w-12 ") +
          (isGood ? "bg-lead" : "bg-pure-white")
        }
      />


      <div className="relative">
        <button
          type="button"
          aria-label={`${spot.label}: ${spot.note}`}
          aria-expanded={active}
          onMouseEnter={onActivate}
          onMouseLeave={onDismiss}
          onFocus={onActivate}
          onBlur={onDismiss}
          onClick={(e) => {
            e.stopPropagation();
            active ? onDismiss() : onActivate();
          }}
          className={
            "flex items-center gap-1.5 whitespace-nowrap rounded-full border py-1.5 pl-1.5 pr-3 text-xs font-semibold shadow-lg outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-lead " +
            (isGood
              ? "border-sky/30 bg-pure-white text-midnight hover:border-lead/40 "
              : "border-midnight/15 bg-pure-white text-midnight/70 ") +
            (active ? "scale-[1.03]" : "")
          }
        >
          <span
            className={
              "grid size-5 shrink-0 place-items-center rounded-full text-pure-white " +
              (isGood ? "bg-lead" : "bg-sky")
            }
          >
            <MarkerIcon type={spot.type} />
          </span>
          {spot.short}
        </button>

        <div
          className={
            "pointer-events-none absolute top-[calc(100%+0.5rem)] z-[60] w-60 rounded-2xl border border-sky/25 bg-pure-white p-3 text-left shadow-2xl transition-all duration-200 " +
            (flip ? "right-0" : "left-0") +
            (active ? " translate-y-0 opacity-100" : " -translate-y-1 opacity-0")
          }
        >
          <span
            className={
              "text-[11px] font-bold uppercase tracking-wide " +
              (isGood ? "text-lead" : "text-midnight/60")
            }
          >
            {spot.label}
          </span>
          <p className="mt-1 text-xs leading-relaxed text-midnight/80">{spot.note}</p>
        </div>
      </div>
    </div>
  );
}


export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null);
  const [shown, setShown] = useState(false);
  const [activeSpot, setActiveSpot] = useState<number | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [viewport, setViewport] = useState<{ w: number; h: number; dpr: number }>({
    w: 1280,
    h: 800,
    dpr: 1,
  });

  useEffect(() => {
    const read = () =>
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
      });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  // Size the media explicitly so the aspect ratio can never drift, and never
  // upscale past what the display can actually resolve (no soft/blurry pixels).
  const zoomStyle = (() => {
    if (!natural || !natural.w || !natural.h) return undefined;
    const ratio = natural.w / natural.h;
    const isNarrow = viewport.w < 640;
    const availW = viewport.w * (isNarrow ? 0.86 : 0.6);
    const availH = viewport.h * (isNarrow ? 0.72 : 0.88);
    // Vector art has no resolution limit, so let it fill the available space.
    const isVector = /\.svg(\?|#|$)/i.test(item?.src ?? "");
    const maxScale = isVector ? Infinity : Math.max(1, Math.min(1.5, viewport.dpr));
    const zoom = item?.zoom ?? 1;
    const capW = Math.min(natural.w * maxScale, availW, availH * ratio) * zoom;
    const w = Math.max(1, Math.round(capW));
    return { width: `${w}px`, height: `${Math.round(w / ratio)}px` };
  })();

  useEffect(() => {
    if (!item || item.media === "video") return;
    const probe = new Image();
    probe.onload = () => setNatural({ w: probe.naturalWidth, h: probe.naturalHeight });
    probe.src = item.src;
  }, [item]);

  const open = useCallback((next: LightboxItem) => {
    setItem(next);
    setActiveSpot(null);
    setNatural(null);
    requestAnimationFrame(() => setShown(true));
  }, []);

  const close = useCallback(() => {
    setShown(false);
    setTimeout(() => setItem(null), 200);
  }, []);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, close]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {item ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={item.caption}
          onClick={close}
          className={
            "fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-midnight/60 p-5 transition-opacity duration-200 sm:p-8 " +
            (shown ? "opacity-100" : "opacity-0")
          }
        >
          <div
            className={
              "pointer-events-none relative my-auto w-full max-w-[min(94vw,1240px)] transition-all duration-200 ease-out " +
              (shown ? "scale-100 opacity-100" : "scale-95 opacity-0")
            }
          >
            <div className="relative mx-auto inline-block w-full">
              <div
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto relative mx-auto w-fit"
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close image"
                  className="absolute -right-3 -top-3 z-20 grid size-9 place-items-center rounded-full bg-pure-white text-midnight shadow-lg outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-lead"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
                {item.media === "video" ? (
                  <video
                    src={item.src}
                    muted
                    loop
                    controls
                    playsInline
                    aria-label={item.caption}
                    onLoadedMetadata={(e) =>
                      setNatural({ w: e.currentTarget.videoWidth, h: e.currentTarget.videoHeight })
                    }
                    style={zoomStyle}
                    className="block h-auto w-auto rounded-3xl object-contain shadow-2xl"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.caption}
                    onLoad={(e) =>
                      setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
                    }
                    style={zoomStyle}
                    className="block h-auto w-auto rounded-3xl object-contain shadow-2xl"
                  />
                )}
                {item.badge ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[14%] top-[14%] z-10 grid size-12 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-[#E5322D] text-xl font-bold leading-none text-pure-white shadow-lg ring-4 ring-pure-white"
                  >
                    1
                  </span>
                ) : null}
                {(item.hotspots ?? []).map((spot, i) => (
                  <Marker
                    key={i}
                    spot={spot}
                    active={activeSpot === i}
                    onActivate={() => setActiveSpot(i)}
                    onDismiss={() => setActiveSpot((cur) => (cur === i ? null : cur))}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </LightboxContext.Provider>
  );
}

import type { ReactNode } from "react";
import { UploadSlot } from "./UploadSlot";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
}

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function Cross() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export type Slot =
  | string
  | { caption: string; src: string; emphasize?: boolean; scale?: number; offsetY?: number; startAt?: number };

const cap = (s: Slot) => (typeof s === "string" ? s : s.caption);
const url = (s: Slot) => (typeof s === "string" ? undefined : s.src);
const emph = (s: Slot) => (typeof s === "string" ? false : s.emphasize === true);
const scaleOf = (s: Slot) => (typeof s === "string" ? 1 : (s.scale ?? 1));
const offsetOf = (s: Slot) => (typeof s === "string" ? 0 : (s.offsetY ?? 0));
const startOf = (s: Slot) => (typeof s === "string" ? 0 : (s.startAt ?? 0));

function Panel({
  variant,
  points,
  placeholders,
  slotId,
  ratio = "phone",
  media,
  hint = false,
  hintDelayMs = 0,
  rows,
}: {
  variant: "do" | "dont";
  points: ReactNode[];
  placeholders: Slot[];
  slotId: string;
  ratio?: "phone" | "wide" | "icon" | undefined;
  media?: "image" | "video" | undefined;
  hint?: boolean | undefined;
  hintDelayMs?: number | undefined;
  rows: number;
}) {

  const isDo = variant === "do";
  const badge = (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide " +
        (isDo ? "bg-lead text-pure-white" : "bg-midnight/70 text-pure-white")
      }
    >
      {isDo ? <Check /> : <Cross />}
      {isDo ? "Do" : "Don't"}
    </span>
  );
  const multi = placeholders.length > 1;
  return (
    <div
      style={{ gridRow: `span ${rows + 1} / span ${rows + 1}` }}
      className={
        "flex flex-col gap-2 rounded-3xl p-4 sm:p-5 sm:grid sm:grid-rows-subgrid sm:content-start " +
        (isDo ? "bg-lead/[0.07] border border-lead/20" : "bg-midnight/[0.06] border border-midnight/15")
      }
    >
      <div>
        {badge}
        {multi ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {placeholders.map((p, i) => (
              <UploadSlot
                key={i}
                slotId={`${slotId}-${i}`}
                caption={cap(p)}
                {...(url(p) ? { src: url(p) } : {})}
                ratio={ratio}
                emphasize={emph(p)}
                scale={scaleOf(p)}
                offsetY={offsetOf(p)}
                startAt={startOf(p)}
                {...(media ? { media } : {})}
              />
            ))}
          </div>
        ) : (
          <UploadSlot
            slotId={slotId}
            caption={placeholders[0] ? cap(placeholders[0]) : ""}
            {...(placeholders[0] && url(placeholders[0]) ? { src: url(placeholders[0]!) } : {})}
            className="mt-3"
            ratio={ratio}
            scale={placeholders[0] ? scaleOf(placeholders[0]) : 1}
            zoom={1}
            startAt={placeholders[0] ? startOf(placeholders[0]) : 0}
            {...(media ? { media } : {})}
            hint={hint}
            hintDelayMs={hintDelayMs}

          />
        )}
      </div>
      <ul className="mt-4 space-y-2 sm:contents">
        {points.map((point, i) => (
          <li
            key={i}
            className={
              "flex items-start gap-2.5 rounded-2xl px-3 py-2 text-sm font-medium leading-snug " +
              (i === 0 ? "sm:mt-2 " : "") +
              (isDo ? "bg-pure-white text-midnight" : "bg-pure-white/70 text-midnight/70")
            }
          >
            <span
              aria-hidden="true"
              className={
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full " +
                (isDo ? "bg-lead text-pure-white" : "bg-midnight/60 text-pure-white")
              }
            >
              {isDo ? <Check /> : <Cross />}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DoDont({
  title,
  doPoints,
  doPlaceholder,
  dontPoints,
  dontPlaceholder,
  ratio,
  media,
  hintDo = false,
  hintDont = false,
  hintDelayMs = 0,
}: {
  title: string;
  doPoints: ReactNode[];
  doPlaceholder: Slot | Slot[];
  dontPoints: ReactNode[];
  dontPlaceholder: Slot | Slot[];
  ratio?: "phone" | "wide" | "icon" | undefined;
  media?: "image" | "video" | undefined;
  hintDo?: boolean | undefined;
  hintDont?: boolean | undefined;
  hintDelayMs?: number | undefined;
}) {
  const toList = (v: Slot | Slot[]): Slot[] => (Array.isArray(v) ? v : [v]);
  const rows = Math.max(doPoints.length, dontPoints.length);
  return (
    <div className="mt-8">
      <div
        className="grid gap-4 sm:grid-cols-2"
        style={{ gridTemplateRows: `auto repeat(${rows}, auto)` }}
      >
        <Panel
          variant="do"
          points={doPoints}
          placeholders={toList(doPlaceholder)}
          slotId={`${slug(title)}-do`}
          rows={rows}
          ratio={ratio}
          hint={hintDo}
          hintDelayMs={hintDelayMs}
          {...(media ? { media } : {})}
        />

        <Panel
          variant="dont"
          points={dontPoints}
          placeholders={toList(dontPlaceholder)}
          slotId={`${slug(title)}-dont`}
          rows={rows}
          ratio={ratio}
          hint={hintDont}
          hintDelayMs={hintDelayMs}
          {...(media ? { media } : {})}
        />
      </div>
    </div>
  );
}
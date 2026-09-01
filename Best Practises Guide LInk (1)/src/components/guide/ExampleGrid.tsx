import type { ReactNode } from "react";
import { UploadSlot } from "./UploadSlot";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
}

export type Example = {
  label: string;
  visual: string;
  why: ReactNode;
};

export function ExampleGrid({ items, columns = 2 }: { items: Example[]; columns?: 2 | 3 }) {
  return (
    <div
      className={
        "mt-8 grid gap-4 " + (columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")
      }
    >
      {items.map((it) => (
        <figure
          key={it.label}
          className="flex flex-col rounded-3xl border border-sky/25 bg-sky/[0.06] p-4 sm:p-5"
        >
          <UploadSlot
            slotId={slug(it.label)}
            caption={it.visual}
            className="flex-1"
            overlay={
              <span className="absolute left-3 top-3 inline-flex rounded-full bg-midnight px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-pure-white">
                {it.label}
              </span>
            }
          />
          <figcaption className="mt-4 text-sm leading-relaxed text-midnight">
            <span className="font-bold text-lead">Why it works: </span>
            {it.why}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

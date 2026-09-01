import { useEffect, useRef, useState } from "react";

export type Chapter = {
  start: number;
  end: number;
  title: string;
  note: string;
};

export function ChapteredVideo({
  src,
  caption,
  ariaLabel,
  chapters,
  aspect = "450/915",
  hasAudio = false,
}: {
  src: string;
  caption: string;
  ariaLabel?: string | undefined;
  chapters: Chapter[];
  aspect?: string;
  hasAudio?: boolean;
}) {
  const label = ariaLabel || caption;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const userPausedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(true);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(true);


  const duration = chapters[chapters.length - 1]?.end ?? 1;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      const t = v.currentTime;
      const idx = chapters.findIndex((c) => t >= c.start && t < c.end);
      if (idx !== -1 && idx !== active) setActive(idx);
    };
    const onPlay = () => {
      setPaused(false);
      setEnded(false);
    };
    const onPause = () => setPaused(true);
    const onEnded = () => setEnded(true);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
    };
  }, [active, chapters]);

  const jumpTo = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    const c = chapters[i];
    if (!c) return;
    setActive(i);
    setEnded(false);
    userPausedRef.current = false;
    v.currentTime = c.start + 0.01;
    void v.play();
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      if (ended) {
        jumpTo(0);
        return;
      }
      userPausedRef.current = false;
      void v.play();
    } else {
      userPausedRef.current = true;
      v.pause();
    }
  };


  const current = chapters[active];



  return (
    <figure className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
      <div className="relative mx-auto w-full max-w-[380px]">
        <video
          ref={videoRef}
          src={src}
          muted={muted}
          playsInline
          preload="metadata"
          aria-label={label}
          onClick={togglePlay}
          style={{ aspectRatio: aspect }}
          className="block w-full cursor-pointer rounded-3xl bg-midnight object-cover"
        />

        {paused ? (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={ended ? "Replay the video" : "Play the video"}
            style={{ aspectRatio: aspect }}
            className="absolute inset-x-0 top-0 grid place-items-center rounded-3xl bg-midnight/25 outline-none focus-visible:ring-2 focus-visible:ring-lead"
          >
            <span className="grid size-16 place-items-center rounded-full bg-lead text-pure-white shadow-2xl">
              {ended ? (
                <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-7 translate-x-[2px]" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </span>
          </button>
        ) : null}


        {hasAudio ? (

          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute the voiceover" : "Mute the voiceover"}
            className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-midnight/70 px-3 py-2 text-[11px] font-semibold text-pure-white backdrop-blur transition-colors hover:bg-midnight/85"
          >
            {muted ? (
              <>
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 5 6 9H3v6h3l5 4z" />
                  <path d="m17 9 4 6M21 9l-4 6" />
                </svg>
                Sound off
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 5 6 9H3v6h3l5 4z" />
                  <path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />
                </svg>
                Sound on
              </>
            )}
          </button>
        ) : null}

        {/* chapter timeline */}
        <div className="mt-3 flex gap-1.5" role="list" aria-label="Video chapters">
          {chapters.map((c, i) => (
            <button
              key={i}
              type="button"
              role="listitem"
              onClick={() => jumpTo(i)}
              aria-label={`Chapter ${i + 1}: ${c.title}`}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{
                flexGrow: (c.end - c.start) / duration,
                backgroundColor:
                  i < active ? "var(--color-lead)" : i === active ? "var(--color-lead)" : "color-mix(in srgb, var(--color-sky) 45%, transparent)",
                opacity: i <= active ? 1 : 0.9,
              }}
            />
          ))}
        </div>
        {hasAudio ? (
          <p className="mt-2 text-center text-[11px] font-medium text-midnight/50">
            This clip has a voiceover. It starts muted, tap the sound button to hear it.
          </p>
        ) : null}
      </div>

      <div className="lg:pl-2">
        <ol className="space-y-3">
          {chapters.map((c, i) => {
            const isActive = i === active;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={
                    "w-full rounded-2xl border p-4 text-left transition-colors " +
                    (isActive
                      ? "border-lead bg-lead/5"
                      : "border-sky/25 bg-pure-white hover:border-sky/50")
                  }
                >
                  <span className="flex items-start gap-3">
                    <span
                      className={
                        "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold " +
                        (isActive ? "bg-lead text-pure-white" : "bg-sky/20 text-midnight/70")
                      }
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-midnight">{c.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-midnight/70">{c.note}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 flex flex-nowrap items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="shrink-0 rounded-full bg-lead px-5 py-2.5 text-sm font-semibold text-pure-white transition-transform hover:scale-[1.02]"
          >
            {ended ? "Watch again" : paused ? "Play the flow" : "Pause"}
          </button>
          {current ? (
            <span className="min-w-0 text-[11px] font-medium uppercase leading-tight tracking-wide text-midnight/50">
              Step {active + 1} of {chapters.length}: {current.title}
            </span>
          ) : null}
        </div>

      </div>

      {caption ? (
        <figcaption className="text-sm leading-relaxed text-midnight/60 lg:col-span-2">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { guideMarkdown } from "@/lib/guide-markdown";
import { popupAuditPrompt, entryPointAuditPrompt } from "@/lib/ai-audit-prompts";
import { PromptCard } from "@/components/guide/PromptCard";
import { DoDont } from "@/components/guide/DoDont";
import { Reveal } from "@/components/guide/Reveal";
import { UploadSlot } from "@/components/guide/UploadSlot";
import { ChapteredVideo } from "@/components/guide/ChapteredVideo";
import { PointerArrow } from "@/components/guide/PointerArrow";
import popupTimingDo from "@/assets/popup-timing-do-trimmed.mp4";
import popupTimingDont from "@/assets/popup-timing-dont.mp4.asset.json";
import { LightboxProvider } from "@/components/guide/Lightbox";
import iconRewardsFab from "@/assets/icon-rewards-fab-v2.png.asset.json";
import iconFreecash from "@/assets/icon-rewards-b.png.asset.json";
import iconDontA from "@/assets/icon-dont-a.svg.asset.json";
import iconDontB from "@/assets/icon-dont-b.svg.asset.json";
import popupDoTight from "@/assets/popup-do-tight.webp";
import popupDont from "@/assets/popup-dont.png.asset.json";
import earnPopupDo from "@/assets/earn-popup-do.png.asset.json";
import earnPopupDont from "@/assets/earn-popup-dont.png.asset.json";
import fullFlowVideo from "@/assets/full-flow.mp4.asset.json";
import rewardedProgressionVideo from "@/assets/rewarded-progression.mp4.asset.json";
import earnTabFlowVideo from "@/assets/earn-tab-flow.mp4.asset.json";
import placementHomescreen from "@/assets/placement-homescreen.png.asset.json";
import placementShop from "@/assets/placement-shop.png.asset.json";
import placementBanner from "@/assets/placement-banner-rounded.png";

import linkCoin from "@/assets/link-coin.png.asset.json";
import linkLogo from "@/assets/link-logo-blue.png";
import heroBlob from "@/assets/hero-blob-blue.png";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Almedia Link: Best Practices for Publishers" },
      {
        name: "description",
        content:
          "Timing, pop-up design, social proof, entry points and a pre-launch checklist for a 15% install-to-link rate.",
      },
      { property: "og:title", content: "Almedia Link: Best Practices for Publishers" },
      {
        property: "og:description",
        content:
          "Timing, pop-up design, social proof, entry points and a pre-launch checklist for a 15% install-to-link rate.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: "Almedia Link: Best Practices for Publishers",
          description:
            "Pop-up placement, pop-up design, homescreen icon, post-link user flow and a checklist for a high install-to-link rate.",
          articleSection: [
            "Pop-up placement",
            "Pop-up design",
            "Homescreen icon",
            "User Flow after linking",
            "Checklist",
          ],
          articleBody: guideMarkdown,
        }),
      },
    ],
  }),
  component: Guide,
});


function Blob({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className={"pointer-events-none absolute -z-10 " + (className ?? "")}
    >
      <path
        fill="currentColor"
        d="M42.7,-63.7C55.1,-56.5,64.6,-44.1,70.6,-30.3C76.6,-16.5,79.1,-1.4,75.8,12.2C72.5,25.8,63.5,37.9,52.6,48.4C41.7,58.9,29,67.8,14.4,72.2C-0.2,76.6,-16.7,76.5,-31.4,71C-46.1,65.5,-59,54.7,-66.6,41.2C-74.2,27.7,-76.5,11.5,-74.3,-3.9C-72.1,-19.3,-65.4,-33.9,-55,-45.3C-44.6,-56.7,-30.5,-64.9,-15.9,-69.2C-1.3,-73.5,13.8,-73.9,27.4,-71.3C30.9,-70.6,36.6,-68.5,42.7,-63.7Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

function Pill({ tone = "clay", children }: { tone?: "clay" | "lead" | "sky"; children: React.ReactNode }) {
  const tones = {
    clay: "bg-sky/20 text-midnight",
    lead: "bg-lead text-pure-white",
    sky: "bg-sky text-midnight",
  } as const;
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide " +
        tones[tone]
      }
    >
      {children}
    </span>
  );
}

function Placeholder({ caption, ratio = "phone" }: { caption: string; ratio?: "phone" | "wide" }) {
  return (
    <figure className="mt-8">
      <UploadSlot
        slotId={caption.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60)}
        caption={caption}
        ratio={ratio}
        media="video"
      />
    </figure>
  );
}

function Section({
  id,
  eyebrow,
  intro,
  badge,
  before,
  children,
}: {
  id: string;
  eyebrow: string;
  intro?: string;
  badge?: React.ReactNode;
  before?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 border-t border-border py-14 sm:py-20">
      <Reveal className="mx-auto max-w-4xl px-5 sm:px-8">
        {before}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl leading-[1.05] sm:text-4xl">{eyebrow}</h2>
          {badge}
        </div>
        {intro ? (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-midnight/70">{intro}</p>
        ) : null}
        {children}
      </Reveal>
    </section>
  );
}

function Outcome({
  id,
  num,
  title,
  intro,
  badge,
  flush,
  children,
}: {
  id: string;
  num: string;
  title: string;
  intro: string;
  badge?: React.ReactNode;
  flush?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={
        "relative scroll-mt-24 py-16 sm:py-24 " + (flush ? "" : "border-t border-border")
      }
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-lead px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-pure-white">
              {num}
            </span>
            {badge}
          </div>
          <h2 className="mt-4 text-balance text-3xl leading-[1.05] text-midnight sm:text-[2.5rem]">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-midnight/70">{intro}</p>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function Sub({
  id,
  title,
  intro,
  badge,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mt-14 scroll-mt-24 first:mt-10">
      <div id={id} className="scroll-mt-24" />

      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-bold text-midnight sm:text-2xl">{title}</h3>
        {badge}
      </div>
      {intro ? (
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-midnight/70">{intro}</p>
      ) : null}
      {children}
    </Reveal>
  );
}



function Q({ children }: { children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="select-none">&ldquo;</span>
      {children}
      <span aria-hidden="true" className="select-none">&rdquo;</span>
    </>
  );
}

const checklist = [

  {
    group: "Pop-up placement",
    items: [
      "Surfaces within the first 2-5 minutes of play time",
      "Force-shown, no tap required",
      "Re-shown at least every 30 minutes to unlinked players",
      "Never fired straight after a rewarded ad",
      "Not capped to once per session",
      "Rolled out to at least 90% of users",
    ],
  },
  {
    group: "Pop-up design",
    items: [
      "Covers at least half the screen and native to your game's art and fonts",
      "Dismissal blocked for a few seconds",
      "$10 sign-up bonus stated outright",
      "In-game currency reward shown on the banner",
      "One clear CTA focused on rewards, no \"Sign Up\" wording",
      "Freecash icon used",
      "Includes a social-proof or trust-signal line",
    ],
  },
  {
    group: "Homescreen icon",
    items: [
      "Freecash icon carried on the button",
      "Reward signal (cash, coins or gift) visible on it",
      "Draws the eye: notification bubble, animation or colour highlight",
      "Placed in the homescreen corner or in the shop",
      "Stays on screen for anyone who hasn't linked",
      "Stays visible after linking, as the route into Rewarded Progression and the Earn Tab",
    ],
  },
  {
    group: "User flow (SDK 1.1+)",
    items: [
      "In-game reward paid out on the player's next return",
      "Player is shown that they received the reward",
      "Player is nudged toward the Freecash icon once, not auto-opened",
      "Rewarded Progression walked through once",
      "Icon badged with a red \"1\" on every milestone via reward notification",
    ],
  },
];

const bonusStage = {
  group: "Earn Tab",
  items: [
    "Own dedicated pop-up for the Earn Tab",
    "Exact offer reward and payout stated on that pop-up",
    "One clear CTA focused on Rewards, no \"Sign Up\" wording",
    "One-time tutorial: what an offer is and what it pays",
    "Earn Tab reachable from the same Freecash homescreen icon",
    "Earn Tab survey submitted so we can set it up",
  ],
};

const checklistTotal = checklist.reduce((n, g) => n + g.items.length, 0);
const bonusTotal = bonusStage.items.length;


function ChecklistRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <li>
      <label
        className={
          "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-base text-midnight transition-all duration-300 hover:bg-sky/10 " +
          (checked ? "border-lead/30 bg-lead/[0.06]" : "border-sky/25 bg-pure-white")
        }
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={
            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-all duration-300 " +
            (checked ? "scale-110 border-lead bg-lead" : "border-midnight/30 bg-pure-white")
          }
        >
          <svg
            viewBox="0 0 24 24"
            className={
              "size-3.5 text-pure-white transition-all duration-300 " +
              (checked ? "scale-100 opacity-100" : "scale-50 opacity-0")
            }
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <span className={checked ? "line-through opacity-60" : undefined}>{label}</span>
      </label>
    </li>
  );
}

function Guide() {
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [pendingUnlock, setPendingUnlock] = useState<number | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [bonusCelebrated, setBonusCelebrated] = useState(false);
  const [showBonusCelebration, setShowBonusCelebration] = useState(false);
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const checkedCount = checklist.reduce(
    (n, g) => n + g.items.filter((i) => checkedItems[i]).length,
    0,
  );
  const bonusDone = bonusStage.items.filter((i) => checkedItems[i]).length;
  const bonusComplete = bonusDone === bonusTotal;
  const coins = checkedCount * 10 + bonusDone * 15;
  const coinsTotal = checklistTotal * 10;
  const bonusCoinsTotal = bonusTotal * 15;
  const allDone = checkedCount === checklistTotal;

  // Auto-unlock the next stage as soon as the current one is fully checked.
  useEffect(() => {
    const current = checklist[unlockedIndex];
    if (!current) return;
    const complete = current.items.every((i) => checkedItems[i]);
    if (complete && unlockedIndex < checklist.length - 1) {
      setUnlockedIndex(unlockedIndex + 1);
      setPendingUnlock(null);
    }
  }, [checkedItems, unlockedIndex]);

  useEffect(() => {
    if (allDone && !celebrated) {
      setCelebrated(true);
      setShowCelebration(true);
    }
  }, [allDone, celebrated]);

  useEffect(() => {
    if (bonusComplete && !bonusCelebrated) {
      setBonusCelebrated(true);
      setShowBonusCelebration(true);
    }
  }, [bonusComplete, bonusCelebrated]);





  const copyText = async (text: string) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = false;
    }
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "0";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        /* ignore */
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 6000);
  };



  return (
    <LightboxProvider>
    <div className="min-h-screen overflow-x-hidden bg-pure-white">
      {copied ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4"
        >
          <div className="flex max-w-md items-start gap-3 rounded-2xl bg-midnight px-5 py-4 text-pure-white shadow-2xl">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-lead">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold">Copied to your clipboard</p>
              <p className="mt-0.5 text-xs leading-relaxed text-pure-white/70">
                Paste it into any AI assistant or coding agent.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCopied(false)}
              aria-label="Dismiss"
              className="ml-2 text-pure-white/50 transition-colors hover:text-pure-white"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      <main id="top">
        <section className="relative overflow-hidden py-20 sm:py-28">
          <Blob className="left-[-10%] top-[-20%] h-[420px] w-[420px] text-lead/20" />
          <Blob className="right-[-12%] top-[10%] h-[360px] w-[360px] text-lead/15" />
          <img
            src={heroBlob}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-4 w-[300px] opacity-100 sm:w-[420px]"
          />
          <img
            src={heroBlob}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 bottom-0 w-[260px] rotate-180 opacity-100 sm:w-[380px]"
          />
          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
            <img
              src={linkLogo}
              alt="Almedia Link logo"
              className="mx-auto mb-8 h-9 w-auto sm:h-12 md:h-14"
            />
            <h1 className="text-4xl leading-[1.02] text-midnight sm:text-6xl md:text-7xl">
              Best Practices
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-midnight/80 sm:text-xl">
              These are the patterns behind a high install-to-link rate, and a clear lift in LTV for
              linked users. Follow them to see better results.
            </p>
            <p className="sr-only">
              Every example is illustrated with Freecash art to show the structure only. Build it
              game native and keep the Freecash mark and the exact reward values.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => copyText(popupAuditPrompt)}
                className="w-full rounded-full bg-lead px-7 py-3.5 text-sm font-bold text-pure-white transition-transform hover:scale-[1.03] sm:w-auto"
              >
                Copy AI prompt: audit my pop-up
              </button>
              <button
                type="button"
                onClick={() => copyText(entryPointAuditPrompt)}
                className="w-full rounded-full border-2 border-lead bg-pure-white px-7 py-3.5 text-sm font-bold text-lead transition-transform hover:scale-[1.03] sm:w-auto"
              >
                Copy AI prompt: audit my entry point
              </button>
            </div>
          </div>

        </section>

        <section
          id="how-to-read"
          className="relative scroll-mt-24 border-t border-border px-5 pb-4 pt-12 sm:px-8 sm:pt-16"
        >
          <Reveal className="mx-auto max-w-4xl">

            <div className="relative overflow-hidden rounded-[1.75rem] bg-lead px-6 py-7 text-pure-white sm:px-9 sm:py-8">
              <img
                src={heroBlob}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-16 w-[260px] opacity-20 mix-blend-screen sm:w-[320px]"
              />
              <div className="relative">
                <span className="inline-flex w-fit items-center rounded-full bg-pure-white/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                  How to read this guide
                </span>
                <h2 className="mt-4 text-balance font-display text-2xl font-bold leading-[1.15] sm:text-[1.75rem]">
                  This is a layout guide, you make it game native
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-pure-white/85 sm:text-base">
                  Every example is illustrated with Freecash art to show the structure. Rebuild it{" "}
                  <b className="font-bold text-pure-white">game native</b>: your fonts, colours,
                  frames, art style. Keep only the Freecash logo at certain touch points.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <Outcome
          id="install-to-link"
          flush
          num="Outcome 01"
          title="How to maximize your install-to-link ratio"
          intro="Three levers decide how many installs turn into linked accounts: when the pop-up fires, what it says, and whether players can still find the offer later."
        >
        <Sub
          id="popup"
          title="Pop-up design"
          intro="The design of the pop-up should be native to your game, font, style etc. This is just an illustration of the components it should include."
        >
          <DoDont
            title="The pop-up itself"
            hintDo
            hintDont

            doPoints={[
              "Covers at least half the screen, gameplay dimmed behind it",
              "Dismissal blocked for the first 5 seconds",

              "$10 bonus stated outright",
              "In-game currency reward on the banner",
              "One clear CTA focused on Rewards",
              "Freecash icon used",
            ]}
            doPlaceholder={{
              caption:
                "Freecash pop-up covering about three quarters of the screen over dimmed gameplay, with a 5 second countdown next to the greyed-out close button, the in-game coin reward, cash and gift cards, a $10 sign-up bonus, one 'Start earning rewards' CTA and a social-proof line.",
              src: popupDoTight,
            }}
            dontPoints={[
              "Small card over barely dimmed gameplay",
              "Close button available immediately",
              "No $10 bonus stated anywhere",
              "No in-game currency reward shown",
              'Two competing CTAs, and "Sign Up" wording on the main one',
              "No Freecash icon, so the offer looks unknown",
            ]}

            dontPlaceholder={{
              caption:
                "Small pop-up card floating over barely dimmed gameplay with vague 'Coins for playing' and 'Cash bonus' rows, a 'Sign Up' button and a competing 'Check Link' button, and no social proof.",
              src: popupDont.url,
            }}
          />
          <div className="mt-8 rounded-3xl border border-sky/25 bg-sky/[0.06] p-5 sm:p-6">
            <h3 className="text-xs font-bold uppercase tracking-wide text-midnight">
              Copies you can ship
            </h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-lead">
                  Social proof
                </span>
                <ul className="mt-2 grid gap-2 text-sm text-midnight">
                  <li className="rounded-2xl bg-pure-white px-4 py-3"><Q>Join millions of players already earning daily.</Q></li>
                  <li className="rounded-2xl bg-pure-white px-4 py-3"><Q>Join a community of over 80 million players earning real rewards.</Q></li>
                </ul>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-lead">CTA</span>
                <ul className="mt-2 grid gap-2 text-sm text-midnight">
                  <li className="rounded-2xl bg-pure-white px-4 py-3"><Q>Earn Rewards</Q></li>
                  <li className="rounded-2xl bg-pure-white px-4 py-3"><Q>Start earning rewards</Q></li>
                  <li className="rounded-2xl bg-pure-white px-4 py-3"><Q>Link Account &amp; Get Rewards</Q></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-lead/25 bg-lead/[0.07] p-5 sm:p-6">
            <span className="inline-flex items-center rounded-full bg-lead px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-pure-white">
              Bonus tip
            </span>
            <p className="mt-3 text-sm leading-relaxed text-midnight/80">
              Make the in-game reward escalating: raise it on every re-show after a dismissal, up
              to one final best offer.

            </p>
          </div>

        </Sub>

        <Sub
          id="placement"
          title="Where to place the Pop-up"
          intro="Timing alone separates the strongest integrations from the average ones."
        >
          <DoDont
            title="When the pop-up fires"
            media="video"
            doPoints={[
              "Surfaces within the first 2-5 minutes play time",
              "Force-shown, no tap required",
              "Re-shown at least every 30 minutes to unlinked players",
              "Attention is still fresh, so install-to-link peaks",
            ]}
            doPlaceholder={[
              {
                caption:
                  "Screen recording of live gameplay where the Freecash pop-up surfaces on its own a few minutes into the session, with no ad before it and no tap from the player.",
                src: popupTimingDo,
              },
            ]}
            dontPoints={[
              "Waits until the player is deep in the session, or fires straight after a rewarded ad",
              "Waits for the player to tap something",
              'Capped to "once per session", never re-shown',
              "Player is already fatigued, most never see it twice",
            ]}
            dontPlaceholder={[
              {
                caption:
                  "Screen recording of a rewarded ad finishing and the pop-up firing the instant it closes, two interruptions back to back.",
                src: popupTimingDont.url,
              },
            ]}

          />
        </Sub>

        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <PromptCard
            tag="AI audit"
            title="Have an AI check your pop-up design"
            copy="Copy the prompt, paste it into ChatGPT, Claude or Gemini with a screenshot of your pop-up. It asks for what it needs, then scores your pop-up against every rule in this guide."
            buttonLabel="Copy pop-up prompt"
            prompt={popupAuditPrompt}
            onCopy={copyText}
          />
        </div>


        <Sub
          id="icon"
          title="Homescreen icon"
          intro="Most players don't link on the first pop-up, this is what brings them back without interrupting them again."
        >
          <DoDont
            title="The persistent entry point"
            ratio="icon"
            doPoints={[
              "Carries the Freecash icon",
              "Reward signal on it: cash, coins or gift",
              "Draws the eye: notification bubble, animation or colour highlight",
              "Keep it on screen for anyone who hasn't linked",
              "Good placements: homescreen corner, or in the shop",
            ]}
            doPlaceholder={[
              {
                caption: "Homescreen icon with the Freecash mark surrounded by coins, a gift and gems, labelled Freecash Rewards.",
                src: iconRewardsFab.url,
              },
              {
                caption: "Homescreen icon showing coins and cash reward art with a FreeCash Rewards label.",
                src: iconFreecash.url,
                emphasize: true,
              },
            ]}

            dontPoints={[
              "Bare app logo used alone, no Freecash reward context",
              "No reward signal on it: no cash, no coins, no gift",
              "No highlighting: no notification badge, no animation, no colour pop",
              "Buried in a settings menu, so unlinked players never pass it",
              "No label, so it reads as another shop button and gets ignored",
            ]}
            dontPlaceholder={[
              {
                caption: "Bare green Freecash logo mark used alone as the entry point, with no reward art and no label.",
                src: iconDontA.url,
                scale: 0.75,
                offsetY: 26,
              },
              {
                caption: "Plain Freecash app logo used as the entry point, with no reward cue and no label.",
                src: iconDontB.url,
                scale: 0.75,
                offsetY: 26,
              },
            ]}
          />
        </Sub>

        <Sub
          id="icon-placement"
          title="Where to place the entry point"
          intro="Three placements work. Ship at least one, and the homescreen corner first."
        >
          {(() => {
            const cards = [
              {
                tag: "Homescreen",
                slot: "icon-placement-homescreen",
                headline: "Homescreen corner",
                copy: "Always on the main screen: every unlinked player passes it every session, and every linked player uses it to reach Rewarded Progression or the Earn Tab.",
                src: placementHomescreen.url,
                ratio: "phone" as const,
                arrow: (
                  <PointerArrow
                    left={30}
                    top={25}
                    angle={180}
                    length={96}
                    label="Arrow pointing at the FreeCash Rewards icon in the homescreen corner"
                  />
                ),
                caption:
                  "Game homescreen with the FreeCash Rewards icon pinned in the top-left corner of the HUD, showing coins and cash art with a label under it.",
              },
              {
                tag: "Banner",
                slot: "icon-placement-banner",
                headline: "In-game banner",
                copy: "A wide strip docked above the bottom nav, carrying the reward value in text.",
                src: placementBanner,
                ratio: "phone" as const,
                arrow: (
                  <PointerArrow
                    left={50}
                    top={92}
                    angle={90}
                    length={88}
                    label="Arrow pointing at the Freecash offer banner above the bottom nav"
                  />
                ),
                caption:
                  "Game homescreen with a Freecash special offer banner docked above the bottom nav, stating 300 coins, a $10 bonus and an Earn Rewards button.",
              },
              {
                tag: "Shop",
                slot: "icon-placement-shop",
                headline: "Inside the shop",
                copy: "Sits next to the currency packs, exactly where players already come to get more.",
                src: placementShop.url,
                ratio: "wide" as const,
                arrow: undefined,
                caption:
                  "In-game coin shop screen with the FreeCash Rewards tile placed as a third option next to the coin packs.",
              },
            ];
            const [homescreen, banner, shop] = cards;
            const Card = ({
              p,
              full = false,
            }: {
              p: (typeof cards)[number];
              full?: boolean;
            }) => (
              <div
                className={
                  "flex flex-col rounded-3xl border border-sky/25 bg-sky/[0.06] p-4 sm:p-5 " +
                  (full ? "" : "sm:row-span-4 sm:grid sm:grid-rows-subgrid sm:content-start")
                }
              >
                <span className="inline-flex w-fit items-center rounded-full bg-lead px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-pure-white">
                  {p.tag}
                </span>
                <div
                  className={
                    "mt-4 flex-1 " +
                    (full ? "" : "[&_img]:aspect-[880/1920] [&_img]:object-contain")
                  }
                >
                  <UploadSlot
                    slotId={p.slot}
                    caption={p.caption}
                    src={p.src}
                    ratio={p.ratio}
                    overlay={p.arrow}
                  />
                </div>
                <h4 className="mt-4 text-base font-bold text-midnight">{p.headline}</h4>
                <p className="max-w-2xl text-sm leading-relaxed text-midnight/70">{p.copy}</p>
              </div>
            );

            return (
              <div className="mt-8 space-y-5">
                <div className="grid gap-x-5 gap-y-0 sm:grid-cols-2 sm:grid-rows-[auto_auto_auto_1fr]">
                  <Card p={homescreen!} />
                  <Card p={banner!} />
                </div>
                <Card p={shop!} full />
              </div>
            );
          })()}
          <PromptCard
            tag="AI audit"
            title="Have an AI check your entry point"
            copy="Copy the prompt, paste it into ChatGPT, Claude or Gemini with a screenshot of your homescreen. It asks the questions a screenshot can't answer, then scores your entry point against this guide."
            buttonLabel="Copy entry point prompt"
            prompt={entryPointAuditPrompt}
            onCopy={copyText}
          />
        </Sub>


        </Outcome>

        <Outcome
          id="ltv"
          num="Outcome 02"
          title="How to maximize LTV with Rewarded Progression"
          intro="Rewarded Progression lives inside your game. The player sees their progress and their rewards without ever opening Freecash, which is what keeps them playing and cuts churn."
          badge={<Pill tone="lead">SDK 1.1+ needed</Pill>}
        >
        <Sub
          id="post-link"
          title="User flow after linking"
          intro="Pay out loud, then show them where the progression lives."
        >
          <div className="mt-8">
            <ChapteredVideo
              src={rewardedProgressionVideo.url}
              aspect="580/1250"
              hasAudio
              caption=""
              ariaLabel="Screen recording of the post-link flow"
              chapters={[
                {
                  start: 0,
                  end: 4.4,
                  title: "Link the account",
                  note: "The player signs up and links in a few taps.",
                },
                {
                  start: 4.4,
                  end: 10.5,
                  title: "Pay the reward out loud",
                  note: "The player lands back in the game and immediately sees the in-game currency they earned. This is the moment that proves the players linking worked.",
                },
                {
                  start: 10.5,
                  end: 21.5,
                  title: "Show the entry point via a short tutorial",
                  note: "A short tutorial points at the Freecash icon in the HUD. A permanent, reward-signalling entry point is what turns one payout into repeat earning sessions.",
                },
                {
                  start: 21.5,
                  end: 34.8,
                  title: "End inside Rewarded Progression",
                  note: "The tutorial ends inside Rewarded Progression, so the player sees what the next milestone is worth and gets a concrete reason to come back.",
                },
              ]}
            />
          </div>

        </Sub>

        <Sub
          id="rewarded-progression"
          title="Badge every milestone"
          intro="A reward notification is what pulls the player back into progression."
        >
          <div className="mt-8 rounded-3xl border border-lead/25 bg-lead/[0.07] p-5 sm:p-6">
            <span className="inline-flex items-center rounded-full bg-lead px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-pure-white">
              Bonus tip
            </span>
            <p className="mt-3 text-sm leading-relaxed text-midnight/80">
              Badge the icon with a red "1" on every milestone the user achieves, using a reward
              notification.{" "}
              <a
                href="https://github.com/almedia-tm/almedia-link-sdk/blob/main/Documentation~/integration-guide.md#reward-notifications"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-lead underline underline-offset-4"
              >
                Technical Guide for this
              </a>
            </p>
          </div>
        </Sub>

        </Outcome>

        <Outcome
          id="earn-tab"
          num="Outcome 03"
          title="How to maximize revenue with the Earn Tab"
          intro="The Earn Tab pays you for every completed offer a $3 CPA on your side. It is an additional feature for already linked user."
          badge={<Pill tone="lead">SDK 1.1+ needed</Pill>}
        >
        <Sub
          id="earn-tab-flow"
          title="User flow for the Earn Tab"
        >
          <div className="mt-8">
            <ChapteredVideo
              src={earnTabFlowVideo.url}
              aspect="580/1202"
              caption=""
              ariaLabel="Screen recording of the Earn Tab flow, from the dedicated pop-up through the Earn Tab offers and back into the game"
              chapters={[
                {
                  start: 0,
                  end: 4.2,
                  title: "Fire a dedicated Earn Tab pop-up",
                  note: "The player is in the game when the Earn Tab gets its own pop-up moment. Do not put it onto the linking pop-up. It needs its own dedicated pop-up, to increase conversion and to explain to users the function.",
                },
                {

                  start: 4.2,
                  end: 13,
                  title: "Land in the Earn Tab",
                  note: "The Earn Tab opens inside your game: featuring different offers from games. Every completed offer is a $3 CPA on your side.",
                },
                {
                  start: 13,
                  end: 15.5,
                  title: "Back to the game, icon stays",
                  note: "The player closes the Earn Tab and returns to gameplay with the Freecash icon still on the HUD. That icon is the permanent way back in.",
                },
                {
                  start: 15.5,
                  end: 19.8,
                  title: "One icon, two tabs",
                  note: "The same icon opens Rewarded Progression and the Earn Tab side by side, so players who came for progression discover the offers too.",
                },
              ]}
            />
          </div>

        </Sub>

        <Sub
          id="earn-tab-popup"
          title="Earn Tab pop-up"
          intro="Same rules as the link pop-up: exact reward stated, one CTA, no wall of text."
        >
          <DoDont
            title="Earn Tab pop-up"
            ratio="phone"
            hintDo
            hintDont
            hintDelayMs={300000}
            doPoints={[
              "Own dedicated pop-up for the Earn Tab",
              "State the exact offer reward and the payout up front",
              "Explain the milestone: what to reach and how short it is",
              "One clear CTA focused on Rewards, no sign-up wording, Freecash mark present",
            ]}
            doPlaceholder={{
              caption:
                "Earn Tab pop-up covering most of the screen with the Freecash mark, three numbered steps, a milestone progress bar, an exact gem reward and one 'Earn Rewards' CTA.",
              src: earnPopupDo.url,
            }}
            dontPoints={[
              "Small card bolted over undimmed gameplay, no dedicated moment",
              "No exact reward stated anywhere, the player has to guess",
              "Vague milestone copy like \"keep playing, see what happens\"",
              '"Sign Up Now" wording and no Freecash mark, although the player is already linked',
            ]}
            dontPlaceholder={{
              caption:
                "Small Earn Tab pop-up floating over live gameplay with no Freecash mark, no reward value, vague steps and a 'Sign Up Now' button.",
              src: earnPopupDont.url,
            }}
          />
        </Sub>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-lead/25 bg-lead/[0.07] p-6 sm:p-8">
          <span className="inline-flex items-center rounded-full bg-lead px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-pure-white">
            Launching the Earn Tab
          </span>
          <h3 className="mt-3 text-2xl text-midnight">Ready to switch the Earn Tab on?</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-midnight/80">
            Fill in the short Earn Tab survey so we have every asset we need to set it up for you.
          </p>
          <a
            href="https://link-asset-hub.lovable.app/earn-tab-survey"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-lead px-6 py-3 text-sm font-bold text-pure-white transition-transform duration-200 hover:scale-[1.03]"
          >
            Start the Earn Tab survey
          </a>
        </div>


        </Outcome>




        <Section
          id="full-flow"
          eyebrow="04 · Full user flow from start to end"
          intro="The whole journey in one recording: the pop-up, the link, the payout, the homescreen icon, Rewarded Progression and the Earn Tab."
        >
          <figure className="mt-8 flex flex-col items-center">
            <div className="relative w-full max-w-[380px]">
              <video
                src={fullFlowVideo.url}
                style={{ aspectRatio: "582/1204" }}
                className="w-full rounded-3xl bg-midnight object-contain"

                controls
                controlsList="nofullscreen"
                disablePictureInPicture
                playsInline
                muted
                preload="metadata"
                aria-label="Screen recording of the complete flow end to end, from the first session and the pop-up firing, through linking and the Freecash sign-up, back into the game for the in-game payout, the homescreen icon, and finally Rewarded Progression."
              />
            </div>
            <figcaption className="mt-3 text-center text-xs font-medium text-midnight/50">
              Press play to watch the full journey.
            </figcaption>
          </figure>
        </Section>

        <Section
          id="checklist"
          eyebrow="05 · Checklist"
        >
          <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-midnight">
            Every box ticked is the strongest setup we know of today for install-to-link rate and
            LTV per linked player.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-lead/20 bg-lead/[0.07] px-5 py-3">
              <img src={linkCoin.url} alt="Link Coin" className="size-11 sm:size-12" />
              <span className="text-base font-bold text-lead sm:text-lg" aria-live="polite">
                {coins} / {coinsTotal + bonusCoinsTotal} Link Coins
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wide text-midnight/50">
              {coinsTotal} core + {bonusCoinsTotal} bonus
            </span>
          </div>



          <div className="mt-8 space-y-4">
            {checklist.map((group, gi) => {
              const done = group.items.filter((i) => checkedItems[i]).length;
              const complete = done === group.items.length;
              const pct = Math.round((done / group.items.length) * 100);
              const locked = gi > unlockedIndex;
              if (locked) {
                return (
                  <div
                    key={group.group}
                    className="flex items-center gap-3 rounded-3xl border border-dashed border-midnight/15 bg-midnight/[0.03] px-5 py-4"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-midnight/10 text-midnight/50"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <rect x="4" y="10" width="16" height="10" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-bold text-midnight/60">Stage {gi + 1} locked</p>
                      <p className="text-xs text-midnight/45">
                        {group.items.length} checks, worth {group.items.length * 10} Link Coins.
                      </p>
                    </div>
                  </div>
                );
              }

              const isCurrent = gi === unlockedIndex;
              const nextGroup = checklist[gi + 1];
              const canUnlock = isCurrent && !!nextGroup && done >= Math.ceil(group.items.length / 2);

              return (
                <Reveal key={group.group}>
                  <div
                    className={
                      "rounded-3xl p-5 transition-colors duration-500 sm:p-6 " +
                      (complete ? "bg-lead/[0.07] ring-1 ring-lead/25" : "bg-sky/10")
                    }
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={
                            "grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors " +
                            (complete ? "bg-lead text-pure-white" : "bg-pure-white text-midnight")
                          }
                        >
                          {gi + 1}
                        </span>
                        <h3 className="text-lg text-midnight">{group.group}</h3>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-pure-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-midnight/70">
                        <img src={linkCoin.url} alt="" aria-hidden="true" className="size-8" />
                        {done * 10} / {group.items.length * 10}
                      </span>

                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="block h-2 w-full overflow-hidden rounded-full bg-pure-white"
                      >
                        <span
                          className="block h-full rounded-full bg-lead transition-[width] duration-500 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="shrink-0 text-xs font-bold text-lead">{pct}%</span>
                    </div>

                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {group.items.map((item) => (
                        <ChecklistRow
                          key={item}
                          label={item}
                          checked={!!checkedItems[item]}
                          onToggle={(next) => setCheckedItems((prev) => ({ ...prev, [item]: next }))}
                        />
                      ))}
                    </ul>

                    {isCurrent && nextGroup && (
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          disabled={!canUnlock}
                          onClick={() =>
                            complete ? setUnlockedIndex(gi + 1) : setPendingUnlock(gi + 1)
                          }
                          className={
                            "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform " +
                            (canUnlock
                              ? "bg-lead text-pure-white hover:scale-[1.03]"
                              : "cursor-not-allowed bg-midnight/10 text-midnight/40")
                          }
                        >
                          {canUnlock ? `Unlock stage ${gi + 2}` : `Tick ${Math.ceil(group.items.length / 2) - done} more to unlock`}
                        </button>
                        {canUnlock && !complete && (
                          <span className="text-xs font-medium text-midnight/60">
                            {group.items.length - done} boxes still open in this stage.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}

            {!bonusUnlocked ? (
              <Reveal>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-lead/30 px-4 py-3">
                  <p className="text-sm font-medium text-midnight/60">
                    Setting up the Earn Tab? Bonus stage: {bonusCoinsTotal} extra Link Coins.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBonusUnlocked(true)}
                    className="inline-flex items-center rounded-full bg-lead px-5 py-2 text-sm font-bold text-pure-white transition-opacity hover:opacity-90"
                  >
                    Unlock bonus stage
                  </button>
                </div>
              </Reveal>

            ) : (
              <Reveal>
                <div
                  className={
                    "relative overflow-hidden rounded-3xl border-2 border-dashed p-5 transition-colors duration-500 sm:p-6 " +
                    (bonusComplete
                      ? "border-lead bg-lead/[0.1]"
                      : "border-lead/40 bg-gradient-to-br from-lead/[0.08] to-sky/10")
                  }
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="inline-flex items-center rounded-full bg-lead px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-pure-white"
                      >
                        Bonus stage
                      </span>
                      <h3 className="text-lg text-midnight">{bonusStage.group}</h3>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-pure-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-midnight/70">
                      <img src={linkCoin.url} alt="" aria-hidden="true" className="size-8" />
                      {bonusDone * 15} / {bonusCoinsTotal}
                    </span>
                  </div>

                  <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-midnight/70">
                    Always open, never required. Every box here is worth 15 Link Coins instead of 10,
                    as the Earn Tab is an additional feature inside of Link.
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="block h-2 w-full overflow-hidden rounded-full bg-pure-white"
                    >
                      <span
                        className="block h-full rounded-full bg-lead transition-[width] duration-500 ease-out"
                        style={{ width: `${Math.round((bonusDone / bonusTotal) * 100)}%` }}
                      />
                    </span>
                    <span className="shrink-0 text-xs font-bold text-lead">
                      {Math.round((bonusDone / bonusTotal) * 100)}%
                    </span>
                  </div>

                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {bonusStage.items.map((item) => (
                      <ChecklistRow
                        key={item}
                        label={item}
                        checked={!!checkedItems[item]}
                        onToggle={(next) => setCheckedItems((prev) => ({ ...prev, [item]: next }))}
                      />
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>


          {pendingUnlock !== null && typeof document !== "undefined" && createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[120] grid place-items-center bg-midnight/60 p-5"
              onClick={() => setPendingUnlock(null)}
            >
              <div
                className="w-full max-w-md rounded-3xl bg-pure-white p-7 text-center shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={linkCoin.url}
                  alt=""
                  aria-hidden="true"
                  className="mx-auto size-32 [animation:coin-pop_0.5s_ease-out]"
                />
                <h3 className="mt-4 text-xl text-midnight">Unlock without a full stage?</h3>
                <p className="mt-3 text-base font-medium leading-relaxed text-midnight/70">
                  Stage {pendingUnlock} still has open boxes, and open boxes leave Link Coins on the
                  table.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPendingUnlock(null)}
                    className="rounded-full bg-midnight/10 px-6 py-3 text-sm font-bold text-midnight transition-colors hover:bg-midnight/15"
                  >
                    Finish this stage
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnlockedIndex(pendingUnlock);
                      setPendingUnlock(null);
                    }}
                    className="rounded-full bg-lead px-6 py-3 text-sm font-bold text-pure-white transition-transform hover:scale-[1.03]"
                  >
                    Unlock anyway
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}

          {showCelebration && typeof document !== "undefined" && createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[130] grid place-items-center overflow-hidden bg-midnight/70 p-5"
              onClick={() => setShowCelebration(false)}
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute top-0 block h-3 w-1.5 rounded-full bg-lead"
                    style={{
                      left: `${(i * 5.5 + 4) % 100}%`,
                      opacity: i % 3 === 0 ? 0.5 : 0.85,
                      animation: `confetti-fall ${2.6 + (i % 5) * 0.45}s linear ${(i % 7) * 0.25}s infinite`,
                    }}
                  />
                ))}
              </div>
              <div
                className="relative w-full max-w-md rounded-3xl bg-pure-white p-8 text-center shadow-xl [animation:celebrate-in_0.45s_ease-out]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={linkCoin.url}
                  alt=""
                  aria-hidden="true"
                  className="mx-auto size-32 [animation:coin-pop_0.6s_ease-out,coin-shine_2.4s_ease-in-out_0.6s_infinite]"
                />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-lead">
                  {coinsTotal} / {coinsTotal} Link Coins
                </p>
                <h3 className="mt-2 text-2xl text-midnight">Congratulations</h3>
                <p className="mt-3 text-base font-medium leading-relaxed text-midnight/70">
                  Full board. Every box on this checklist is ticked, which is the strongest Link
                  setup we can point to today for install-to-link rate and LTV per linked player.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCelebration(false)}
                  className="mt-6 rounded-full bg-lead px-7 py-3 text-sm font-bold text-pure-white transition-transform hover:scale-[1.03]"
                >
                  Back to the guide
                </button>
              </div>
            </div>,
            document.body,
          )}

          {showBonusCelebration && typeof document !== "undefined" && createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[130] grid place-items-center overflow-hidden bg-midnight/70 p-5"
              onClick={() => setShowBonusCelebration(false)}
            >
              <div
                className="relative w-full max-w-md rounded-3xl bg-pure-white p-8 text-center shadow-xl [animation:celebrate-in_0.45s_ease-out]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={linkCoin.url}
                  alt=""
                  aria-hidden="true"
                  className="mx-auto size-32 [animation:coin-pop_0.6s_ease-out]"
                />
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-lead">
                  Bonus stage cleared, +{bonusCoinsTotal} Link Coins
                </p>
                <h3 className="mt-2 text-2xl text-midnight">The Earn Tab is switched on</h3>
                <p className="mt-3 text-base font-medium leading-relaxed text-midnight/70">
                  This is the only stage that pays you directly: $3 CPA on every completed offer.
                  Finish the core stages too and the whole setup is as strong as we can advise today.
                </p>
                <button
                  type="button"
                  onClick={() => setShowBonusCelebration(false)}
                  className="mt-6 rounded-full bg-lead px-7 py-3 text-sm font-bold text-pure-white transition-transform hover:scale-[1.03]"
                >
                  Back to the guide
                </button>
              </div>
            </div>,
            document.body,
          )}

          {allDone ? (
            <p className="mt-8 max-w-2xl rounded-3xl bg-lead/[0.07] p-6 text-lg font-medium leading-relaxed text-midnight ring-1 ring-lead/25">
              Full board, all {coinsTotal} core Link Coins.{" "}
              {bonusComplete
                ? `Bonus stage cleared too, ${coinsTotal + bonusCoinsTotal} in total.`
                : `The ${bonusCoinsTotal} bonus coins on the Earn Tab are still open, and that stage is the one that pays a $3 CPA.`}{" "}
              This is the strongest Link setup we can advise for today! A/B test from here, and keep
              us updated about the results.
            </p>
          ) : (
            <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-midnight">
              This is the same checklist we use to audit live integrations. Every unticked box is a
              known drop in install-to-link rate or LTV, so the target is {coinsTotal} core Link
              Coins plus the {bonusCoinsTotal} bonus coins on the Earn Tab.
            </p>
          )}

        </Section>



        <section id="share" className="relative scroll-mt-24 overflow-hidden bg-lead py-20 sm:py-28">
          <Blob className="right-[-8%] bottom-[-30%] h-[380px] w-[380px] text-pure-white/10" />
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <h2 className="max-w-3xl text-3xl leading-[1.05] text-pure-white sm:text-5xl">
              Submit your integration. We will give you feedback.
            </h2>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-pure-white/90">
              Send us your Link setup and we will review it against everything on this page.
              Running your own A/B tests? Send those results too.
            </p>
            <a
              href="https://link-asset-hub.lovable.app/survey"
              className="mt-9 inline-flex rounded-full bg-pure-white px-7 py-3.5 text-base font-bold text-lead transition-transform hover:scale-[1.03]"
            >
              Submit your integration
            </a>

          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-pure-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <img src={linkLogo} alt="Almedia Link logo" className="h-8 w-auto" />
            <p className="mt-3 text-sm text-muted-foreground">
              Best practices for publishers. Updated from live integration data.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Questions?{" "}
            <a
              href="mailto:link@almedia.co"
              className="font-semibold text-lead underline underline-offset-4"
            >
              link@almedia.co
            </a>
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-5 sm:px-8">
          <details className="group">
            <summary className="cursor-pointer list-none text-[11px] text-muted-foreground/50 transition-colors hover:text-muted-foreground">
              Full text version (for AI agents and crawlers)
            </summary>
            <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-midnight/[0.02] p-4 text-[11px] leading-relaxed text-muted-foreground">
{guideMarkdown}
            </pre>
          </details>
        </div>
      </footer>
    </div>
    </LightboxProvider>
  );
}

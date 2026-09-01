# Split the AI copy button into two audit prompts

## What changes

### 1. Two contextual "Ask AI to audit this" buttons
The single "Copy made for AI" button in the hero is replaced by two in-context buttons:

- **Pop-up design audit** — placed at the end of the pop-up design content, directly before the Homescreen icon section.
- **Entry point audit** — placed at the end of "Where to place the entry point", directly before Outcome 02.

Each is a small designed callout card (Lead Blue pill button, short label, one line of explanation like "Paste this into ChatGPT, Claude or Gemini together with a screenshot") with a copy-to-clipboard action and the same confirmation toast that exists today.

The full guide text stays available for agents in the existing hidden machine-readable block, so nothing is lost for AI crawlers.

### 2. How the prompts are written
Each prompt is a self-contained audit script written for design and product managers (plain language, no code, no SDK detail). Structure of both prompts:

1. **Role and goal** — "You are auditing a mobile game's Freecash Link pop-up / entry point against Almedia's published best practices."
2. **Step 1: ask for the visual.** If no screenshot or recording is attached, the LLM must ask for one before doing anything else, and say exactly what it needs (full screen capture of the pop-up as a player sees it / the game homescreen with the entry point visible).
3. **Step 2: ask the questions a picture can't answer.** One short batch, waiting for answers:
   - Pop-up prompt: when it first fires (minutes into first session), forced or tap-gated, re-show frequency, whether it follows a rewarded ad or interstitial, session cap, rollout percentage, dismissal delay, whether the stated in-game reward is actually granted.
   - Entry point prompt: where it sits, whether it stays visible for unlinked players, whether it stays visible **after** linking, whether it is the route into Rewarded Progression and the Earn Tab, whether it carries a notification badge or animation, whether it is ever hidden behind a menu.
4. **Step 3: score against the embedded rules.** The full DO/DON'T rules for that section are embedded verbatim in the prompt so the LLM does not need to fetch the page.
5. **Step 4: output format.** A pass/fail table per rule, then "What is wrong and exactly how to fix it" ranked by impact on install-to-link rate and LTV, then the copy/CTA wording rules, then a link back to the guide and the submit-your-integration link.

The prompts must not invent rules beyond the guide and must flag "cannot tell from the material provided" rather than guessing.

### 3. Checklist gap (Homescreen icon stage)
Add one box to the Homescreen icon stage:

- "Stays visible after linking, as the route into Rewarded Progression and the Earn Tab"

This shifts the core total from 230 to 240 Link Coins, so every place that names 230 (checklist copy, completion message, AI markdown) is updated to 240.

### 4. CTA copy updates
Everywhere the shippable CTA list appears (page section and AI markdown):

- "Link Account & Earn Rewards" becomes "Start earning rewards"
- "Get Rewards" becomes "Link Account & Get Rewards"
- "Earn Rewards" stays

## Technical notes
- New file `src/lib/ai-audit-prompts.ts` exporting `popupAuditPrompt` and `entryPointAuditPrompt`.
- New small component `src/components/guide/PromptCard.tsx` reusing the existing clipboard fallback and toast state from `src/routes/index.tsx`.
- Edits to `src/routes/index.tsx` (hero button removal, two card placements, checklist item, coin totals, CTA list) and `src/lib/guide-markdown.ts` (checklist item, coin totals, CTA wording).

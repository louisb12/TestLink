export const guideMarkdown = `# Almedia Link: Best Practices for Publishers (extended machine-readable version)

Audience: an AI coding agent or product team integrating Almedia Link (Freecash account linking) into a mobile game.
Purpose: implement the pop-up, the persistent homescreen entry point, Rewarded Progression and the Earn Tab so that install-to-link rate is high, linked-user LTV lifts, and Earn Tab revenue is unlocked.
Source: patterns observed across live publisher integrations, not opinion.

## How to read this guide: it is a layout guide, you make it game native

Every pop-up, icon and screen in this guide is illustrated with Freecash art to show the structure only. Rebuild it game native: your fonts, your colours, your UI frames, your art style. Keep only the Freecash logo at certain touch points, and keep the exact reward values intact.

Vocabulary used consistently in this document:
- "Pop-up": the in-game modal covering at least half of the screen that offers Freecash account linking. Written "Pop-up" at the start of a sentence, "pop-up" inside a sentence.
- "Homescreen icon": the persistent, always-visible entry point that opens the linking flow, Rewarded Progression or the Earn Tab.
- "Linking": the player connecting their game account to Freecash.
- "Rewarded Progression": the in-game progression screen showing play, daily and milestone rewards (requires SDK 1.1+). Retention feature, no CPA.
- "Earn Tab": the offerwall surface inside Link (requires SDK 1.1+). Revenue feature, $3 CPA per completed offer on the publisher side.

Page structure: Hero, how to read this guide, Outcome 01 install-to-link ratio, Outcome 02 LTV with Rewarded Progression, Outcome 03 revenue with the Earn Tab, 04 full user flow, 05 checklist, 06 submit your integration.

---

## Outcome 01: How to maximize your install-to-link ratio

Three levers decide how many installs turn into linked accounts: when the pop-up fires, what it says, and whether players can still find the offer later.

### 1.1 Pop-up placement (timing)

Principle: timing alone separates the strongest integrations from the average ones. The same pop-up creative performs very differently depending on when it fires.

DO:
- Surface the pop-up within the first 2-5 minutes of play time, inside the player's very first session.
- Force-show it: it appears on its own, without requiring the player to tap a button, an icon or a menu entry.
- Re-show it at least every 30 minutes of play time to any player who has not linked yet. Most players do not link on first exposure; repeat exposure is where the majority of links come from.
- Roll it out to at least 90% of users. Small test cohorts hide the effect and delay the payoff.
- Keep the surrounding screen quiet: the pop-up should clearly be the only thing on screen at that moment.

DON'T:
- Do not fire it immediately after a rewarded ad or an interstitial. The player has just been interrupted, is fatigued, and reflexively dismisses anything that looks like another ad.
- Do not gate it behind a tap (an icon, a menu, a shop tab) as the only way to see it. Discovery collapses.
- Do not cap it to "once per session" or "once per install". The second and third exposures are where linking happens.
- Do not delay it to a later session or a high level gate. Attention is highest early.

Why it matters: earlier, forced, repeated exposure raises install-to-link rate. Linked users show materially higher LTV and lower churn, so every unexposed player is lost revenue, not just a lost impression.

Media on the page: DO is a screen recording of the pop-up surfacing on its own 2-5 minutes into a live session, no ad before it, no tap from the player. DON'T is a recording of a rewarded ad finishing and the pop-up firing the instant it closes.

---

### 1.2 Pop-up design

Principle: the pop-up should be native to your game, its font, art style, button shapes and colour palette. The example artwork only illustrates which components it should include, never a template to copy pixel for pixel.

DO:
- Big enough to own the moment. It does not have to be full screen: half to three quarters of the screen is fine, as long as the gameplay behind it is dimmed out and nothing competes with it.
- Dismissal blocked for the first 5 seconds, shown as a small countdown next to a greyed-out close button, so it is actually read rather than reflex-closed.
- State the $10 sign-up bonus outright, in plain text. This is the single most impactful element in the whole guide.
- Show the in-game currency reward for linking directly on the banner (coins, gems, tickets, whatever your game uses), and actually grant that reward when the player links.
- Show the real-world payout options (cash, gift cards, PayPal / Visa / Amazon) so the value reads as real money.
- Use one single reward-led CTA. Shippable as-is: "Earn Rewards", "Start earning rewards", "Link Account & Get Rewards".
- Use the Freecash icon so the offer is recognisable and trusted.
- Include one social-proof or trust-signal line. Shippable as-is: "Join millions of players already earning daily." or "Join a community of over 80 million players earning real rewards."
- Keep it uncluttered: a good balance of icons and short text, never a wall of copy.

DON'T:
- Do not use a small banner or card over barely dimmed gameplay; it reads as an ad and is ignored.
- Do not use generic stock or unbranded assets that do not match the game.
- Do not leave the reward vague ("Coins for playing", "Cash bonus"). No exact reward stated anywhere means the player has to guess the value, so they dismiss it.
- Do not use "Sign Up" wording. Also avoid "Link & SignUp" and "Link to Freecash". These describe an action, not a benefit.
- Do not add a second competing button such as "Check Link" next to the main CTA. One decision, one button.
- Do not omit social proof.

Copy you can ship as-is:
- Social proof: "Join millions of players already earning daily." / "Join a community of over 80 million players earning real rewards."
- CTA, DO: "Earn Rewards" / "Start earning rewards" / "Link Account & Get Rewards".
- CTA, DON'T: "Sign Up" / "Link & SignUp" / "Link to Freecash".

Media on the page: DO is a Freecash pop-up covering about three quarters of the screen over dimmed gameplay with a 5 second countdown next to the greyed-out close button, the in-game coin reward, cash and gift cards, a $10 sign-up bonus, one "Start earning rewards" CTA and a social-proof line. DON'T is a small pop-up card over barely dimmed gameplay with vague reward rows, a "Sign Up" button, a competing "Check Link" button and no social proof.
Bonus tip: make the in-game reward escalating: raise it on every re-show after a dismissal, up to one final best offer.

---


### 1.3 Homescreen icon (persistent entry point)

Principle: most players do not link on the first pop-up. The homescreen icon is what brings them back to the offer without interrupting them again. This is the most commonly missed part of an integration.

DO:
- Place a persistent, tappable icon on the homescreen that carries the Freecash icon so it is instantly identifiable.
- Style the surrounding frame natively to your game's theme, while keeping the Freecash mark intact.
- Put a reward signal on it: cash, coins or a gift cue, so the player knows a reward sits behind it.
- Make it draw the eye: a red notification badge on the corner of the icon, a subtle animation, or a colour highlight that separates it from ordinary shop buttons.
- Keep it on screen for anyone who has not linked yet, permanently, not just for a session.
- Good placements: a homescreen corner, or in the shop.
- Keep the entry point visible after linking too, since it is also the way into Rewarded Progression and the Earn Tab.

DON'T:
- Do not use the bare Freecash logo on its own, with no reward art and no label. It reads as a random brand icon.
- Do not use the plain Freecash app icon as the entry point, with no reward cue and no label.
- Do not bury it in a settings menu, an overflow menu or a sub-page.
- Do not ship it with no highlighting: no notification badge, no animation, no colour pop. Without an attention cue it is never noticed.
- Do not let it look like just another shop button.

Why it matters: the persistent icon carries the long tail of links, which is a large share of total linked users and therefore of the LTV lift.

Media on the page: DO shows two homescreen icons in game art style, one with the Freecash mark and a "$10 bonus" badge, one with coin and cash reward art plus a red "1" notification badge on the top-right corner. DON'T shows the bare Freecash logo mark and the plain Freecash app icon used alone, with no reward art and no label.

### 1.4 Where to place the entry point

Three placements work. Ship at least one, and the homescreen corner first.
- Homescreen corner: always on the main screen, so every unlinked player passes it every session, and every linked player uses it to reach Rewarded Progression or the Earn Tab.
- Inside the shop: next to the currency packs, exactly where players already come to get more.
- In-game banner: a wide reward banner on the homescreen or shop, carrying the reward value in text.


---

## Outcome 02: How to maximize LTV with Rewarded Progression (requires SDK 1.1+)

Rewarded Progression lives inside your game. The player sees their progress and their rewards without ever opening Freecash, which is what keeps them playing and cuts churn.

Rewarded Progression and the Earn Tab are two separate features. Both require SDK 1.1+, both need their own tutorial, and both are reached through the same Freecash homescreen icon. A publisher can ship Rewarded Progression without the Earn Tab.

### 2.1 User flow after linking

Pay out loud, then show them where the progression lives. The flow, as walked through in the page's chaptered screen recording:

1. Pay the reward out loud. The player lands back in the game and immediately sees the in-game currency they earned (for example 300 coins). Reward first, explanation later: this is the moment that proves linking pays.
2. Keep the entry point visible. Back on the game screen, the Freecash icon sits in the HUD. A permanent, reward-signalling entry point is what turns one payout into repeat earning sessions.
3. Open Rewarded Progression. Show the Rewarded Progression screen via a short tutorial, so the player sees what the next milestone is worth and gets a reason to come back. Point at it once, do not auto-open it; let the player make the press.

### 2.2 Rewarded Progression

- Bonus tip: badge the icon with a red "1" on every milestone the user achieves, using a reward notification. Technical reference: https://github.com/almedia-tm/almedia-link-sdk/blob/main/Documentation~/integration-guide.md#reward-notifications
- Requires SDK 1.1+.

Why it matters: progression visible inside the game means the player does not need to leave for Freecash to feel progress, which reduces churn and lifts LTV.

---

## Outcome 03: How to maximize revenue with the Earn Tab (requires SDK 1.1+)

The Earn Tab pays you for every completed offer a $3 CPA on your side. It is an additional feature for already linked user.

### 3.1 User flow for the Earn Tab

Players will not find the Earn Tab on their own, so it gets its own launch moment: a dedicated pop-up, one short tutorial (what an offer is, what it pays, how the reward lands back in the game), then the same Freecash homescreen icon as the permanent way back. Point at it once, let the player make the press.

Video on the page (chaptered): 1. a dedicated Earn Tab pop-up fires mid-session, 2. the pop-up explains the offer in three lines (play a new game, hit the milestone, get 300 gems instantly), 3. the Earn Tab opens inside the game with featured offers showing gem reward and cash value, 4. the player returns to the game with the Freecash icon still on the HUD, 5. the same icon holds Rewarded Progression and the Earn Tab side by side.

### 3.2 Earn Tab pop-up

Same rules as the link pop-up: exact reward stated, one CTA, no wall of text.

DO:
- Own dedicated pop-up for the Earn Tab.
- State the exact offer reward and the payout up front (for example "Get 300 gems instantly").
- Explain the milestone: what the player has to reach and how short it is.
- One clear CTA focused on Rewards, no sign-up wording, Freecash mark present.
- Covers at least half the screen and built game native: your fonts, colours and frames.

DON'T:
- No exact reward stated anywhere, so the player has to guess and dismisses it.
- Vague milestone copy like "keep playing, see what happens".
- "Sign Up" wording, although the player is already linked, which invents friction.
- No Freecash mark, so the offer looks like an unknown third party.
- A small card floating over barely dimmed gameplay instead of a moment that owns the screen.

Launching the Earn Tab: fill in the short Earn Tab survey so Almedia has every asset needed to set it up. https://link-asset-hub.lovable.app/earn-tab-survey

---

## 04. Full user flow from start to end

The whole journey in one recording: the pop-up firing in the first session, the link and Freecash sign-up, back into the game for the in-game payout, the homescreen icon, and finally Rewarded Progression.

---

## 05. Checklist

The checklist on the page is staged and gamified: each core box is worth 10 Link Coins, 240 Link Coins in total across the four core stages. The Earn Tab is a bonus stage that stays hidden until it is unlocked on demand; each of its boxes is worth 15 Link Coins, 90 in total, as the Earn Tab is an additional feature inside of Link.

Full board, all 240 Link Coins, is the strongest Link setup we can advise today. Every unticked box is a known drop in install-to-link rate or LTV. A/B test from there and keep us updated on the results.

Pop-up placement:
- [ ] Surfaces within the first 2-5 minutes of play time
- [ ] Force-shown, no tap required
- [ ] Re-shown at least every 30 minutes to unlinked players
- [ ] Never fired straight after a rewarded ad
- [ ] Not capped to once per session
- [ ] Rolled out to at least 90% of users

Pop-up design:
- [ ] Covers at least half the screen and native to your game's art and fonts
- [ ] Dismissal blocked for a few seconds
- [ ] $10 sign-up bonus stated outright
- [ ] In-game currency reward shown on the banner
- [ ] One clear CTA focused on rewards, no "Sign Up" wording
- [ ] Freecash icon used
- [ ] Includes a social-proof or trust-signal line

Homescreen icon:
- [ ] Freecash icon carried on the button
- [ ] Reward signal (cash, coins or gift) visible on it
- [ ] Draws the eye: notification bubble, animation or colour highlight
- [ ] Placed in the homescreen corner or in the shop
- [ ] Stays on screen for anyone who hasn't linked
- [ ] Stays visible after linking, as the route into Rewarded Progression and the Earn Tab

User flow (SDK 1.1+):
- [ ] In-game reward paid out on the player's next return
- [ ] Player is shown that they received the reward
- [ ] Player is nudged toward the Freecash icon once, not auto-opened
- [ ] Rewarded Progression walked through once
- [ ] Icon badged with a red "1" on every milestone via reward notification

Earn Tab (bonus stage, 15 Link Coins per box):
- [ ] Own dedicated pop-up for the Earn Tab
- [ ] Exact offer reward and payout stated on that pop-up
- [ ] One clear CTA focused on Rewards, no "Sign Up" wording
- [ ] One-time tutorial: what an offer is and what it pays
- [ ] Earn Tab reachable from the same Freecash homescreen icon
- [ ] Earn Tab survey submitted so we can set it up

This is the same checklist used to audit live integrations. If every box is ticked, the integration is ahead of most publishers.

---

## 06. Submit your integration and we will give you feedback

Send us your Link setup and we will review it against everything on this page. Running your own A/B tests? Send those results too.

Submit your integration: https://link-asset-hub.lovable.app/survey
Questions: link@almedia.co
`;

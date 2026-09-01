export type Hotspot = {
  /** horizontal position in % of the image width */
  x: number;
  /** vertical position in % of the image height */
  y: number;
  type: "good" | "bad";
  /** two-word headline shown on the connector chip */
  short: string;
  label: string;
  note: string;
  /** optional connector length in px, defaults to the standard short line */
  lineLength?: number;
};

/**
 * Hotspots are keyed by slot id, kept separate from the image files.
 * Swapping a screenshot later only means editing the coordinates here,
 * no layout code has to change. A slot with no entry simply opens as a
 * plain lightbox with no marker layer.
 */
export const hotspots: Record<string, Hotspot[]> = {
  "the-pop-up-itself-do": [
    {
      x: 19,
      y: 73.9,
      type: "good",
      short: "Freecash icon",
      label: "Freecash branding used",
      note: "The Freecash mark sits next to the sign-up bonus, so players recognise the offer instead of guessing what they are linking to.",
      lineLength: 90,
    },
    {
      x: 92,
      y: 38.9,
      type: "good",
      short: "Currency reward",
      label: "In-game currency reward listed first",
      note: "The in-game coin reward is spelled out at the top of the list, so the value is visible before the player decides.",
    },
    {
      x: 92,
      y: 73.3,
      type: "good",
      short: "$10 bonus",
      label: "$10 bonus stated outright",
      note: "The $10 sign-up bonus is stated outright rather than hidden behind the flow, which is the single most impactful element of the pop-up.",
    },
    {
      x: 20,
      y: 86.7,
      type: "good",
      short: "One CTA",
      label: "One clear CTA focused on Rewards",
      note: "One reward-led button, no competing 'Sign Up' or 'Check Link' action. A single clear CTA outperforms a cluttered pair.",
      lineLength: 90,
    },
    {
      x: 87,
      y: 93.0,
      type: "good",
      short: "Social proof",
      label: "Social proof line",
      note: "A short trust line under the button reassures the player that other people already earn with this.",
    },
    {
      x: 90,
      y: 9.7,
      lineLength: 26,
      type: "good",
      short: "5s delay",
      label: "Dismissal blocked for 5 seconds",
      note: "A 5 second countdown sits next to a greyed-out close button, so the player reads the reward before they can reflex-close the pop-up.",
    },
    {
      x: 14,
      y: 43.7,
      type: "good",
      short: "Owns the screen",
      label: "Covers most of the screen, gameplay dimmed behind it",
      note: "The pop-up does not have to be full screen. Half to three quarters of the screen is enough, as long as it clearly owns the moment and the game behind it is dimmed out.",
      lineLength: 90,
    },

  ],

  "the-pop-up-itself-dont": [
    {
      x: 16,
      y: 27,
      type: "bad",
      short: "Too small",
      label: "Small card over barely dimmed gameplay",
      note: "It does not have to be full screen, but this card is tiny and the level behind it is barely dimmed, so the game keeps competing for attention and the offer reads as an ad the player swipes away.",
      lineLength: 100,
    },
    {
      x: 88,
      y: 26.5,
      type: "bad",
      short: "Instant close",
      label: "Close button available immediately",
      note: "Nothing holds the pop-up open, so most players tap the X before they read a single reward.",
    },
    {
      x: 92,
      y: 49,
      type: "bad",
      short: "No value",
      label: "No reward value stated",
      note: "'Coins for playing' and 'Cash bonus' say nothing concrete. No coin amount, no $10 sign-up bonus, so the player has to guess what linking is worth.",
    },
    {
      x: 20,
      y: 64,
      type: "bad",
      short: "Sign Up",
      label: "'Sign Up' wording on the CTA",
      note: "'Sign Up' reads as account admin, not reward. Reward-led wording like 'Earn Rewards' converts far better.",
      lineLength: 90,
    },
    {
      x: 20,
      y: 71.5,
      type: "bad",
      short: "Two CTAs",
      label: "Competing 'Check Link' button",
      note: "A second action splits the decision. One clear reward CTA outperforms a pair every time.",
      lineLength: 90,
    },
    {
      x: 88,
      y: 77.5,
      type: "bad",
      short: "No proof",
      label: "No social proof line",
      note: "Nothing reassures the player that others already earn with this, so an unfamiliar brand gets dismissed.",
    },
  ],

  "the-persistent-entry-point-do-0": [
    {
      x: 92,
      y: 40,
      type: "good",
      short: "Reward signal",
      label: "Reward signal on the icon",
      note: "Coins on the icon signal a reward sits behind it, so it does not read as another shop button.",
    },
    {
      x: 92,
      y: 85,
      type: "good",
      short: "Rewards label",
      label: "Rewards label",
      note: "A short 'Rewards' label keeps the purpose obvious for anyone who has not linked yet.",
    },
  ],
  "the-persistent-entry-point-do-1": [
    {
      x: 90,
      y: 14,
      type: "good",
      short: "Notification dot",
      label: "Red '1' notification badge",
      note: "The red badge pulls the eye to the icon the same way an unread message does, so players who have not linked yet keep noticing the entry point.",
      lineLength: 40,
    },
    {
      x: 92,
      y: 45,
      type: "good",
      short: "Cash art",
      label: "Cash and coins reward art",
      note: "Cash and coins carry the reward cue instantly, so the icon never reads as another shop button.",
    },
    {
      x: 92,
      y: 85,
      type: "good",
      short: "Rewards label",
      label: "Rewards label",
      note: "The label keeps the entry point readable at icon size, where art alone can be ambiguous.",
    },
  ],
  "the-persistent-entry-point-dont-0": [
    {
      x: 92,
      y: 35,
      type: "bad",
      short: "Logo only",
      label: "Bare logo, no reward art",
      note: "The plain mark carries no cash, coin or gift cue, so nothing tells the player a reward sits behind the icon.",
    },
    {
      x: 92,
      y: 80,
      type: "bad",
      short: "No label",
      label: "No label under the icon",
      note: "Without a short 'Rewards' label, a player who has not linked yet has no idea what the button does, so they never tap it.",
    },
  ],
  "the-persistent-entry-point-dont-1": [
    {
      x: 92,
      y: 35,
      type: "bad",
      short: "App logo",
      label: "App logo used as the entry point",
      note: "A bare brand logo reads as a partner badge or another shop button, not as an earning opportunity.",
    },
    {
      x: 92,
      y: 80,
      type: "bad",
      short: "No signal",
      label: "No reward signal or attention cue",
      note: "No badge, no notification dot, no colour highlight. It blends into the HUD and gets ignored, so the long tail of links never happens.",
    },
  ],

  "earn-tab-pop-up-do": [
    {
      x: 20.2,
      y: 21.9,
      type: "good",
      short: "Freecash mark",
      label: "Freecash logo present",
      note: "The Freecash mark sits at the top, so the player recognises where the offers come from and trusts the payout.",
      lineLength: 90,
    },
    {
      x: 78,
      y: 29.4,
      type: "good",
      short: "Clear promise",
      label: "One clear headline promise",
      note: "'More ways to earn more' states the point of the Earn Tab in one line, before any explanation.",
      lineLength: 60,
    },
    {
      x: 72,
      y: 52.8,
      type: "good",
      short: "Milestone step",
      label: "The milestone is explained",
      note: "A progress bar and 'reach the goal, usually just a level or two' show how short the path to the reward is.",
      lineLength: 50,
    },
    {
      x: 34,
      y: 60.5,
      type: "good",
      short: "Exact reward",
      label: "Exact reward stated",
      note: "'Get 300 gems instantly' names the in-game payout and says it lands automatically. Set the real per-game value here.",
      lineLength: 80,
    },
    {
      x: 22,
      y: 74.5,
      type: "good",
      short: "One CTA",
      label: "One reward-led CTA",
      note: "'Earn Rewards' is the only button, and there is no sign-up wording: the player is already linked, so there is no friction to imply.",
      lineLength: 90,
    },
    {
      x: 80,
      y: 78.8,
      type: "good",
      short: "Social proof",
      label: "Trust line under the CTA",
      note: "One short social-proof line closes the decision without adding a wall of copy.",
      lineLength: 40,
    },
  ],

  "earn-tab-pop-up-dont": [
    {
      x: 88,
      y: 13.5,
      type: "bad",
      short: "Not dimmed",
      label: "Gameplay behind the pop-up is not dimmed",
      note: "The level, the HUD and the boosters stay at full brightness, so the background keeps competing with the offer and the pop-up reads as a banner the player swipes away.",
      lineLength: 40,
    },
    {
      x: 8,
      y: 33,
      type: "bad",
      short: "Too small",
      label: "Small card, no dedicated moment",
      note: "Half to three quarters of the screen is enough, but this card barely owns a third of it, so the Earn Tab never gets a launch moment of its own.",
      lineLength: 60,
    },
    {
      x: 30,
      y: 37,
      type: "bad",
      short: "No logo",
      label: "Freecash logo missing",
      note: "Without the Freecash mark the offer looks like an unknown third party, so the player has no reason to trust the payout.",
      lineLength: 70,
    },
    {
      x: 80,
      y: 50.8,
      type: "bad",
      short: "Vague step",
      label: "No milestone info",
      note: "'Play the game and see what happens' tells the player nothing about what to reach or how long it takes.",
      lineLength: 95,
    },
    {
      x: 26,
      y: 57.6,
      type: "bad",
      short: "No reward",
      label: "No exact reward stated anywhere",
      note: "'Earn some gems for your effort' makes the player guess the value, and a guessed reward gets dismissed.",
      lineLength: 110,
    },
    {
      x: 24,
      y: 62.8,
      type: "bad",
      short: "Sign up",
      label: '"Sign Up Now" wording',
      note: "The player is already linked, so sign-up wording invents friction that does not exist and kills the tap.",
      lineLength: 90,
    },
  ],



};


export const hotspotsFor = (slotId?: string): Hotspot[] =>
  (slotId && hotspots[slotId]) || [];

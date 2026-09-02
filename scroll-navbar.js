/*
 * scroll-navbar.js — hide the navbar on scroll down, bring it back on scroll up.
 *
 * The ONLY custom JavaScript in this project. Scroll DIRECTION cannot be
 * detected in CSS: scroll-driven animations (animation-timeline: scroll())
 * expose scroll position, not direction, so this needs a listener.
 *
 * PROGRESSIVE ENHANCEMENT. If this file never runs — Mintlify changes how it
 * injects scripts, a CSP blocks it, anything — the navbar simply stays
 * permanently visible and sticky, which is the correct fallback and loses
 * nothing structural. Nothing else on the site depends on it.
 *
 * Mintlify includes any .js file in the content directory on every page, and
 * does NOT guarantee order across multiple files — which is why this project
 * keeps to exactly one.
 *
 * Contract with 20-mintlify.css: this only ever toggles two attributes on
 * <html>:
 *   data-nav-hidden="true"   navbar should be translated out of view
 *   data-nav-scrolled="true" page is scrolled away from the top
 */
(function () {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") return;

  var root = document.documentElement;

  // Respect reduced motion by never hiding the bar. Sliding chrome is motion,
  // and a reader who has asked for less of it should keep a stable navbar.
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce && reduce.matches) {
    root.removeAttribute("data-nav-hidden");
    return;
  }

  var REVEAL_AT = 8;    // px of upward movement before showing again
  var HIDE_AT = 10;     // px of downward movement before hiding
  var TOP_ZONE = 120;   // never hide within this distance of the top

  var last = window.scrollY || 0;
  var ticking = false;
  var hidden = false;

  function setHidden(next) {
    if (next === hidden) return;
    hidden = next;
    if (next) root.setAttribute("data-nav-hidden", "true");
    else root.removeAttribute("data-nav-hidden");
  }

  function update() {
    ticking = false;
    var y = window.scrollY || 0;
    var delta = y - last;

    if (y > 0) root.setAttribute("data-nav-scrolled", "true");
    else root.removeAttribute("data-nav-scrolled");

    // Near the top, always show.
    if (y < TOP_ZONE) {
      setHidden(false);
      last = y;
      return;
    }

    // A modal dialog owns the screen; leave the chrome alone underneath it.
    if (document.querySelector("dialog[open]")) {
      last = y;
      return;
    }

    // Ignore momentum jitter and rubber-banding past the end of the document.
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (y > maxScroll) {
      last = y;
      return;
    }

    if (delta > HIDE_AT) setHidden(true);
    else if (delta < -REVEAL_AT) setHidden(false);
    else return; // below threshold: leave `last` alone so small moves accumulate

    last = y;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Keyboard focus must never land on an off-screen navbar.
  document.addEventListener("focusin", function (e) {
    var nav = document.getElementById("navbar");
    if (nav && e.target && nav.contains(e.target)) setHidden(false);
  });

  // A hash jump repositions without a directional scroll; show the bar so the
  // target is not left under a hidden header.
  window.addEventListener("hashchange", function () {
    setHidden(false);
    last = window.scrollY || 0;
  });

  update();
})();

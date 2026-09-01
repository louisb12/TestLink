(function () {
  var CONTENT_SELECTOR = ".mdx-content";
  var MARK_ATTR = "data-reveal-init";
  var STAGGER_MS = 60;
  var STAGGER_STEPS = 6;
  var MAX_UNWRAP_DEPTH = 3;
  // Reveal an element once its top has scrolled to within this fraction
  // of the viewport height. Checking position directly (instead of
  // relying only on IntersectionObserver's enter/exit callbacks) means
  // a fast or instant jump — e.g. clicking an "On this page" link — can
  // never skip over a section and leave it stuck invisible.
  var REVEAL_VH_FRACTION = 0.9;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var pending = [];

  function revealIfNeeded(el) {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (el.getBoundingClientRect().top < vh * REVEAL_VH_FRACTION) {
      el.classList.add("is-visible");
      return true;
    }
    return false;
  }

  function checkPending() {
    pending = pending.filter(function (el) {
      return !revealIfNeeded(el);
    });
  }

  var ticking = false;
  function scheduleCheck() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      checkPending();
    });
  }

  // Some pages wrap their whole article in one generic container div
  // (e.g. for page-scoped custom CSS). Descend through those so the
  // elements that actually get revealed are the real sections, not one
  // giant blob.
  function findRevealRoot(article) {
    var root = article;
    var depth = 0;
    while (
      depth < MAX_UNWRAP_DEPTH &&
      root.children.length === 1 &&
      root.children[0].tagName === "DIV"
    ) {
      root = root.children[0];
      depth++;
    }
    return root;
  }

  function initElement(el, index) {
    el.setAttribute(MARK_ATTR, "true");
    if (reduceMotion) return;
    el.classList.add("scroll-reveal");
    el.style.setProperty(
      "--reveal-delay",
      (index % STAGGER_STEPS) * STAGGER_MS + "ms"
    );
    if (!revealIfNeeded(el)) {
      pending.push(el);
    }
  }

  function scan() {
    var articles = document.querySelectorAll(CONTENT_SELECTOR);
    articles.forEach(function (article) {
      var root = findRevealRoot(article);
      var children = Array.prototype.slice.call(root.children);
      children.forEach(function (child, index) {
        if (!child.hasAttribute(MARK_ATTR)) {
          initElement(child, index);
        }
      });
    });
    scheduleCheck();
  }

  function scheduleScan() {
    if (scheduleScan._raf) window.cancelAnimationFrame(scheduleScan._raf);
    scheduleScan._raf = window.requestAnimationFrame(scan);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleScan);
  } else {
    scheduleScan();
  }

  window.addEventListener("scroll", scheduleCheck, { passive: true });
  window.addEventListener("resize", scheduleCheck);

  // Mintlify's docs pages navigate client-side (no full reload), which
  // swaps in a new .mdx-content article. Watch the page for that and
  // re-scan for newly-added, not-yet-initialized elements.
  var bodyObserver = new MutationObserver(scheduleScan);
  bodyObserver.observe(document.body, { childList: true, subtree: true });
})();

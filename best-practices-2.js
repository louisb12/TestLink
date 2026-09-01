(function () {
  /*
   * Progressive-enhancement extras for best-practices-2.mdx: scroll
   * progress bar, sticky-nav active-section highlighting, and
   * cursor-tracked spotlight glow. The page's mode explorer is
   * deliberately NOT here — it's pure CSS (radio inputs + sibling
   * selectors) so it keeps working even if this script never runs.
   *
   * Mintlify includes any .js file in the content directory on every
   * page and runs it after the page becomes interactive — it cannot be
   * scoped to one page and there's no import/hook support inside MDX,
   * so this is plain DOM JS, guarded to no-op unless this page's markup
   * (`.bp2-scope`) is present. Every effect here degrades harmlessly if
   * this script doesn't run at all: the progress bar just stays empty,
   * the nav pills still work as plain anchor links, and the spotlight
   * still shows its static CSS `:hover` glow without cursor-tracking.
   */

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var initialized = false;

  function setupProgressBar(root) {
    var bar = root.querySelector('[data-bp2-progress-bar]');
    if (!bar) return function () {};

    function update() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        update();
      });
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return function cleanup() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }

  function setupSectionNav(root) {
    var pills = Array.prototype.slice.call(
      root.querySelectorAll('[data-bp2-nav-target]')
    );
    if (!pills.length) return function () {};

    var targets = pills
      .map(function (pill) {
        var id = pill.getAttribute('data-bp2-nav-target');
        var el = document.getElementById(id);
        return el ? { pill: pill, el: el } : null;
      })
      .filter(Boolean);

    function setActive(id) {
      pills.forEach(function (pill) {
        pill.classList.toggle(
          'is-active',
          pill.getAttribute('data-bp2-nav-target') === id
        );
      });
    }

    var observer = null;
    if ('IntersectionObserver' in window && targets.length) {
      observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActive(entry.target.id);
            }
          });
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      targets.forEach(function (t) {
        observer.observe(t.el);
      });
    }

    function onClick(event) {
      var pill = event.target.closest('[data-bp2-nav-target]');
      if (!pill) return;
      var id = pill.getAttribute('data-bp2-nav-target');
      var el = document.getElementById(id);
      if (!el) return;
      event.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      setActive(id);
    }
    root.addEventListener('click', onClick);

    return function cleanup() {
      if (observer) observer.disconnect();
      root.removeEventListener('click', onClick);
    };
  }

  function setupSpotlights(root) {
    var els = Array.prototype.slice.call(
      root.querySelectorAll('.bp2-spotlight, .bp2-spotlight-card')
    );
    if (!els.length) return function () {};

    function onMove(event) {
      var el = event.currentTarget;
      var rect = el.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width) * 100;
      var y = ((event.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--bp2-x', x + '%');
      el.style.setProperty('--bp2-y', y + '%');
    }

    els.forEach(function (el) {
      el.addEventListener('mousemove', onMove);
    });

    return function cleanup() {
      els.forEach(function (el) {
        el.removeEventListener('mousemove', onMove);
      });
    };
  }

  var cleanups = [];

  function teardown() {
    cleanups.forEach(function (fn) {
      fn();
    });
    cleanups = [];
    initialized = false;
  }

  function setup(root) {
    initialized = true;
    cleanups.push(setupProgressBar(root));
    cleanups.push(setupSectionNav(root));
    cleanups.push(setupSpotlights(root));
  }

  function scan() {
    var root = document.querySelector('.bp2-scope');
    if (root && !initialized) {
      setup(root);
    } else if (!root && initialized) {
      teardown();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }

  // Mintlify navigates client-side, so keep re-checking as the DOM changes
  // (covers both this page mounting after the script first runs, and
  // navigating away from/back to it).
  var bodyObserver = new MutationObserver(scan);
  bodyObserver.observe(document.body, { childList: true, subtree: true });
})();

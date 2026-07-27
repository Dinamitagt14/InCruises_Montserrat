(function () {
  "use strict";

  /* ---- utilities ---- */
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "]", e); }
  }

  /* ---- smooth anchor scroll ---- */
  function setupSmoothScroll() {
    // Native scroll-behavior: smooth handles anchors via CSS.
    // JS only closes mobile menu on link click.
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  /* ---- nav ---- */
  function initNav() {
    var nav = document.getElementById("nav");
    if (!nav) return;

    function update() {
      if (window.scrollY > 40) nav.classList.add("is-solid");
      else nav.classList.remove("is-solid");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });

    // burger
    var burger = document.getElementById("navBurger");
    var mobile = document.getElementById("navMobile");
    if (burger && mobile) {
      burger.addEventListener("click", function () {
        mobile.classList.toggle("is-open");
      });
      mobile.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          mobile.classList.remove("is-open");
        });
      });
    }
  }

  /* ---- scroll reveals ---- */
  function initReveals() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.02, rootMargin: "0px 0px -4% 0px" });

    els.forEach(function (el) { io.observe(el); });

    // safety: force-reveal after 6s
    setTimeout(function () {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* ---- count-up ---- */
  function initCountUp() {
    var nums = document.querySelectorAll("[data-count-to]");
    if (!nums.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute("data-count-to"), 10);
        var start = 0;
        var duration = 1600;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---- hero parallax (subtle) ---- */
  function initHeroParallax() {
    // video hero — no parallax needed
  }

  /* ---- card hover tilt ---- */
  function initTilt() {
    if (matchMedia("(hover: none)").matches) return;
    var cards = document.querySelectorAll(".testimonial-card, .how-step");
    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        var y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
        card.style.transform = "perspective(800px) rotateY(" + x + "deg) rotateX(" + y + "deg) translateZ(4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---- boot ---- */
  function boot() {
    safe(setupSmoothScroll, "smoothScroll");
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initCountUp, "initCountUp");
    safe(initHeroParallax, "initHeroParallax");
    safe(initTilt, "initTilt");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();

/* Elite Roofing Solutions — shared behaviour (header, menus, tracking) */
(function () {
  "use strict";

  var doc = document;
  var header = doc.getElementById("site-header");
  var menuToggle = doc.getElementById("menu-toggle");
  var mobileNav = doc.getElementById("mobile-nav");
  var iconOpen = doc.getElementById("menu-icon-open");
  var iconClose = doc.getElementById("menu-icon-close");
  var servicesTrigger = doc.getElementById("services-trigger");
  var servicesMenu = doc.getElementById("services-menu");

  /* ---------------------------------------------------------------- header */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------- mobile menu */
  function setMobile(open) {
    if (!mobileNav || !menuToggle) return;
    mobileNav.hidden = !open;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (iconOpen) iconOpen.hidden = open;
    if (iconClose) iconClose.hidden = !open;
    if (open) {
      var first = mobileNav.querySelector("a");
      if (first) first.focus({ preventScroll: true });
    } else {
      menuToggle.focus({ preventScroll: true });
    }
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      setMobile(mobileNav.hidden);
    });

    mobileNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMobile(false);
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !mobileNav.hidden) setMobile(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900 && !mobileNav.hidden) {
        mobileNav.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
        if (iconOpen) iconOpen.hidden = false;
        if (iconClose) iconClose.hidden = true;
      }
    });
  }

  /* -------------------------------------------------------- services menu */
  function setServices(open) {
    if (!servicesTrigger || !servicesMenu) return;
    servicesTrigger.setAttribute("aria-expanded", String(open));
    servicesMenu.hidden = !open;
  }

  if (servicesTrigger && servicesMenu) {
    servicesTrigger.addEventListener("click", function (event) {
      event.stopPropagation();
      setServices(servicesMenu.hidden);
    });

    doc.addEventListener("click", function (event) {
      if (!servicesMenu.hidden && !event.target.closest(".nav-menu-wrap")) {
        setServices(false);
      }
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !servicesMenu.hidden) {
        setServices(false);
        servicesTrigger.focus();
      }
    });

    servicesMenu.addEventListener("keydown", function (event) {
      if (event.key !== "Tab") return;
      var links = Array.prototype.slice.call(servicesMenu.querySelectorAll("a"));
      var first = links[0];
      var last = links[links.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  /* -------------------------------------------------------------- tracking */
  function track(name, data) {
    if (typeof window.eliteTrack === "function") {
      window.eliteTrack(name, data);
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, data || {}));
  }


  doc.addEventListener("click", function (event) {
    var cta = event.target.closest("[data-track-cta]");
    if (cta) {
      track("cta_click", {
        cta: cta.getAttribute("data-track-cta"),
        label: (cta.textContent || "").trim().slice(0, 80),
        page: window.location.pathname
      });
      return;
    }

    var tile = event.target.closest("[data-track]");
    if (tile) {
      track("service_tile_click", {
        service: tile.getAttribute("data-track"),
        page: window.location.pathname
      });
      return;
    }

    var handoff = event.target.closest("[data-estimator-outbound]");
    if (handoff) {
      track("estimator_handoff", {
        url: handoff.getAttribute("href") || "",
        page: window.location.pathname
      });
    }
  });

  /* ------------------------------------------------------------------ year */
  var year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

/* The Kindled Movement Method -- Keene Jones
 *
 * CONFIG: two lines below are the only things to change to make the forms live.
 *
 * FORM_ENDPOINT -- paste a Formspree (or similar) URL here and both forms POST
 *   the signup straight to Keene's inbox with no mail client involved.
 *   Sign up free at formspree.io, make a form, paste the endpoint. Recommended.
 *
 * CONTACT_USER / CONTACT_DOMAIN -- the fallback used while FORM_ENDPOINT is empty.
 *   Submitting opens the visitor's mail app with the message pre-written. The
 *   address is assembled at runtime so scrapers do not lift it off the page.
 */
var FORM_ENDPOINT = "";
var CONTACT_USER = "keenejoness";
var CONTACT_DOMAIN = "gmail.com";

(function () {
  "use strict";

  var contact = function () { return CONTACT_USER + "@" + CONTACT_DOMAIN; };

  /* ---- sticky nav shadow ---- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("stuck", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---- scroll reveal ---- */
  var targets = document.querySelectorAll(".section .wrap > *, .hero-copy, .hero-fig");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    targets.forEach(function (el) {
      /* Anything already on screen at load stays visible. Only what sits below
       * the fold gets the reveal, so the first frame is never a blank page. */
      if (el.getBoundingClientRect().top < window.innerHeight - 40) { return; }
      el.classList.add("reveal");
      io.observe(el);
    });
  }


  /* ---- photo slots ----
   * Each .ph[data-slot="x"] tries assets/x.jpg. If the file is not there the
   * gradient panel simply stays, so the page never shows a broken image.
   */
  document.querySelectorAll(".ph[data-slot]").forEach(function (box) {
    var slot = box.getAttribute("data-slot");
    var probe = new Image();
    probe.onload = function () {
      probe.alt = box.getAttribute("data-alt") || "";
      box.appendChild(probe);
      box.classList.add("has-img");
    };
    probe.src = "assets/" + slot + ".jpg";
  });

  /* ---- forms ---- */
  var say = function (form, text, kind) {
    var msg = form.querySelector(".form-msg");
    msg.textContent = text;
    msg.className = "form-msg " + (kind || "");
  };

  var valid = function (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  var handle = function (form, subject, body) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var email = (data.get("email") || "").trim();
      var name = (data.get("name") || "").trim();

      if (!valid(email)) {
        say(form, "That email does not look right. Mind checking it?", "err");
        return;
      }

      if (FORM_ENDPOINT) {
        say(form, "Sending...");
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data
        }).then(function (res) {
          if (!res.ok) { throw new Error("bad status"); }
          form.reset();
          say(form, "Got it. Keene will be in touch soon.", "ok");
        }).catch(function () {
          say(form, "Something went wrong. Email " + contact() + " and she will sort it out.", "err");
        });
        return;
      }

      var lines = body(name, email);
      window.location.href = "mailto:" + contact() +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines);
      say(form, "Your mail app should be opening. Hit send and you are on the list.", "ok");
    });
  };

  handle(
    document.getElementById("spot-form"),
    "Saving my spot at a seminar",
    function (name, email) {
      return "Hi Keene,\n\nI would like to save a spot at an upcoming seminar.\n\nName: " +
        (name || "") + "\nEmail: " + email + "\n\nThanks!";
    }
  );

  handle(
    document.getElementById("video-form"),
    "Send me the free at-home movement videos",
    function (name, email) {
      return "Hi Keene,\n\nPlease send me the free at-home movement videos.\n\nEmail: " +
        email + "\n\nThanks!";
    }
  );
})();

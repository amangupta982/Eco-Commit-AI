document.addEventListener("DOMContentLoaded", function () {

  fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar-container").innerHTML = data;
      initializeNavbar();
    });

});

function initializeNavbar() {

  const isLoggedIn  = localStorage.getItem("ecoUser") === "true";
  const currentPage = window.location.pathname.split("/").pop() || "home.html";
  const navbar      = document.getElementById("mainNavbar");
  const navLinks    = document.getElementById("nav-links");
  const authSection = document.getElementById("auth-buttons");

  // ═══════════════════════════════════════
  // 1. SCROLL SHRINK + BLUR INTENSIFY
  // ═══════════════════════════════════════
  window.addEventListener("scroll", () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // ═══════════════════════════════════════
  // 2. LOGO MAGNETIC EFFECT
  // ═══════════════════════════════════════
  const logoBox = document.getElementById("logoBox");
  if (logoBox) {
    logoBox.addEventListener("mousemove", (e) => {
      const r  = logoBox.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.35;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.35;
      logoBox.style.transform = `translate(${dx}px,${dy}px) scale(1.1) rotate(-5deg)`;
    });
    logoBox.addEventListener("mouseleave", () => {
      logoBox.style.transform = "";
    });
  }

  // ═══════════════════════════════════════
  // HIDE ON LOGIN / SIGNUP
  // ═══════════════════════════════════════
  if (currentPage === "login.html" || currentPage === "signup.html") {
    if (navLinks)    navLinks.style.display    = "none";
    if (authSection) authSection.style.display = "none";
    return;
  }

  // ═══════════════════════════════════════
  // NOT LOGGED IN — Sign In + Sign Up
  // ═══════════════════════════════════════
  if (!isLoggedIn) {
    if (authSection) {
      authSection.innerHTML = `
        <button class="sign-in-btn" id="goLogin">Sign In</button>
        <button class="sign-up-btn" id="goSignup">Sign Up →</button>
      `;
      addRipple(document.getElementById("goLogin"));
      addRipple(document.getElementById("goSignup"));
      document.getElementById("goLogin").onclick  = () => window.location.href = "login.html";
      document.getElementById("goSignup").onclick = () => window.location.href = "signup.html";
      applyMagnetic(document.getElementById("goLogin"));
      applyMagnetic(document.getElementById("goSignup"));
    }
    return;
  }

  // ═══════════════════════════════════════
  // LOGGED IN — Nav links + user chip
  // ═══════════════════════════════════════

  // Nav page definitions
  const pages = [
    { label: "Home",      href: "home.html"      },
    { label: "Dashboard", href: "dashboard.html" },
    { label: "Profile",   href: "profile.html"   },
    { label: "Rewards",   href: "rewards.html"   },
  ];

  // ── 3. BUILD LINKS with pill indicator ──
  if (navLinks) {
    // Keep pill indicator inside
    const pill = document.getElementById("navPill") || (() => {
      const p = document.createElement("div");
      p.id = "navPill"; p.className = "nav-pill-indicator";
      navLinks.prepend(p); return p;
    })();

    pages.forEach((page, i) => {
      const a = document.createElement("a");
      a.href      = page.href;
      a.className = "nav-link" + (currentPage === page.href ? " active" : "");
      a.textContent = page.label;

      // 4. STAGGER ENTRANCE
      a.style.animationDelay = `${0.55 + i * 0.08}s`;
      setTimeout(() => a.classList.add("link-visible"), 10);

      // 5. MAGNETIC NAV LINKS
      applyMagnetic(a, 0.22);

      // 6. PILL SWITCHER — move pill on hover
      a.addEventListener("mouseenter", () => movePill(a, pill));
      a.addEventListener("mouseleave", () => {
        // Return pill to active link
        const active = navLinks.querySelector(".nav-link.active");
        if (active) movePill(active, pill);
        else pill.style.opacity = "0";
      });

      // 7. GRADIENT UNDERLINE handled by CSS ::after

      // Ripple on click
      addRipple(a);

      navLinks.appendChild(a);
    });

    // Init pill on active link
    requestAnimationFrame(() => {
      const active = navLinks.querySelector(".nav-link.active");
      if (active) { movePill(active, pill); pill.style.opacity = "1"; }
    });
  }

  // ── 8. USER AVATAR CHIP ──
  if (authSection) {
    const userName  = localStorage.getItem("ecoUserName") || "User";
    const ecoPoints = localStorage.getItem("ecoPoints")   || "124";
    const initials  = userName.slice(0, 2).toUpperCase();

    authSection.innerHTML = `
      <div class="user-chip" id="userChip">
        <div class="user-avatar">${initials}</div>
        <div>
          <div class="user-name">${userName}</div>
          <div class="user-eco-pts">🌿 EcoPoints</div>
        </div>
        <span class="eco-pts-badge">${Number(ecoPoints).toLocaleString()} pts</span>
      </div>
    `;

    const chip = document.getElementById("userChip");
    if (chip) {
      applyMagnetic(chip, 0.2);
      chip.addEventListener("click", () => window.location.href = "profile.html");
    }
  }

  // ── 9. CTA "Track Now" BUTTON ──
  if (authSection && currentPage !== "dashboard.html") {
    const cta = document.createElement("button");
    cta.className   = "sign-up-btn";
    cta.textContent = "Track Now →";
    cta.style.cssText = "margin-left:8px;";
    cta.onclick = () => window.location.href = "dashboard.html";
    addRipple(cta);
    applyMagnetic(cta);
    authSection.appendChild(cta);
  }

}

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════

// Move sliding pill to target link
function movePill(linkEl, pill) {
  if (!linkEl || !pill) return;
  const navLinks = pill.parentElement;
  const navRect  = navLinks.getBoundingClientRect();
  const linkRect = linkEl.getBoundingClientRect();
  pill.style.opacity = "1";
  pill.style.left    = (linkRect.left - navRect.left) + "px";
  pill.style.width   = linkRect.width + "px";
}

// Magnetic hover effect
function applyMagnetic(el, strength = 0.28) {
  if (!el) return;
  el.addEventListener("mousemove", (e) => {
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * strength;
    const dy = (e.clientY - r.top  - r.height / 2) * strength;
    el.style.transform  = `translate(${dx}px,${dy}px)`;
    el.style.transition = "transform 0.1s ease";
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform  = "translate(0,0)";
    el.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
  });
}

// Ripple click effect
function addRipple(el) {
  if (!el) return;
  el.addEventListener("click", (e) => {
    const rect   = el.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "nav-ripple";
    ripple.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
    `;
    el.style.position = "relative";
    el.style.overflow = "hidden";
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
  });
}
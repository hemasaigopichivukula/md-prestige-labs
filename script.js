const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");

const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 40);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]:not(.nav-cta)')];
const linkedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && linkedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -60%", threshold: [0, 0.15, 0.35] });
  linkedSections.forEach((section) => sectionObserver.observe(section));
}

if (menuToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    header.classList.remove("menu-active");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  };

  menuToggle.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menuToggle.classList.toggle("active", open);
    header.classList.toggle("menu-active", open);
    document.body.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px" });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const viewer = document.querySelector(".image-viewer");
const viewerImage = viewer?.querySelector(".viewer-stage img");
const viewerTitle = viewer?.querySelector("#viewerTitle");
const viewerReset = viewer?.querySelector(".viewer-reset");
let viewerZoom = 1;
let viewerBaseWidth = 0;
let lastViewerTrigger = null;

if (viewer && viewerImage && viewerTitle && viewerReset) {
  const updateZoom = () => {
    viewerImage.style.width = `${Math.round(viewerBaseWidth * viewerZoom)}px`;
    viewerReset.textContent = `${Math.round(viewerZoom * 100)}%`;
  };

  const fitViewerImage = () => {
    const stage = viewer.querySelector(".viewer-stage");
    const availableWidth = Math.max(240, stage.clientWidth - 20);
    const availableHeight = Math.max(320, stage.clientHeight - 20);
    const widthForHeight = availableHeight * (viewerImage.naturalWidth / viewerImage.naturalHeight);
    viewerBaseWidth = Math.min(viewerImage.naturalWidth, availableWidth, widthForHeight);
    updateZoom();
  };

  const setZoom = (value) => {
    viewerZoom = Math.min(3, Math.max(0.5, value));
    updateZoom();
  };

  const closeViewer = () => {
    viewer.classList.remove("open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    viewerImage.src = "";
    lastViewerTrigger?.focus();
  };

  document.querySelectorAll("[data-full-image]").forEach((button) => {
    button.addEventListener("click", () => {
      lastViewerTrigger = button;
      viewerZoom = 1;
      viewerImage.src = button.dataset.fullImage;
      viewerImage.alt = `${button.dataset.imageTitle} full ingredient flyer`;
      viewerTitle.textContent = button.dataset.imageTitle;
      viewer.classList.add("open");
      viewer.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
      viewerImage.addEventListener("load", fitViewerImage, { once: true });
      viewer.querySelector(".viewer-close").focus();
    });
  });

  viewer.querySelector(".viewer-zoom-in").addEventListener("click", () => setZoom(viewerZoom + 0.25));
  viewer.querySelector(".viewer-zoom-out").addEventListener("click", () => setZoom(viewerZoom - 0.25));
  viewerReset.addEventListener("click", () => setZoom(1));
  viewer.querySelector(".viewer-close").addEventListener("click", closeViewer);
  viewer.addEventListener("click", (event) => { if (event.target === viewer) closeViewer(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && viewer.classList.contains("open")) closeViewer(); });
  window.addEventListener("resize", () => { if (viewer.classList.contains("open")) fitViewerImage(); });
}

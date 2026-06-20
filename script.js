const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const faqItem = button.closest(".faq-item");

    document.querySelectorAll(".faq-item").forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove("active");
      }
    });

    faqItem.classList.toggle("active");
  });
});
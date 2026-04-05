const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector(".form-note");
const projectSliders = document.querySelectorAll("[data-project-slider]");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

if (projectSliders.length) {
  projectSliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll(".project-slide"));
    const prevButton = slider.querySelector(".project-slider-prev");
    const nextButton = slider.querySelector(".project-slider-next");
    const card = slider.closest(".project-card");
    const titleElement = card ? card.querySelector(".slider-project-title") : null;
    const descriptionElement = card ? card.querySelector(".slider-project-description") : null;
    const linkElement = card ? card.querySelector(".slider-project-link") : null;
    let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));

    if (!slides.length || !prevButton || !nextButton || !titleElement || !descriptionElement || !linkElement) {
      return;
    }

    if (currentIndex < 0) {
      currentIndex = 0;
    }

    const updateSlide = (nextIndex) => {
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === nextIndex);

        const slideVideos = slide.querySelectorAll("video");
        slideVideos.forEach((video) => {
          if (index === nextIndex) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });

        const slideEmbeds = slide.querySelectorAll("iframe[data-embed-src]");
        slideEmbeds.forEach((embed) => {
          const embedSrc = embed.getAttribute("data-embed-src") || "about:blank";
          embed.src = index === nextIndex ? embedSrc : "about:blank";
        });
      });

      const activeSlide = slides[nextIndex];
      titleElement.textContent = activeSlide.getAttribute("data-project-title") || "Website Design Project";
      descriptionElement.textContent =
        activeSlide.getAttribute("data-project-description") || "Preview the selected project and open it with the button below.";
      linkElement.href = activeSlide.getAttribute("data-project-link") || "#";
      currentIndex = nextIndex;
    };

    prevButton.addEventListener("click", (event) => {
      event.preventDefault();
      const nextIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlide(nextIndex);
    });

    nextButton.addEventListener("click", (event) => {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % slides.length;
      updateSlide(nextIndex);
    });

    updateSlide(currentIndex);
  });
}

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name");

    formNote.textContent = `Thank you${name ? `, ${name}` : ""}. Your message is ready to be shared. You can also email directly at crazysreva@gmail.com.`;
    contactForm.reset();
  });
}

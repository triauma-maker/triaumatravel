import { getSiteContent } from "../utils/siteContentStorage";
import { parseOptimizedVideo } from "../utils/videoOptimizer";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function contentCard(item: any, basePath: string): string {
  const slug = encodeURIComponent(item.slug || "");
  const detailPath = basePath === "hotels"
    ? `/hotels/?hotel=${slug}`
    : basePath === "journal"
      ? `/journal/?story=${slug}`
      : `/${basePath}/${slug}/`;
  const learnMore = basePath === "journal" || basePath === "hotels"
    ? `<a href="${detailPath}" class="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-forest transition-colors hover:text-gold">LEARN MORE <span aria-hidden="true">↗</span></a>`
    : "";
  return `
    <article class="group">
      <a href="${detailPath}" class="block overflow-hidden bg-sand">
        <div class="aspect-[4/3] overflow-hidden">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]" />
        </div>
      </a>
      <p class="mt-5 text-[10px] tracking-[0.2em] text-stone-500">${escapeHtml(item.category)}</p>
      <h3 class="mt-3 font-display text-3xl leading-tight md:text-4xl">
        <a href="${detailPath}" class="transition-opacity group-hover:opacity-65">${escapeHtml(item.title)}</a>
      </h3>
      <p class="mt-3 text-sm leading-7 text-stone-600 ${basePath === "journal" ? "line-clamp-4" : basePath === "hotels" ? "line-clamp-3" : ""}">${escapeHtml(item.description)}</p>
      ${learnMore}
    </article>`;
}

export function initSiteContentHydration() {
  if (typeof window === "undefined") return;

  const content = getSiteContent();
  const path = window.location.pathname;

  // 1. Hydrate Header and Brand
  const brandLogos = document.querySelectorAll(".brand-name-text");
  brandLogos.forEach((el) => {
    el.textContent = content.general.brandName;
  });

  // 2. Hydrate Contact Links (WhatsApp / Email)
  const waLinks = document.querySelectorAll<HTMLAnchorElement>("a[href*='wa.me']");
  if (content.contact.whatsapp) {
    const cleanWa = content.contact.whatsapp.replace(/[^0-9]/g, "");
    waLinks.forEach((a) => {
      if (a.href.includes("wa.me")) {
        const url = new URL(a.href);
        const textParam = url.searchParams.get("text");
        a.href = `https://wa.me/${cleanWa}${textParam ? `?text=${encodeURIComponent(textParam)}` : ""}`;
      }
    });
  }

  // 3. Homepage Specific Hydration
  if (path === "/" || path === "/index.html") {
    // Hero
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle && content.general.heroTitle) {
      heroTitle.textContent = content.general.heroTitle;
    }

    const heroEyebrow = document.querySelector(".hero-eyebrow");
    if (heroEyebrow && content.general.heroEyebrow) {
      heroEyebrow.textContent = content.general.heroEyebrow;
    }

    const heroImage = document.querySelector<HTMLImageElement>(".hero-image");
    if (heroImage) {
      if (content.general.heroImage) {
        heroImage.src = content.general.heroImage;
        heroImage.classList.remove("hidden");
      } else {
        heroImage.removeAttribute("src");
      }
    }

    // Hero Background Video / Image Hydration
    const heroMediaWrap = document.getElementById("hero-media-wrap");
    if (heroMediaWrap) {
      const mediaType = content.general.heroMediaType || "image";
      const videoUrl = content.general.heroVideoUrl || "";
      const videoInfo = parseOptimizedVideo(videoUrl);

      const existingVideo = heroMediaWrap.querySelector(".hero-video-player");
      const existingFrame = heroMediaWrap.querySelector(".hero-video-frame-wrap");
      if (existingVideo) existingVideo.remove();
      if (existingFrame) existingFrame.remove();

      if (mediaType === "video" && videoInfo.type !== "none") {
        if (heroImage) {
          heroImage.classList.remove("opacity-100", "opacity-30");
          heroImage.classList.add("opacity-0");
        }

        if (videoInfo.type === "direct" || videoInfo.type === "gdrive") {
          const videoEl = document.createElement("video");
          videoEl.autoplay = true;
          videoEl.muted = true;
          videoEl.loop = true;
          videoEl.playsInline = true;
          videoEl.preload = "auto";
          videoEl.className = "hero-video-player absolute inset-0 h-full w-full object-cover pointer-events-none";
          if (content.general.heroImage) videoEl.poster = content.general.heroImage;

          const sourceEl = document.createElement("source");
          sourceEl.src = videoInfo.streamUrl!;
          const sourceUrl = videoInfo.originalUrl.toLowerCase().split(/[?#]/)[0];
          if (videoInfo.type === "direct") {
            sourceEl.type = sourceUrl.endsWith(".webm") ? "video/webm" : sourceUrl.endsWith(".ogv") || sourceUrl.endsWith(".ogg") ? "video/ogg" : "video/mp4";
          }
          videoEl.appendChild(sourceEl);
          videoEl.dataset.gdrive = videoInfo.type === "gdrive" ? "true" : "false";
          heroMediaWrap.appendChild(videoEl);
          videoEl.play().catch(() => undefined);
          videoEl.addEventListener("error", () => {
            videoEl.remove();
            const frameWrap = document.createElement("div");
            frameWrap.className = "hero-video-frame-wrap absolute inset-0 z-[3] h-full w-full overflow-hidden";
            frameWrap.innerHTML = `<iframe src="${videoInfo.embedUrl}" title="Hero Background Video" class="absolute inset-0 h-full w-full border-0 pointer-events-none" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
            heroMediaWrap.appendChild(frameWrap);
          }, { once: true });
        } else {
          const frameWrap = document.createElement("div");
          frameWrap.className = "hero-video-frame-wrap absolute inset-0 h-full w-full overflow-hidden pointer-events-none";
          frameWrap.innerHTML = `
            <iframe
              src="${videoInfo.embedUrl}"
              title="Hero Background Video"
              class="hero-video-iframe absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.77vh] h-[56.25vw] pointer-events-none border-0"
              allow="autoplay; encrypted-media; fullscreen"
              allowfullscreen
              loading="lazy"
            ></iframe>
          `;
          heroMediaWrap.appendChild(frameWrap);
        }
      } else {
        if (heroImage) {
          heroImage.classList.remove("opacity-30", "opacity-0");
          heroImage.classList.add("opacity-100");
        }
      }
    }

    // Calendar Events Hydration
    const eventsGrid = document.querySelector(".home-events-grid");
    if (eventsGrid && content.events && content.events.length > 0) {
      eventsGrid.innerHTML = content.events
        .map((evt) => {
          let badgeClass = "bg-amber-100 text-amber-900 border-amber-300";
          let badgeText = "UPCOMING EVENT";
          if (evt.status === "past") {
            badgeClass = "bg-stone-200/80 text-stone-700 border-stone-300";
            badgeText = "PAST EVENT";
          } else if (evt.status === "current") {
            badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
            badgeText = "● HAPPENING NOW";
          }

          return `
            <article data-event-status="${evt.status}" class="event-card-item bg-white border border-forest/15 shadow-sm flex flex-col justify-between overflow-hidden group hover:border-forest/40 hover:shadow-md transition-all duration-300">
              <div>
                <div class="aspect-[16/10] overflow-hidden bg-sand relative">
                  <img
                    src="${evt.image}"
                    alt="${evt.title}"
                    loading="lazy"
                    class="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div class="absolute top-3 left-3">
                    <span class="text-[9px] tracking-widest px-2.5 py-1 uppercase border font-semibold backdrop-blur-sm ${badgeClass}">
                      ${evt.badge || badgeText}
                    </span>
                  </div>
                  <div class="absolute bottom-3 left-3">
                    <span class="bg-forest/85 text-white text-[9px] tracking-widest px-2.5 py-1 uppercase backdrop-blur-sm">
                      ${evt.category}
                    </span>
                  </div>
                </div>

                <div class="p-6">
                  <div class="flex flex-wrap items-center justify-between text-[11px] text-gold font-semibold uppercase tracking-wider mb-2">
                    <span>🗓️ ${evt.dateDisplay}</span>
                  </div>

                  <h3 class="font-display text-2xl text-forest mt-1 mb-2 leading-snug group-hover:text-gold transition-colors">
                    ${evt.title}
                  </h3>

                  <p class="text-[11px] text-stone-500 mb-3 flex items-center gap-1">
                    <span>📍</span>
                    <span>${evt.location}</span>
                  </p>

                  <p class="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    ${evt.description}
                  </p>
                </div>
              </div>

              <div class="px-6 pb-6 pt-3 border-t border-forest/10 flex items-center justify-between text-xs">
                <span class="text-[10px] text-stone-400 uppercase tracking-widest">
                  ${evt.status === "current" ? "Active Program" : evt.status === "past" ? "Archived Event" : "Bookings Open"}
                </span>
                <button
                  type="button"
                  data-event-id="${evt.id}"
                  class="btn-event-learn-more font-semibold text-forest hover:text-gold tracking-wider text-[11px] uppercase transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>LEARN MORE</span>
                  <span>↗</span>
                </button>
              </div>
            </article>
          `;
        })
        .join("");
    }

    // Philosophy Section
    const philoTitle = document.querySelector(".philosophy-title");
    if (philoTitle && content.general.philosophyTitle) {
      philoTitle.textContent = content.general.philosophyTitle;
    }

    const philoText = document.querySelector(".philosophy-text");
    if (philoText && content.general.philosophyText) {
      philoText.textContent = content.general.philosophyText;
    }

    // CTA Section
    const ctaTitle = document.querySelector(".home-cta-title");
    if (ctaTitle && content.general.ctaTitle) {
      ctaTitle.textContent = content.general.ctaTitle;
    }

    const homeHotels = document.querySelector(".home-hotels-grid");
    if (homeHotels) homeHotels.innerHTML = content.hotels.slice(0, 3).map((item) => contentCard(item, "hotels")).join("");

    const homeJournal = document.querySelector(".home-journal-grid");
    if (homeJournal) {
      const baliJournalSlugs = new Set(["slow-days-in-bali", "sacred-bali", "beyond-the-beaches", "a-balinese-table"]);
      const featuredJournal = [...content.journal.filter((item: any) => baliJournalSlugs.has(item.slug)), ...content.journal.filter((item: any) => !baliJournalSlugs.has(item.slug))].slice(0, 4);
      homeJournal.innerHTML = featuredJournal.map((item) => contentCard(item, "journal")).join("");
    }

    const homePlans = document.querySelector(".home-plans-grid");
    if (homePlans) homePlans.innerHTML = content.plans.slice(0, 6).map((item) => contentCard(item, "plans")).join("");
  }

  // Hotels and Experience page hero media
  const pageHeroKey = path.includes("/experience") ? "experienceHero" : null;
  if (pageHeroKey) {
    const pageHero = (content as any)[pageHeroKey];
    const heroMediaWrap = document.getElementById("hero-media-wrap");
    const heroImage = heroMediaWrap?.querySelector<HTMLImageElement>(".hero-image") || null;
    if (heroMediaWrap && pageHero) {
      heroMediaWrap.querySelectorAll(".hero-video-player, .hero-video-frame-wrap").forEach((element) => element.remove());
      if (heroImage) {
        if (pageHero.image) {
          heroImage.hidden = false;
          heroImage.src = pageHero.image;
        } else {
          heroImage.hidden = true;
          heroImage.removeAttribute("src");
        }
      }
      const videoInfo = parseOptimizedVideo(pageHero.videoUrl || "");
      if (pageHero.mediaType === "video" && videoInfo.type !== "none") {
        heroImage?.classList.remove("opacity-100");
        heroImage?.classList.add("opacity-0");
        if (videoInfo.type === "direct" || videoInfo.type === "gdrive") {
          const video = document.createElement("video");
          video.autoplay = true;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.preload = "auto";
          video.className = "hero-video-player absolute inset-0 z-[3] h-full w-full object-cover pointer-events-none";
          if (pageHero.image) video.poster = pageHero.image;
          const source = document.createElement("source");
          source.src = videoInfo.streamUrl || "";
          const sourceUrl = videoInfo.originalUrl.toLowerCase().split(/[?#]/)[0];
          if (videoInfo.type === "direct" && sourceUrl.endsWith(".webm")) source.type = "video/webm";
          else if (videoInfo.type === "direct" && (sourceUrl.endsWith(".ogv") || sourceUrl.endsWith(".ogg"))) source.type = "video/ogg";
          else if (videoInfo.type === "direct" && sourceUrl.endsWith(".mp4")) source.type = "video/mp4";
          video.appendChild(source);
          heroMediaWrap.appendChild(video);
          video.play().catch((error: unknown) => {
            console.error("Failed to autoplay page hero video:", error);
          });
          video.addEventListener("error", () => {
            video.remove();
            if (videoInfo.embedUrl) {
              const frame = document.createElement("div");
              frame.className = "hero-video-frame-wrap absolute inset-0 z-[3] h-full w-full overflow-hidden pointer-events-none";
              frame.innerHTML = `<iframe src="${videoInfo.embedUrl}" title="Page Background Video" class="hero-video-iframe absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.77vh] h-[56.25vw] border-0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
              heroMediaWrap.appendChild(frame);
            } else {
              console.error("Page hero video could not be loaded:", videoInfo.originalUrl);
            }
          }, { once: true });
        } else {
          const frame = document.createElement("div");
          frame.className = "hero-video-frame-wrap absolute inset-0 z-[3] h-full w-full overflow-hidden pointer-events-none";
          frame.innerHTML = `<iframe src="${videoInfo.embedUrl}" title="Page Background Video" class="absolute inset-0 h-full w-full border-0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
          heroMediaWrap.appendChild(frame);
        }
      } else {
        heroImage?.classList.remove("opacity-0");
        heroImage?.classList.add("opacity-100");
      }
    }
  }

  // Collection pages
  const hotelsGrid = document.querySelector(".cms-hotels-grid");
  if (hotelsGrid && path.includes("/hotels")) {
    hotelsGrid.innerHTML = content.hotels.map((item) => contentCard(item, "hotels")).join("");
  }

  const journalGrid = document.querySelector(".cms-journal-grid");
  if (journalGrid && (path === "/journal" || path === "/journal/" || path === "/journal/index.html")) {
    journalGrid.innerHTML = content.journal.map((item) => contentCard(item, "journal")).join("");
  }

  // 4. Contact Page Hydration
  if (path.includes("/contact")) {
    const waDisplay = document.getElementById("contact-display-wa");
    const waLink = document.getElementById("contact-page-wa") as HTMLAnchorElement;
    if (waDisplay && content.contact.whatsapp) {
      waDisplay.textContent = content.contact.whatsapp;
    }
    if (waLink && content.contact.whatsapp) {
      const cleanWa = content.contact.whatsapp.replace(/[^0-9]/g, "");
      waLink.href = `https://wa.me/${cleanWa}`;
    }

    const emailLink = document.getElementById("contact-page-email") as HTMLAnchorElement;
    if (emailLink && content.contact.email) {
      emailLink.textContent = content.contact.email;
      emailLink.href = `mailto:${content.contact.email}`;
    }

    const phoneDisplay = document.getElementById("contact-display-phone");
    if (phoneDisplay && content.contact.phone) {
      phoneDisplay.textContent = content.contact.phone;
    }

    const addressDisplay = document.getElementById("contact-display-address");
    if (addressDisplay && content.contact.address) {
      addressDisplay.textContent = content.contact.address;
    }

    const hoursDisplay = document.getElementById("contact-display-hours");
    if (hoursDisplay && content.contact.officeHours) {
      hoursDisplay.textContent = content.contact.officeHours;
    }
  }

  // 5. About Page Hydration
  if (path === "/about/" || path === "/about" || path === "/about/index.html") {
    const about = content.about;

    if (about.eyebrow) {
      const eyebrow = document.querySelector(".hero-eyebrow");
      if (eyebrow) eyebrow.textContent = about.eyebrow;
    }
    if (about.title) {
      const title = document.querySelector(".hero-title");
      if (title) title.textContent = about.title;
    }
    if (about.subtitle) {
      const subtitle = document.querySelector(".hero-subtitle");
      if (subtitle) subtitle.textContent = about.subtitle;
    }
    if (about.image) {
      const image = document.querySelector<HTMLImageElement>(".hero-image");
      if (image) image.src = about.image;
    }

    const whatsapp = document.getElementById("about-contact-whatsapp") as HTMLAnchorElement;
    if (whatsapp && content.contact.whatsapp) {
      const phoneNumber = content.contact.whatsapp.replace(/[^0-9]/g, "");
      whatsapp.textContent = content.contact.whatsapp;
      whatsapp.href = `https://wa.me/${phoneNumber}`;
    }
    const email = document.getElementById("about-contact-email") as HTMLAnchorElement;
    if (email && content.contact.email) {
      email.textContent = content.contact.email;
      email.href = `mailto:${content.contact.email}`;
    }
    const phone = document.getElementById("about-contact-phone");
    if (phone && content.contact.phone) phone.textContent = content.contact.phone;
    const hours = document.getElementById("about-contact-hours");
    if (hours && content.contact.officeHours) hours.textContent = content.contact.officeHours;
    const address = document.getElementById("about-contact-address");
    if (address && content.contact.address) address.textContent = content.contact.address;

    if (about.philosophyTitle) {
      const philosophyTitle = document.querySelector(".about-philosophy-title");
      if (philosophyTitle) philosophyTitle.textContent = about.philosophyTitle;
    }
    if (about.philosophyParagraphs?.length) {
      const paragraphs = document.querySelector(".about-philosophy-paragraphs");
      if (paragraphs) {
        paragraphs.querySelectorAll("p").forEach((paragraph) => paragraph.remove());
        const contactLink = paragraphs.querySelector("a");
        about.philosophyParagraphs.forEach((text) => {
          const paragraph = document.createElement("p");
          paragraph.textContent = text;
          paragraphs.insertBefore(paragraph, contactLink);
        });
      }
    }
  }

  // 6. FAQ Page Hydration
  if (path.includes("/faq")) {
    const faqContainer = document.querySelector(".faq-accordion-list");
    if (faqContainer && content.faqs && content.faqs.length > 0) {
      faqContainer.innerHTML = content.faqs
        .map(
          (faq, idx) => `
          <details class="group border-b border-stone-300 py-6">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-5 text-base">
              <span>${idx + 1}. ${faq.question}</span>
              <span class="text-xl transition-transform group-open:rotate-45">+</span>
            </summary>
            <p class="max-w-2xl pt-5 text-sm leading-7 text-stone-600">
              ${faq.answer}
            </p>
          </details>
        `
        )
        .join("");
    }
  }
}

// Run on page load
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSiteContentHydration);
  } else {
    initSiteContentHydration();
  }

  window.addEventListener("tria_uma_site_content_updated", () => {
    initSiteContentHydration();
  });
}

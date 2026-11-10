export interface HotelFacilityPhoto {
  image: string;
  description: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderHotelFacilitiesHtml(facilities: HotelFacilityPhoto[] = []): string {
  const entries = facilities.filter((item) => item.image || item.description);
  if (!entries.length) return "";

  const cards = entries.map((item) => `
    <article class="flex flex-col overflow-hidden border border-forest/10 bg-white shadow-sm">
      ${item.image ? `
        <div class="aspect-[4/3] overflow-hidden bg-sand">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.description || "Hotel space and amenity")}" class="h-full w-full object-cover transition duration-700 hover:scale-[1.03]" loading="lazy" />
        </div>
      ` : ""}
      ${item.description ? `<p class="flex-1 px-5 py-4 text-sm leading-7 text-stone-600">${escapeHtml(item.description)}</p>` : ""}
    </article>
  `).join("");

  return `
    <section class="container-editorial pb-20 md:pb-28" data-hotel-facilities>
      <div class="mb-8 max-w-2xl">
        <p class="mb-3 text-[10px] tracking-[0.25em] text-stone-500">A CLOSER LOOK</p>
        <h2 class="editorial-title text-4xl text-forest sm:text-5xl">Spaces &amp; Amenities</h2>
      </div>
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">${cards}</div>
    </section>
  `;
}

export function hydrateHotelFacilities(container: HTMLElement, facilities: HotelFacilityPhoto[] = []) {
  container.innerHTML = renderHotelFacilitiesHtml(facilities);
}

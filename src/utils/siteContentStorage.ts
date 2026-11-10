import {
  hotels as defaultHotels,
  journal as defaultJournal,
  plans as defaultPlans,
  offers as defaultOffers,
  type TravelItem,
} from "../data/content";
import {
  fetchCmsPayload,
  isAdminLoggedIn,
  signInAdmin,
  signOutAdmin,
  saveCmsPayloadPatch,
} from "./cmsBackend";

export interface ExperienceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  status: "past" | "current" | "upcoming";
  dateDisplay: string;
  location: string;
  description: string;
  image: string;
  link?: string;
  badge?: string;
}

export interface SiteGeneralContent {
  brandName: string;
  brandTagline: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroVideoUrl?: string;
  heroMediaType?: "image" | "video";
  philosophyEyebrow: string;
  philosophyTitle: string;
  philosophyText: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaButtonText: string;
}

export interface SitePageHeroContent {
  mediaType: "image" | "video";
  image: string;
  videoUrl: string;
}

export interface SiteAboutContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  philosophyTitle: string;
  philosophyParagraphs: string[];
}

export interface SiteContactContent {
  email: string;
  whatsapp: string;
  phone: string;
  address: string;
  officeHours: string;
}

export interface SiteContentStore {
  general: SiteGeneralContent;
  hotelsHero: SitePageHeroContent;
  experienceHero: SitePageHeroContent;
  hotels: TravelItem[];
  journal: TravelItem[];
  plans: TravelItem[];
  offers: TravelItem[];
  experiences: ExperienceItem[];
  events: EventItem[];
  faqs: FAQItem[];
  about: SiteAboutContent;
  contact: SiteContactContent;
}

export const defaultExperiences: ExperienceItem[] = [
  {
    id: "exp-1",
    category: "ACTIVITY",
    title: "Beyond the Familiar",
    description: "Private excursions and extraordinary adventures shaped by nature and culture.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
    href: "/contact/",
  },
  {
    id: "exp-2",
    category: "FOOD & WINE",
    title: "A Taste of Place",
    description: "Discover destinations through their ancestral cuisine, masterclasses, and vineyard estates.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85",
    href: "/contact/",
  },
  {
    id: "exp-3",
    category: "SPA & RETREAT",
    title: "Time to Reconnect",
    description: "Restorative escapes shaped by ancient sound therapies, holistic spas, and quiet reflection.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85",
    href: "/contact/",
  },
];

export const defaultEvents: EventItem[] = [
  {
    id: "evt-past-bbtf",
    title: "BBTF 2026 (Bali & Beyond Travel Fair)",
    category: "B2B TRADESHOW & TABLE TOP",
    status: "past",
    dateDisplay: "10 - 13 JUNE 2026",
    location: "BNDCC Nusa Dua, Bali",
    description: "Indonesia's leading international travel tradeshow. Tria Uma participated in exclusive B2B table tops and buyer-seller negotiations with luxury global agents.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    link: "https://bbtf.or.id",
    badge: "PAST EVENT",
  },
  {
    id: "evt-current-sanur",
    title: "Sanur Village Festival & Luxury Regatta",
    category: "LIFESTYLE & TOURISM",
    status: "current",
    dateDisplay: "06 - 10 NOVEMBER 2026",
    location: "Mertasari Beach, Sanur, Bali",
    description: "Happening now. A coastal convergence of water sports, culinary feasts, cultural parades, and international luxury yacht showcases along Sanur's golden shores.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    link: "#",
    badge: "HAPPENING NOW",
  },
  {
    id: "evt-upcoming-pkb",
    title: "Pesta Kesenian Bali (PKB) XLVII 2027",
    category: "ANNUAL CULTURAL CALENDAR",
    status: "upcoming",
    dateDisplay: "15 JUNE - 13 JULY 2027",
    location: "Taman Budaya Art Center, Denpasar",
    description: "The grandest annual month-long arts festival in Bali. Experience royal processions, sacred gamelan competitions, theatrical epics, and traditional street parades.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
    link: "#",
    badge: "UPCOMING EVENT",
  },
];

export const defaultFaqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Can I customise my itinerary?",
    answer: "Yes, every journey is completely bespoke. You can tailor destinations, luxury accommodations, chauffeured vehicle types, and curated daily experiences using our online Custom Itinerary Builder or with our travel designers.",
  },
  {
    id: "faq-2",
    question: "Can I request a particular hotel or private villa?",
    answer: "Absolutely. We partner with premier boutique hotels, private cliffside villas, and luxury resorts across Southeast Asia and beyond. Let our team know your preference upon submitting your itinerary.",
  },
  {
    id: "faq-3",
    question: "How do I receive an official quotation and travel proposal?",
    answer: "Simply design your custom itinerary on our 'Plan Your Journey' page, generate a PDF proposal, and click 'Submit to Reservation'. Our reservation team will respond promptly with a personalized quote including all privileges.",
  },
  {
    id: "faq-4",
    question: "What vehicle types are available for private tours?",
    answer: "We offer executive vehicles including the Toyota Alphard VIP, Toyota Innova Zenix Hybrid, high-roof Toyota HiAce Premio Luxury, and Mercedes-Benz Sprinter, all accompanied by professional English-speaking chauffeurs.",
  },
];

export const defaultSiteContent: SiteContentStore = {
  general: {
    brandName: "TRIA UMA",
    brandTagline: "SIMPLE, QUALITY & SATISFACTION",
    heroEyebrow: "TAILOR-MADE LUXURY HOLIDAYS WITH TRIA UMA",
    heroTitle: "A world beyond imagination.",
    heroSubtitle: "Exceptional places, thoughtful experiences, and journeys shaped entirely around you.",
    heroImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2400&q=90",
    heroVideoUrl: "",
    heroMediaType: "image",
    philosophyEyebrow: "A DIFFERENT WAY TO TRAVEL",
    philosophyTitle: "Luxury is the freedom to travel your own way.",
    philosophyText: "The finest journeys begin with listening. We bring together remarkable stays, local knowledge, and thoughtful details to create travel that feels personal from the very first moment to the last.",
    ctaEyebrow: "YOUR NEXT JOURNEY",
    ctaTitle: "The world is waiting.",
    ctaButtonText: "LET'S TALK ABOUT YOUR JOURNEY ↗",
  },
  hotelsHero: {
    mediaType: "image",
    image: "",
    videoUrl: "",
  },
  experienceHero: {
    mediaType: "image",
    image: "",
    videoUrl: "",
  },
  hotels: [...defaultHotels],
  journal: [...defaultJournal],
  plans: [...defaultPlans],
  offers: [...defaultOffers],
  experiences: [...defaultExperiences],
  events: [...defaultEvents],
  faqs: [...defaultFaqs],
  about: {
    eyebrow: "ABOUT US",
    title: "Travel is personal.",
    subtitle: "We believe the finest journeys begin with understanding what matters to you.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2200&q=85",
    philosophyTitle: "Our philosophy",
    philosophyParagraphs: [
      "Every traveller has a different idea of what makes a journey unforgettable. Our approach begins with listening, understanding, and crafting experiences that match your pace and preferences.",
      "We work with an intimate collection of hotels, private villas, and local partners who share our commitment to warmth, discretion, and authenticity.",
      "From seamless airport greetings to rare insider accesses, every touchpoint is curated with care so that you can simply immerse yourself in the journey.",
    ],
  },
  contact: {
    email: "reservation@triauma.com",
    whatsapp: "+62 812 3456 7890",
    phone: "+62 361 987 654",
    address: "Jl. Danau Tamblingan No. 88, Sanur, Bali 80228, Indonesia",
    officeHours: "Monday – Sunday, 08:00 – 20:00 WITA",
  },
};

export const SITE_STORAGE_KEYS = {
  SITE_CONTENT: "tria_uma_website_content",
};

export { isAdminLoggedIn, signOutAdmin as logoutAdmin };

export async function loginAdmin(email: string, password: string): Promise<void> {
  await signInAdmin(email, password);
}

// ========================
// Site Content Functions
// ========================

export function getSiteContent(): SiteContentStore {
  if (typeof window === "undefined") {
    return defaultSiteContent;
  }
  try {
    const raw = localStorage.getItem(SITE_STORAGE_KEYS.SITE_CONTENT);
    if (!raw) {
      return defaultSiteContent;
    }
    return normalizeSiteContent(JSON.parse(raw));
  } catch (e) {
    console.error("Failed to load website content from localStorage:", e);
    return defaultSiteContent;
  }
}

function normalizeSiteContent(parsed: Partial<SiteContentStore>): SiteContentStore {
  return {
    general: { ...defaultSiteContent.general, ...(parsed.general || {}) },
    hotelsHero: { ...defaultSiteContent.hotelsHero, ...(parsed.hotelsHero || {}) },
    experienceHero: { ...defaultSiteContent.experienceHero, ...(parsed.experienceHero || {}) },
    hotels: parsed.hotels?.length ? parsed.hotels : defaultSiteContent.hotels,
    journal: parsed.journal?.length ? parsed.journal : defaultSiteContent.journal,
    plans: parsed.plans?.length ? parsed.plans : defaultSiteContent.plans,
    offers: parsed.offers?.length ? parsed.offers : defaultSiteContent.offers,
    experiences: parsed.experiences?.length ? parsed.experiences : defaultSiteContent.experiences,
    events: parsed.events?.length ? parsed.events : defaultSiteContent.events,
    faqs: parsed.faqs?.length ? parsed.faqs : defaultSiteContent.faqs,
    about: { ...defaultSiteContent.about, ...(parsed.about || {}) },
    contact: { ...defaultSiteContent.contact, ...(parsed.contact || {}) },
  };
}

export async function loadSiteContent(): Promise<SiteContentStore> {
  const payload = await fetchCmsPayload();
  if (!payload?.siteContent || typeof payload.siteContent !== "object") return getSiteContent();
  const content = normalizeSiteContent(payload.siteContent as Partial<SiteContentStore>);
  if (typeof window !== "undefined") {
    localStorage.setItem(SITE_STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
  }
  return content;
}

export async function saveSiteContent(content: SiteContentStore): Promise<void> {
  if (typeof window === "undefined") throw new Error("Website content can only be saved in a browser.");
  await saveCmsPayloadPatch({ siteContent: content });
  localStorage.setItem(SITE_STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
  window.dispatchEvent(new CustomEvent("tria_uma_site_content_updated", { detail: content }));
}

export async function resetSiteContentToDefault(): Promise<SiteContentStore> {
  await saveSiteContent(defaultSiteContent);
  return defaultSiteContent;
}

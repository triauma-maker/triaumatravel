import {
  type ItineraryHotel,
  type ItineraryActivity,
  type ItineraryVehicle,
  type ItineraryService,
  type DayTemplate,
  type CustomItineraryData,
  defaultHotels,
  defaultActivities,
  defaultVehicles,
  defaultServices,
  defaultDayTemplates,
} from "../data/itineraryElements";

export const STORAGE_KEYS = {
  ADMIN_ELEMENTS: "tria_uma_admin_itinerary_elements",
  USER_ITINERARIES: "tria_uma_user_itineraries",
  USER_PROFILE: "tria_uma_user_profile",
  CONTACT_SETTINGS: "tria_uma_contact_settings",
};

export interface ReservationContactSettings {
  whatsappNumber: string;
  reservationEmail: string;
  companyName: string;
}

export const defaultContactSettings: ReservationContactSettings = {
  whatsappNumber: "6281234567890",
  reservationEmail: "reservation@triauma.com",
  companyName: "Tria Uma Luxury Travel Collection",
};

export interface AdminElementsStore {
  hotels: ItineraryHotel[];
  activities: ItineraryActivity[];
  vehicles: ItineraryVehicle[];
  services: ItineraryService[];
  dayTemplates: DayTemplate[];
}

export function getDefaultAdminElements(): AdminElementsStore {
  return {
    hotels: [...defaultHotels],
    activities: [...defaultActivities],
    vehicles: [...defaultVehicles],
    services: [...defaultServices],
    dayTemplates: [...defaultDayTemplates],
  };
}

export function getAdminElements(): AdminElementsStore {
  if (typeof window === "undefined") {
    return getDefaultAdminElements();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_ELEMENTS);
    if (!raw) {
      const defaults = getDefaultAdminElements();
      localStorage.setItem(STORAGE_KEYS.ADMIN_ELEMENTS, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw);
    return {
      hotels: parsed.hotels?.length ? parsed.hotels : defaultHotels,
      activities: parsed.activities?.length ? parsed.activities : defaultActivities,
      vehicles: parsed.vehicles?.length ? parsed.vehicles : defaultVehicles,
      services: parsed.services?.length ? parsed.services : defaultServices,
      dayTemplates: parsed.dayTemplates?.length ? parsed.dayTemplates : defaultDayTemplates,
    };
  } catch (e) {
    console.error("Failed to parse admin elements from localStorage:", e);
    return getDefaultAdminElements();
  }
}

export function saveAdminElements(data: AdminElementsStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ADMIN_ELEMENTS, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("tria_uma_elements_updated", { detail: data }));
}

export function resetAdminElementsToDefault(): AdminElementsStore {
  const defaults = getDefaultAdminElements();
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.ADMIN_ELEMENTS, JSON.stringify(defaults));
    window.dispatchEvent(new CustomEvent("tria_uma_elements_updated", { detail: defaults }));
  }
  return defaults;
}

export function getContactSettings(): ReservationContactSettings {
  if (typeof window === "undefined") return defaultContactSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACT_SETTINGS);
    if (raw) return { ...defaultContactSettings, ...JSON.parse(raw) };
  } catch (e) {
    // fallback
  }
  return defaultContactSettings;
}

export function saveContactSettings(settings: ReservationContactSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CONTACT_SETTINGS, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("tria_uma_contact_updated", { detail: settings }));
}

// User Itineraries
export function getUserItineraries(): CustomItineraryData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_ITINERARIES);
    if (!raw) return [];
    return JSON.parse(raw) as CustomItineraryData[];
  } catch (e) {
    console.error("Failed to read user itineraries:", e);
    return [];
  }
}

export function getUserItineraryById(id: string): CustomItineraryData | undefined {
  const all = getUserItineraries();
  return all.find((item) => item.id === id);
}

export function saveUserItinerary(itinerary: CustomItineraryData): void {
  if (typeof window === "undefined") return;
  const all = getUserItineraries();
  const existingIdx = all.findIndex((item) => item.id === itinerary.id);

  itinerary.updatedAt = new Date().toISOString();

  if (existingIdx >= 0) {
    all[existingIdx] = itinerary;
  } else {
    all.unshift(itinerary);
  }

  localStorage.setItem(STORAGE_KEYS.USER_ITINERARIES, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("tria_uma_itinerary_saved", { detail: itinerary }));
}

export function deleteUserItinerary(id: string): void {
  if (typeof window === "undefined") return;
  const all = getUserItineraries();
  const filtered = all.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.USER_ITINERARIES, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent("tria_uma_itinerary_deleted", { detail: id }));
}

export function generateReservationReference(): string {
  const dateStr = new Date().toISOString().slice(2, 7).replace("-", "");
  const randomLetters = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TU-RES-${dateStr}-${randomLetters}`;
}

export interface UserProfileInfo {
  name: string;
  email: string;
  phone: string;
  country?: string;
  notes?: string;
}

export function getUserProfile(): UserProfileInfo {
  if (typeof window === "undefined") {
    return { name: "", email: "", phone: "" };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return { name: "", email: "", phone: "" };
}

export function saveUserProfile(profile: UserProfileInfo): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent("tria_uma_profile_updated", { detail: profile }));
}

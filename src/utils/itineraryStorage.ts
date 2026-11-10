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
import {
  fetchCmsPayload,
  saveCmsPayloadPatch,
} from "./cmsBackend";

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

export async function loadAdminElements(): Promise<AdminElementsStore> {
  const payload = await fetchCmsPayload();
  const parsed = payload?.itineraryElements as Partial<AdminElementsStore> | undefined;
  if (!parsed) return getAdminElements();
  const data = {
    hotels: parsed.hotels?.length ? parsed.hotels : defaultHotels,
    activities: parsed.activities?.length ? parsed.activities : defaultActivities,
    vehicles: parsed.vehicles?.length ? parsed.vehicles : defaultVehicles,
    services: parsed.services?.length ? parsed.services : defaultServices,
    dayTemplates: parsed.dayTemplates?.length ? parsed.dayTemplates : defaultDayTemplates,
  };
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEYS.ADMIN_ELEMENTS, JSON.stringify(data));
  return data;
}

export async function saveAdminElements(data: AdminElementsStore): Promise<void> {
  if (typeof window === "undefined") throw new Error("Itinerary elements can only be saved in a browser.");
  await saveCmsPayloadPatch({ itineraryElements: data });
  localStorage.setItem(STORAGE_KEYS.ADMIN_ELEMENTS, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("tria_uma_elements_updated", { detail: data }));
}

export async function resetAdminElementsToDefault(): Promise<AdminElementsStore> {
  const defaults = getDefaultAdminElements();
  await saveAdminElements(defaults);
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

export async function loadContactSettings(): Promise<ReservationContactSettings> {
  const payload = await fetchCmsPayload();
  const settings = payload?.contactSettings;
  if (!settings || typeof settings !== "object") return getContactSettings();
  const normalized = { ...defaultContactSettings, ...(settings as Partial<ReservationContactSettings>) };
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEYS.CONTACT_SETTINGS, JSON.stringify(normalized));
  return normalized;
}

export async function saveContactSettings(settings: ReservationContactSettings): Promise<void> {
  if (typeof window === "undefined") throw new Error("Contact settings can only be saved in a browser.");
  await saveCmsPayloadPatch({ contactSettings: settings });
  localStorage.setItem(STORAGE_KEYS.CONTACT_SETTINGS, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("tria_uma_contact_updated", { detail: settings }));
}

function readLocalValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(`Could not read saved browser data (${key}): ${error instanceof Error ? error.message : "invalid JSON"}`);
  }
}

function writeLocalValue<T>(key: string, value: T): void {
  if (typeof window === "undefined") throw new Error("Saved guest data is available only in a browser.");
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw new Error(`Could not save data in this browser: ${error instanceof Error ? error.message : "storage unavailable"}`);
  }
}

export async function getUserItineraries(): Promise<CustomItineraryData[]> {
  const itineraries = readLocalValue<CustomItineraryData[]>(STORAGE_KEYS.USER_ITINERARIES, []);
  if (!Array.isArray(itineraries)) throw new Error("Saved itineraries in this browser have an invalid format.");
  return itineraries.sort((a, b) => Date.parse(b.updatedAt || b.createdAt) - Date.parse(a.updatedAt || a.createdAt));
}

export async function getUserItineraryById(id: string): Promise<CustomItineraryData | undefined> {
  const itineraries = await getUserItineraries();
  return itineraries.find((item) => item.id === id);
}

export async function saveUserItinerary(itinerary: CustomItineraryData): Promise<void> {
  const updatedAt = new Date().toISOString();
  const saved = { ...itinerary, updatedAt };
  const itineraries = await getUserItineraries();
  const existingIndex = itineraries.findIndex((item) => item.id === saved.id);
  if (existingIndex < 0) itineraries.push(saved);
  else itineraries[existingIndex] = saved;
  writeLocalValue(STORAGE_KEYS.USER_ITINERARIES, itineraries);
  window.dispatchEvent(new CustomEvent("tria_uma_itinerary_saved", { detail: saved }));
}

export async function deleteUserItinerary(id: string): Promise<void> {
  const itineraries = await getUserItineraries();
  writeLocalValue(STORAGE_KEYS.USER_ITINERARIES, itineraries.filter((item) => item.id !== id));
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

export async function getUserProfile(): Promise<UserProfileInfo> {
  const profile = readLocalValue<UserProfileInfo>(STORAGE_KEYS.USER_PROFILE, { name: "", email: "", phone: "" });
  if (!profile || typeof profile !== "object") throw new Error("Saved profile in this browser has an invalid format.");
  return profile;
}

export async function saveUserProfile(profile: UserProfileInfo): Promise<void> {
  writeLocalValue(STORAGE_KEYS.USER_PROFILE, profile);
  window.dispatchEvent(new CustomEvent("tria_uma_profile_updated", { detail: profile }));
}

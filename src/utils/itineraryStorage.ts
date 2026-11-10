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
  getAuthenticatedUser,
  getSupabaseClient,
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

function requireCustomerId(userId?: string): Promise<string> {
  if (userId) return Promise.resolve(userId);
  return getAuthenticatedUser().then((user) => {
    if (!user) throw new Error("Please sign in to access your saved profile and itineraries.");
    return user.id;
  });
}

function readLegacyValue<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  return JSON.parse(raw) as T;
}

export async function migrateLegacyUserData(userId: string): Promise<void> {
  if (typeof window === "undefined") return;
  const profile = readLegacyValue<UserProfileInfo | null>(STORAGE_KEYS.USER_PROFILE, null);
  const itineraries = readLegacyValue<CustomItineraryData[]>(STORAGE_KEYS.USER_ITINERARIES, []);
  const client = getSupabaseClient();

  if (profile) {
    const { data: currentProfile, error } = await client
      .from("triauma_customer_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(`Could not check existing customer profile: ${error.message}`);
    if (!currentProfile) {
      const { error: saveError } = await client
        .from("triauma_customer_profiles")
        .insert({ user_id: userId, data: profile });
      if (saveError) throw new Error(`Could not migrate your saved profile: ${saveError.message}`);
    }
  }

  if (itineraries.length) {
    const { error } = await client
      .from("triauma_customer_itineraries")
      .upsert(
        itineraries.map((itinerary) => ({
          user_id: userId,
          id: itinerary.id,
          data: itinerary,
          created_at: itinerary.createdAt,
          updated_at: itinerary.updatedAt || itinerary.createdAt,
        })),
        { onConflict: "user_id,id", ignoreDuplicates: true },
      );
    if (error) throw new Error(`Could not migrate your saved itineraries: ${error.message}`);
  }

  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.USER_ITINERARIES);
}

export async function getUserItineraries(userId?: string): Promise<CustomItineraryData[]> {
  const customerId = await requireCustomerId(userId);
  const { data, error } = await getSupabaseClient()
    .from("triauma_customer_itineraries")
    .select("data")
    .eq("user_id", customerId)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Could not load your saved itineraries: ${error.message}`);
  return (data || []).map((row) => row.data as CustomItineraryData);
}

export async function getUserItineraryById(id: string, userId?: string): Promise<CustomItineraryData | undefined> {
  const itineraries = await getUserItineraries(userId);
  return itineraries.find((item) => item.id === id);
}

export async function saveUserItinerary(itinerary: CustomItineraryData): Promise<void> {
  const userId = await requireCustomerId();
  const updatedAt = new Date().toISOString();
  const saved = { ...itinerary, updatedAt };
  const { error } = await getSupabaseClient()
    .from("triauma_customer_itineraries")
    .upsert(
      { user_id: userId, id: saved.id, data: saved, created_at: saved.createdAt, updated_at: updatedAt },
      { onConflict: "user_id,id" },
    );
  if (error) throw new Error(`Could not save your itinerary: ${error.message}`);
  window.dispatchEvent(new CustomEvent("tria_uma_itinerary_saved", { detail: saved }));
}

export async function deleteUserItinerary(id: string): Promise<void> {
  const userId = await requireCustomerId();
  const { error } = await getSupabaseClient()
    .from("triauma_customer_itineraries")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw new Error(`Could not delete your itinerary: ${error.message}`);
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

export async function getUserProfile(userId?: string): Promise<UserProfileInfo> {
  const customerId = await requireCustomerId(userId);
  const { data, error } = await getSupabaseClient()
    .from("triauma_customer_profiles")
    .select("data")
    .eq("user_id", customerId)
    .maybeSingle();
  if (error) throw new Error(`Could not load your profile: ${error.message}`);
  return data?.data as UserProfileInfo || { name: "", email: "", phone: "" };
}

export async function saveUserProfile(profile: UserProfileInfo): Promise<void> {
  const userId = await requireCustomerId();
  const { error } = await getSupabaseClient()
    .from("triauma_customer_profiles")
    .upsert(
      { user_id: userId, data: profile, updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
  if (error) throw new Error(`Could not save your profile: ${error.message}`);
  window.dispatchEvent(new CustomEvent("tria_uma_profile_updated", { detail: profile }));
}

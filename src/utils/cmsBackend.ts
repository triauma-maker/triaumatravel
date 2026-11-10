import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

export interface CmsPayload {
  siteContent?: unknown;
  itineraryElements?: unknown;
  contactSettings?: unknown;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabaseClient(): SupabaseClient {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error("Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  if (!publishableKey.startsWith("sb_publishable_")) {
    throw new Error("PUBLIC_SUPABASE_PUBLISHABLE_KEY must contain a Supabase publishable key (sb_publishable_...). Do not use a secret key here.");
  }
  supabaseClient ??= createClient(url, publishableKey);
  return supabaseClient;
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseClient().auth.getUser();
  if (error) throw new Error(`Could not verify account session: ${error.message}`);
  const user = data.user;
  return user?.email ? { id: user.id, email: user.email } : null;
}

export async function signUpCustomer(email: string, password: string): Promise<boolean> {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email: email.trim(),
    password,
    options: { emailRedirectTo: `${window.location.origin}/profile/` },
  });
  if (error) throw new Error(error.message);
  return Boolean(data.session);
}

export async function signInCustomer(email: string, password: string): Promise<AuthenticatedUser> {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw new Error(error.message);
  if (!data.user?.email) throw new Error("Supabase did not return an authenticated account.");
  return { id: data.user.id, email: data.user.email };
}

export async function signOutCustomer(): Promise<void> {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw new Error(`Could not sign out: ${error.message}`);
}

export async function fetchCmsPayload(): Promise<CmsPayload | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await getSupabaseClient()
    .from("triauma_cms_data")
    .select("data")
    .eq("id", "global")
    .maybeSingle();

  if (error) throw new Error(`Could not load CMS data from Supabase: ${error.message}`);
  return data?.data && typeof data.data === "object" ? (data.data as CmsPayload) : null;
}

export async function saveCmsPayloadPatch(patch: CmsPayload): Promise<void> {
  const client = getSupabaseClient();
  const current = await fetchCmsPayload();
  const payload = { ...current, ...patch };
  const { error } = await client
    .from("triauma_cms_data")
    .upsert(
      { id: "global", data: payload, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );

  if (error) throw new Error(`Could not save CMS data to Supabase: ${error.message}`);
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  const client = getSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Supabase did not return an authenticated user.");

  const { data: admin, error: adminError } = await client
    .from("triauma_cms_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminError || !admin) {
    const { error: signOutError } = await client.auth.signOut();
    if (signOutError) throw new Error(`Admin access was denied, and sign-out failed: ${signOutError.message}`);
    if (adminError) throw new Error(`Could not verify CMS admin access: ${adminError.message}`);
    const projectRef = new URL(import.meta.env.PUBLIC_SUPABASE_URL).hostname.split(".")[0];
    throw new Error(
      `Supabase sign-in succeeded, but this account is not in public.triauma_cms_admins for project ${projectRef}. Add the account's UUID from Authentication → Users to that table, then sign in again.`,
    );
  }

  localStorage.removeItem("tria_uma_admin_auth_session");
  localStorage.removeItem("tria_uma_admin_credentials");
  window.dispatchEvent(new CustomEvent("tria_uma_auth_changed", { detail: { authenticated: true } }));
}

export async function isAdminLoggedIn(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const client = getSupabaseClient();
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError) throw new Error(`Could not verify admin session: ${sessionError.message}`);
  const user = sessionData.session?.user;
  if (!user) return false;

  const { data, error } = await client
    .from("triauma_cms_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(`Could not verify CMS admin access: ${error.message}`);
  return Boolean(data);
}

export async function signOutAdmin(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw new Error(`Could not sign out: ${error.message}`);
  window.dispatchEvent(new CustomEvent("tria_uma_auth_changed", { detail: { authenticated: false } }));
}

export async function updateAdminPassword(password: string): Promise<void> {
  const { error } = await getSupabaseClient().auth.updateUser({ password });
  if (error) throw new Error(`Could not update password: ${error.message}`);
}

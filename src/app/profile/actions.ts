"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const ROLES = new Set(["practitioner", "donor", "philanthropy", "expert", "other"]);

export async function updateProfile(formData: FormData) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const role = String(formData.get("role") ?? "other");
  const updates = {
    full_name: String(formData.get("full_name") ?? "").trim() || null,
    role: ROLES.has(role) ? role : "other",
    organization: String(formData.get("organization") ?? "").trim() || null,
    country: String(formData.get("country") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    website: String(formData.get("website") ?? "").trim() || null,
    onboarded: true,
    updated_at: new Date().toISOString(),
  };

  await supabase.from("profiles").update(updates).eq("id", user.id);
  revalidatePath("/profile");
  revalidatePath("/members");
  redirect("/community");
}

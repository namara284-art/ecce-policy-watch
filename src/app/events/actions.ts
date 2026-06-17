"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function createEvent(formData: FormData) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const title = String(formData.get("title") ?? "").trim();
  const startsAtRaw = String(formData.get("starts_at") ?? "").trim();
  if (!title || !startsAtRaw) return;

  const startsAt = new Date(startsAtRaw);
  if (Number.isNaN(startsAt.getTime())) return;

  await supabase.from("events").insert({
    host_id: user.id,
    title,
    description: String(formData.get("description") ?? "").trim(),
    starts_at: startsAt.toISOString(),
    location: String(formData.get("location") ?? "").trim() || null,
    url: String(formData.get("url") ?? "").trim() || null,
  });

  revalidatePath("/events");
  redirect("/events");
}

export async function rsvpEvent(formData: FormData) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const eventId = String(formData.get("event_id") ?? "");
  if (!eventId) return;

  await supabase
    .from("event_rsvps")
    .upsert({ event_id: eventId, profile_id: user.id }, { onConflict: "event_id,profile_id" });

  revalidatePath("/events");
}

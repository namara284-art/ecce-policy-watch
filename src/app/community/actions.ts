"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const KINDS = new Set(["update", "activity", "invitation"]);

export async function createPost(formData: FormData) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) return;

  const kind = String(formData.get("kind") ?? "update");
  const reportId = String(formData.get("report_id") ?? "").trim() || null;

  await supabase.from("posts").insert({
    author_id: user.id,
    kind: KINDS.has(kind) ? kind : "update",
    title,
    body,
    report_id: reportId,
  });

  revalidatePath("/community");
  redirect("/community");
}

/** Members flag a post for moderator review. */
export async function flagPost(formData: FormData) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const contentId = String(formData.get("post_id") ?? "");
  if (!contentId) return;

  await supabase.from("content_flags").insert({
    content_type: "post",
    content_id: contentId,
    reporter_id: user.id,
    reason: String(formData.get("reason") ?? "").trim() || null,
  });

  revalidatePath("/community");
}

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

/** Exchanges the magic-link code for a session, then routes the user onward. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const supabase = createSupabaseServerClient();

  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Send new users to onboarding; returning members to the community.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let dest = "/community";
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarded")
          .eq("id", user.id)
          .maybeSingle();
        if (!profile?.onboarded) dest = "/profile";
      }
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}

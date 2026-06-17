import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { listPosts } from "@/lib/community";
import { listReports } from "@/lib/reports";
import { isSupabaseConfigured } from "@/lib/supabase";
import { POST_KIND_LABELS, ROLE_LABELS, type Post } from "@/lib/types";
import { createPost, flagPost } from "./actions";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const [profile, { posts, demo }, recentReports] = await Promise.all([
    getCurrentProfile(),
    listPosts(),
    listReports({ limit: 20 }),
  ]);
  const signedIn = Boolean(profile);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community</h1>
          <p className="mt-1 text-slate-600">
            Share updates, activities and invitations with the global ECCE community.
          </p>
        </div>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/members" className="text-brand-600 hover:text-brand-700">
            Members →
          </Link>
          <Link href="/events" className="text-brand-600 hover:text-brand-700">
            Events →
          </Link>
        </nav>
      </div>

      {demo && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          You&apos;re viewing demo community content. {" "}
          {isSupabaseConfigured() ? (
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>
          ) : (
            "Configure Supabase to enable real accounts and posts."
          )}
        </div>
      )}

      {signedIn ? (
        <PostComposer reports={recentReports} />
      ) : (
        !demo && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <Link href="/login" className="font-semibold text-brand-600 underline">
              Sign in
            </Link>{" "}
            to post to the community.
          </div>
        )
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} canFlag={signedIn} />
        ))}
      </div>
    </div>
  );
}

function PostComposer({ reports }: { reports: { id: string; headline: string }[] }) {
  return (
    <form action={createPost} className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Share with the community</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-[160px_1fr]">
        <select
          name="kind"
          defaultValue="update"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          {Object.entries(POST_KIND_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          name="title"
          required
          placeholder="Title"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>
      <textarea
        name="body"
        required
        rows={3}
        placeholder="What would you like to share?"
        className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <select
          name="report_id"
          defaultValue=""
          className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 focus:border-brand-500 focus:outline-none"
        >
          <option value="">Link a report (optional)</option>
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              {r.headline.slice(0, 60)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Post
        </button>
      </div>
    </form>
  );
}

function PostCard({ post, canFlag }: { post: Post; canFlag: boolean }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{post.authorName}</span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
            {ROLE_LABELS[post.authorRole]}
          </span>
          {post.authorOrg && <span className="text-xs text-slate-400">· {post.authorOrg}</span>}
        </div>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
          {POST_KIND_LABELS[post.kind]}
        </span>
      </div>
      <h3 className="mt-2 font-semibold text-slate-900">{post.title}</h3>
      <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{post.body}</p>
      <div className="mt-3 flex items-center gap-4 text-xs">
        {post.reportId && (
          <Link href={`/reports/${post.reportId}`} className="font-medium text-brand-600 hover:text-brand-700">
            View linked report →
          </Link>
        )}
        {canFlag && (
          <form action={flagPost}>
            <input type="hidden" name="post_id" value={post.id} />
            <button type="submit" className="text-slate-400 hover:text-red-600">
              Report
            </button>
          </form>
        )}
      </div>
    </article>
  );
}

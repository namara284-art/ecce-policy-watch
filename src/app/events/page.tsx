import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { listEvents } from "@/lib/community";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { EventItem } from "@/lib/types";
import { createEvent, rsvpEvent } from "./actions";

export const dynamic = "force-dynamic";

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }) + " UTC";
}

export default async function EventsPage() {
  const [profile, { events, demo }] = await Promise.all([getCurrentProfile(), listEvents()]);
  const signedIn = Boolean(profile);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events</h1>
          <p className="mt-1 text-slate-600">
            ECCE conferences, webinars, funding calls and convenings from across the community.
          </p>
        </div>
        <Link href="/community" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          ← Community
        </Link>
      </div>

      {demo && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Demo events shown.{" "}
          {isSupabaseConfigured() ? (
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>
          ) : (
            "Configure Supabase to post real events."
          )}
        </div>
      )}

      {signedIn && <EventComposer />}

      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No upcoming events yet.
          </p>
        ) : (
          events.map((event) => (
            <EventCard key={event.id} event={event} canRsvp={signedIn} />
          ))
        )}
      </div>
    </div>
  );
}

function EventComposer() {
  return (
    <form action={createEvent} className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">Add an event</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          name="title"
          required
          placeholder="Event title"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none sm:col-span-2"
        />
        <input
          name="starts_at"
          type="datetime-local"
          required
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <input
          name="location"
          placeholder="Location (or 'Online')"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <input
          name="url"
          type="url"
          placeholder="Registration / info URL"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none sm:col-span-2"
        />
        <textarea
          name="description"
          rows={2}
          placeholder="Short description"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none sm:col-span-2"
        />
      </div>
      <button
        type="submit"
        className="mt-3 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Add event
      </button>
    </form>
  );
}

function EventCard({ event, canRsvp }: { event: EventItem; canRsvp: boolean }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{event.title}</h3>
          <p className="mt-0.5 text-sm text-brand-700">{formatWhen(event.startsAt)}</p>
          <p className="text-xs text-slate-400">
            {[event.location, `Hosted by ${event.hostName}`].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">{event.rsvpCount} attending</p>
          {canRsvp && (
            <form action={rsvpEvent} className="mt-1">
              <input type="hidden" name="event_id" value={event.id} />
              <button
                type="submit"
                className="rounded-md border border-brand-600 px-3 py-1 text-sm font-medium text-brand-600 hover:bg-brand-50"
              >
                RSVP
              </button>
            </form>
          )}
        </div>
      </div>
      {event.description && <p className="mt-2 text-sm text-slate-600">{event.description}</p>}
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Event details →
        </a>
      )}
    </article>
  );
}

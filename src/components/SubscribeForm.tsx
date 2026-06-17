"use client";

import { useMemo, useState } from "react";
import { regionsByContinent } from "@/lib/regions";

type Status = "idle" | "loading" | "success" | "error";

export function SubscribeForm() {
  const groups = useMemo(() => regionsByContinent(), []);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>(["global"]);
  const [cadence, setCadence] = useState("daily");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, regions: g.regions.filter((r) => r.name.toLowerCase().includes(q)) }))
      .filter((g) => g.regions.length > 0);
  }, [groups, query]);

  function toggleRegion(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, regions: selected, cadence }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setMessage(data.message || "Check your inbox to confirm your subscription.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-5 text-sm text-green-800">
        <p className="font-semibold">You&apos;re almost in.</p>
        <p className="mt-1">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@organisation.org"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="block text-sm font-medium text-slate-700">Countries of interest</span>
          <span className="text-xs text-slate-400">{selected.length} selected</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search countries…"
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <div className="mt-2 max-h-56 space-y-3 overflow-y-auto rounded-md border border-slate-200 p-3">
          {filteredGroups.length === 0 ? (
            <p className="text-sm text-slate-400">No countries match &ldquo;{query}&rdquo;.</p>
          ) : (
            filteredGroups.map((g) => (
              <div key={g.continent}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {g.continent}
                </p>
                <div className="flex flex-wrap gap-2">
                  {g.regions.map((r) => {
                    const on = selected.includes(r.slug);
                    return (
                      <button
                        type="button"
                        key={r.slug}
                        onClick={() => toggleRegion(r.slug)}
                        className={`rounded-full border px-3 py-1 text-sm ${
                          on
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-slate-300 bg-white text-slate-600 hover:border-brand-500"
                        }`}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cadence" className="block text-sm font-medium text-slate-700">
          Frequency
        </label>
        <select
          id="cadence"
          value={cadence}
          onChange={(e) => setCadence(e.target.value)}
          className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly digest</option>
          <option value="monthly">Monthly only</option>
        </select>
      </div>

      {status === "error" && <p className="text-sm text-red-600">{message}</p>}

      <button
        type="submit"
        disabled={status === "loading" || selected.length === 0}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe to Policy Watch"}
      </button>
      <p className="text-xs text-slate-400">
        Double opt-in. We&apos;ll email you to confirm. Unsubscribe any time.
      </p>
    </form>
  );
}

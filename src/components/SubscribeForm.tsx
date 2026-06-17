"use client";

import { useState } from "react";
import { activeRegions } from "@/lib/regions";

type Status = "idle" | "loading" | "success" | "error";

export function SubscribeForm() {
  const regions = activeRegions();
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>(["global"]);
  const [cadence, setCadence] = useState("daily");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

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
        <span className="block text-sm font-medium text-slate-700">Regions of interest</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {regions.map((r) => {
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

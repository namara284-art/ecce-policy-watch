export default function CommunityPage() {
  const features = [
    {
      title: "Member profiles",
      detail:
        "Practitioners, donors, philanthropies and experts create profiles with roles, so members know who they're connecting with.",
    },
    {
      title: "Share reports & activities",
      detail:
        "Post your own field reports, programme updates and findings — and invite others to participate.",
    },
    {
      title: "Events space",
      detail:
        "A shared calendar for ECCE conferences, webinars, funding calls and convenings, with RSVPs.",
    },
    {
      title: "Discussions",
      detail:
        "Topic threads where the global ECCE community can debate policy, swap practice and coordinate.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
          Coming in Phase 4
        </span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">The ECCE community space</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A home for everyone advancing Early Childhood Care &amp; Education — to connect, share what
          they&apos;re working on, invite collaborators, and discover events. Here&apos;s what
          we&apos;re building.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">{f.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{f.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-brand-100 bg-brand-50 p-5 text-sm text-brand-900">
        Want early access? Subscribe on the home page and we&apos;ll invite you when the community
        opens.
      </div>
    </div>
  );
}

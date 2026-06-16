import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_public/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements — Nale-paar Masjid" },
      {
        name: "description",
        content: "Latest news and announcements from the masjid administration.",
      },
    ],
  }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const { data } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-gold">News</div>
      <h1 className="mt-2 font-display text-5xl">Announcements</h1>
      <div className="mt-10 space-y-5">
        {(data ?? []).map((a) => (
          <article key={a.id} className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {new Date(a.created_at).toLocaleDateString()}
            </div>
            <h2 className="mt-2 font-display text-3xl">{a.title}</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {a.description}
            </p>
          </article>
        ))}
        {data?.length === 0 && (
          <p className="text-muted-foreground">No announcements at this time.</p>
        )}
      </div>
    </div>
  );
}

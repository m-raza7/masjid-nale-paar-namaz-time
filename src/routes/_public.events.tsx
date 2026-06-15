import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatTime12, todayISO } from "@/lib/prayer";

export const Route = createFileRoute("/_public/events")({
  head: () => ({
    meta: [
      { title: "Events — Al-Noor Masjid" },
      { name: "description", content: "Upcoming community events at the masjid: halaqas, iftars, lectures and more." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { data } = useQuery({
    queryKey: ["events", "all"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").gte("event_date", todayISO()).order("event_date");
      return data ?? [];
    },
  });
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="text-xs uppercase tracking-[0.2em] text-gold">Community</div>
      <h1 className="mt-2 font-display text-5xl">Events</h1>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {(data ?? []).map((e) => (
          <article key={e.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between bg-gradient-hero px-6 py-5 text-primary-foreground">
              <div className="font-display text-2xl">{e.title}</div>
              <div className="rounded-lg bg-gradient-gold px-3 py-2 text-center text-gold-foreground">
                <div className="text-[10px] uppercase tracking-wider">{new Date(e.event_date).toLocaleString(undefined,{month:"short"})}</div>
                <div className="font-display text-2xl leading-none">{new Date(e.event_date).getDate()}</div>
              </div>
            </div>
            <div className="p-6">
              {e.description && <p className="text-sm text-muted-foreground">{e.description}</p>}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4 text-gold" /> {new Date(e.event_date).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})}</div>
                {e.start_time && <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-gold" /> {formatTime12(e.start_time)}{e.end_time && ` – ${formatTime12(e.end_time)}`}</div>}
                {e.location && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-gold" /> {e.location}</div>}
              </div>
            </div>
          </article>
        ))}
        {data?.length === 0 && <p className="text-muted-foreground">No upcoming events.</p>}
      </div>
    </div>
  );
}

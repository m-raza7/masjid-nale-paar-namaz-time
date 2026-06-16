import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  currentAndNextPrayer,
  formatCountdown,
  formatTime12,
  hijriDate,
  todayISO,
  toSlots,
  type PrayerRow,
} from "@/lib/prayer";
import { Button } from "@/components/ui/button";
import { SCHEDULE_DATE } from "@/lib/prayer";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Al-Noor Masjid — Azan & Prayer Timetable" },
      {
        name: "description",
        content:
          "Daily Azan, Jamaat times, monthly prayer timetable, Jumuah and community events at Al-Noor Masjid.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const today = todayISO();
  const { data: prayer } = useQuery({
    queryKey: ["prayer-schedule"],
    queryFn: async () => {
      const { data } = await supabase
        // .from("prayer_times")
        // .select("*")
        // .order("updated_at", { ascending: false })
        // .limit(1)
        // .maybeSingle();
        .from("prayer_times")
        .select("*")
        .eq("date", SCHEDULE_DATE)
        .maybeSingle();
      return data as PrayerRow | null;
    },
  });
  const { data: announcements } = useQuery({
    queryKey: ["announcements", "active"],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });
  const { data: events } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", today)
        .order("event_date")
        .limit(3);
      return data ?? [];
    },
  });

  const [now, setNow] = useState(new Date());
  const [hijri, setHijri] = useState("");
  useEffect(() => {
    setHijri(hijriDate(new Date()));
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { current, next, msToNext } = currentAndNextPrayer(prayer ?? null, now);
  const slots = prayer ? toSlots(prayer) : [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="arabesque absolute inset-0 opacity-20" />
        <div className="container relative mx-auto grid gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-3 w-3" /> {hijri}
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
              Stand for prayer
              <br />
              <span className="text-gold">at its appointed time.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-primary-foreground/75">
              Daily Azan and Jamaat times, monthly schedule and community announcements — kept
              current by the masjid administration.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-gold text-gold-foreground shadow-gold hover:opacity-95"
              >
                <Link to="/prayer-times">
                  View prayer times <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold/40 bg-transparent text-primary-foreground hover:bg-gold/10"
              >
                <Link to="/announcements">Announcements</Link>
              </Button>
            </div>
          </div>

          {/* Next-prayer card */}
          <div className="relative">
            <div className="rounded-3xl border border-gold/20 bg-card/95 p-8 text-card-foreground shadow-elegant backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Next Prayer
                </div>
                <div className="text-xs font-bold tracking-wide text-muted-foreground">
                  {now.toLocaleString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div className="font-display text-6xl text-primary">{next?.name ?? "—"}</div>
                <div className="font-display text-3xl text-gold">
                  {formatTime12(next?.jamaat ?? null)}
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-muted/60 p-6 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Current Time
                </div>
                <div className="mt-2 font-display text-5xl tabular-nums text-primary">
                  {now.toLocaleTimeString(undefined, {
                    hour12: true,
                  })}
                </div>
                <div className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Time remaining
                </div>
                <div className="mt-1 font-display text-3xl tabular-nums text-gold">
                  {formatCountdown(msToNext)}
                </div>
              </div>
              {current && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Last prayer</span>
                  <span className="font-medium">
                    {current.name} · {formatTime12(current.jamaat)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Today's timetable */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Schedule</div>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Prayer times</h2>
          </div>
          <Link
            to="/prayer-times"
            className="hidden text-sm font-medium text-primary hover:underline md:inline"
          >
            Full schedule →
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {slots.map((s) => (
            <div
              key={s.name}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="flex items-center justify-between">
                <div className="font-display text-xl">{s.name}</div>
                <Clock className="h-4 w-4 text-gold" />
              </div>
              <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                Azan
              </div>
              <div className="text-base text-muted-foreground">{formatTime12(s.azan)}</div>
              {s.jamaat && (
                <>
                  <div className="mt-2 text-xs uppercase tracking-wider text-gold">Jamaat</div>
                  <div className="font-display text-3xl text-primary">{formatTime12(s.jamaat)}</div>
                </>
              )}
            </div>
          ))}
          {slots.length === 0 && (
            <p className="text-muted-foreground">
              No timetable set for today. Please check back soon.
            </p>
          )}
        </div>
      </section>

      {/* Announcements + Events */}
      <section className="border-y border-border/60 bg-muted/30 py-20">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Announcements</div>
            <h2 className="mt-2 font-display text-4xl">From the masjid</h2>
            <div className="mt-8 space-y-4">
              {(announcements ?? []).map((a) => (
                <div key={a.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="font-display text-2xl">{a.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
                </div>
              ))}
              {announcements?.length === 0 && (
                <p className="text-muted-foreground">No announcements at this time.</p>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Events</div>
            <h2 className="mt-2 font-display text-4xl">Upcoming gatherings</h2>
            <div className="mt-8 space-y-4">
              {(events ?? []).map((e) => (
                <div key={e.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-display text-2xl">{e.title}</div>
                      {e.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
                      )}
                    </div>
                    <div className="shrink-0 rounded-lg bg-gradient-gold px-3 py-2 text-center text-gold-foreground">
                      <div className="text-[10px] uppercase tracking-wider">
                        {new Date(e.event_date).toLocaleString(undefined, { month: "short" })}
                      </div>
                      <div className="font-display text-2xl leading-none">
                        {new Date(e.event_date).getDate()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {e.start_time && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatTime12(e.start_time)}
                        {e.end_time && ` – ${formatTime12(e.end_time)}`}
                      </span>
                    )}
                    {e.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {e.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{" "}
                      {new Date(e.event_date).toLocaleDateString(undefined, { weekday: "long" })}
                    </span>
                  </div>
                </div>
              ))}
              {events?.length === 0 && <p className="text-muted-foreground">No upcoming events.</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

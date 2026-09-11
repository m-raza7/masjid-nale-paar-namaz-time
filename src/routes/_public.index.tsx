import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
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

const rakaatData = [
  {
    name: "Fajr",
    subtitle: "Dawn",
    icon: Sunrise,
    color: "text-sky-700",
    bg: "bg-sky-50",
    before: 2,
    beforeLabel: "Sunnat Mu'akkadah",
    Farz: 2,
    after: "-",
    afterLabel: "",
    nafl: "-",
    witr: "-",
    naflAfter: "-",
    total: 4,
  },
  {
    name: "Dhuhr",
    subtitle: "Noon",
    icon: Sun,
    color: "text-green-700",
    bg: "bg-green-50",
    before: 4,
    beforeLabel: "Sunnat Mu'akkadah",
    Farz: 4,
    after: 2,
    afterLabel: "Sunnat Mu'akkadah",
    nafl: 2,
    witr: "-",
    naflAfter: "-",
    total: 12,
  },
  {
    name: "Asr",
    subtitle: "Afternoon",
    icon: Sun,
    color: "text-orange-600",
    bg: "bg-orange-50",
    before: 4,
    beforeLabel: "",
    Farz: 4,
    after: "-",
    afterLabel: "",
    nafl: "-",
    witr: "-",
    naflAfter: "-",
    total: 8,
  },
  {
    name: "Maghrib",
    subtitle: "After Sunset",
    icon: Sunset,
    color: "text-pink-700",
    bg: "bg-pink-50",
    before: "-",
    beforeLabel: "",
    Farz: 3,
    after: 2,
    afterLabel: "Sunnat Mu'akkadah",
    nafl: 2,
    witr: "-",
    naflAfter: "-",
    total: 7,
  },
  {
    name: "Isha",
    subtitle: "Night",
    icon: Moon,
    color: "text-purple-700",
    bg: "bg-purple-50",
    before: 4,
    beforeLabel: "",
    Farz: 4,
    after: 2,
    afterLabel: "Sunnat Mu'akkadah",
    nafl: 2,
    witr: 3,
    naflAfter: 2,
    total: 17,
  },
  {
    name: "Juma",
    subtitle: "Friday",
    icon: Calendar,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    before: 4,
    beforeLabel: "Sunnat Mu'akkadah",
    Farz: 2,
    after: 4,
    afterLabel: "Sunnat Mu'akkadah",
    nafl: 2,
    naflLabel: "Sunnat",
    witr: "-",
    naflAfter: 2,
    total: 14,
  },
];
export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "Masjid Nale-paar — Azan & Prayer Timetable" },
      {
        name: "description",
        content:
          "Daily Azan, Jamaat times, monthly prayer timetable, Jumuah and community events at Masjid Nale-paar.",
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

  function getHijriDate() {
    const today = new Date();

    return new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);
  }

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);

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
              <Sparkles className="h-3 w-3" /> {getHijriDate()}
            </div>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
              Stand for prayer
              <br />
              <span className="text-gold">at its appointed time.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-primary-foreground/75">
              Daily Azan and Jamaat times and community announcements — kept current by the masjid
              administration.
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
                <div className="font-display text-4xl text-gold">
                  {formatTime12(next?.jamaat ?? null)}
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-muted/60 p-6 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Current Time
                </div>
                <div className="mt-2 font-display text-4xl tabular-nums text-primary">
                  {now.toLocaleTimeString(undefined, {
                    hour12: true,
                  })}
                </div>
                <div className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Time remaining
                </div>
                <div className="mt-1 font-display text-5xl tabular-nums text-gold">
                  {formatCountdown(msToNext)}
                </div>
              </div>
              {current && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Now</span>
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
        {/* <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"> */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {slots.map((s: ReturnType<typeof toSlots>[number]) => (
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

      {/* ================= RAKA'AT SECTION ================= */}
      <section className="container mx-auto px-4 pb-20">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-4 w-4" />
              Daily Salah
            </div>

            <h2 className="mt-2 font-display text-4xl text-primary md:text-5xl">5 Daily Prayers</h2>

            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Raka'at (Units) in Each Prayer
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gold/20 bg-card px-5 py-4 shadow-sm">
            <Clock className="h-6 w-6 text-gold" />

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Daily Reminder
              </p>

              <p className="font-medium text-primary">Salah is the key to Jannah</p>
            </div>
          </div>
        </div>

        {/* Raka'at Table */}
        <div className="overflow-hidden rounded-3xl border border-gold/20 bg-card shadow-elegant">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">
              {/* ================= TABLE HEADER ================= */}
              <thead>
                <tr className="text-primary-foreground">
                  {/* Prayer */}
                  <th className="w-[20%] bg-primary px-6 py-5 text-left">
                    <div className="text-sm font-bold uppercase tracking-wide">Prayer</div>
                  </th>

                  {/* Sunnat Before */}
                  <th className="w-[12%] bg-emerald-700 px-4 py-5 text-center">
                    <div className="text-sm font-bold uppercase">Sunnat</div>

                    <div className="text-[10px] uppercase tracking-wider opacity-80">Before</div>
                  </th>

                  {/* Farz */}
                  <th className="w-[14%] bg-blue-600 px-4 py-5 text-center">
                    <div className="text-sm font-bold uppercase">Farz</div>

                    <div className="text-[10px] uppercase tracking-wider opacity-80">
                      Obligatory
                    </div>
                  </th>

                  {/* Sunnat After */}
                  <th className="w-[12%] bg-orange-600 px-4 py-5 text-center">
                    <div className="text-sm font-bold uppercase">Sunnat</div>

                    <div className="text-[10px] uppercase tracking-wider opacity-80">After</div>
                  </th>

                  {/* Nafl */}
                  <th className="w-[11%] bg-purple-700 px-4 py-5 text-center">
                    <div className="text-sm font-bold uppercase">Nafl</div>

                    <div className="text-[10px] uppercase tracking-wider opacity-80">
                      Recommended
                    </div>
                  </th>

                  {/* Witr */}
                  <th className="w-[10%] bg-amber-700 px-4 py-5 text-center">
                    <div className="text-sm font-bold uppercase">Witr</div>

                    <div className="text-[10px] uppercase tracking-wider opacity-80">Wajib</div>
                  </th>

                  {/* Nafl After */}
                  <th className="w-[11%] bg-purple-700 px-4 py-5 text-center">
                    <div className="text-sm font-bold uppercase">Nafl</div>

                    <div className="text-[10px] uppercase tracking-wider opacity-80">
                      Recommended
                    </div>
                  </th>

                  {/* Total */}
                  <th className="w-[10%] bg-emerald-800 px-4 py-5 text-center">
                    <div className="text-sm font-bold uppercase">Total</div>

                    <div className="text-[10px] uppercase tracking-wider opacity-80">Raka'at</div>
                  </th>
                </tr>
              </thead>

              {/* ================= DYNAMIC TABLE BODY ================= */}
              <tbody>
                {rakaatData.map((prayer) => {
                  const Icon = prayer.icon;

                  return (
                    <tr
                      key={prayer.name}
                      className="border-b border-border/60 transition-colors hover:bg-muted/30 last:border-b-0"
                    >
                      {/* ================= PRAYER ================= */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${prayer.bg}`}
                          >
                            <Icon className={`h-6 w-6 ${prayer.color}`} />
                          </div>

                          <div>
                            <div className={`font-display text-xl ${prayer.color}`}>
                              {prayer.name}
                            </div>

                            <div className="text-xs text-muted-foreground">{prayer.subtitle}</div>
                          </div>
                        </div>
                      </td>

                      {/* ================= SUNNAT BEFORE ================= */}
                      <td className="px-4 py-5 text-center">
                        <div
                          className={`text-2xl font-bold ${
                            prayer.before === "-" ? "text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {prayer.before}
                        </div>

                        {prayer.before !== "-" && prayer.beforeLabel && (
                          <div className="mt-1 text-[10px] text-muted-foreground">
                            {prayer.beforeLabel}
                          </div>
                        )}
                      </td>

                      {/* ================= Farz ================= */}
                      <td className="bg-blue-50/60 px-4 py-5 text-center dark:bg-blue-950/20">
                        <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                          {prayer.Farz}
                        </div>

                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Farz
                        </div>
                      </td>

                      {/* ================= SUNNAT AFTER ================= */}
                      <td className="px-4 py-5 text-center">
                        <div
                          className={`text-2xl font-bold ${
                            prayer.after === "-" ? "text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {prayer.after}
                        </div>

                        {prayer.after !== "-" && prayer.afterLabel && (
                          <div className="mt-1 text-[10px] text-muted-foreground">
                            {prayer.afterLabel}
                          </div>
                        )}
                      </td>

                      {/* ================= NAFL ================= */}
                      <td className="px-4 py-5 text-center">
                        <div
                          className={`text-2xl font-bold ${
                            prayer.nafl === "-" ? "text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {prayer.nafl}
                        </div>

                        {prayer.nafl !== "-" && prayer.naflLabel && (
                          <div className="mt-1 text-[10px] text-muted-foreground">
                            {prayer.naflLabel}
                          </div>
                        )}
                      </td>

                      {/* ================= WITR ================= */}
                      <td className="px-4 py-5 text-center">
                        <div
                          className={`text-2xl font-bold ${
                            prayer.witr === "-" ? "text-muted-foreground" : "text-gold"
                          }`}
                        >
                          {prayer.witr}
                        </div>

                        {prayer.witr !== "-" && (
                          <div className="mt-1 text-[10px] text-muted-foreground">Wajib</div>
                        )}
                      </td>

                      {/* ================= NAFL AFTER ================= */}
                      <td className="px-4 py-5 text-center">
                        <div
                          className={`text-2xl font-bold ${
                            prayer.naflAfter === "-" ? "text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {prayer.naflAfter}
                        </div>

                        {prayer.naflAfter !== "-" && (
                          <div className="mt-1 text-[10px] text-muted-foreground">Nafl</div>
                        )}
                      </td>

                      {/* ================= TOTAL ================= */}
                      <td className="bg-emerald-50/70 px-4 py-5 text-center dark:bg-emerald-950/20">
                        <div className="font-display text-3xl font-bold text-primary">
                          {prayer.total}
                        </div>

                        <div className="text-[10px] text-muted-foreground">Raka'at</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= BOTTOM INFORMATION CARDS ================= */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {/* Prayer Times */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
              <Clock className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            </div>

            <h3 className="font-display text-xl text-primary">Prayer Times</h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Stay updated with today's Salah timings and easily keep track of the next prayer
              throughout the day.
            </p>
          </div>

          {/* Salah */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
              <Sparkles className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            </div>

            <h3 className="font-display text-xl text-primary">About Salah</h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Salah is one of the most important acts of worship in Islam. Performing the five daily
              prayers helps us stay connected with Allah.
            </p>
          </div>

          {/* Masjid Reminder */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
              <Calendar className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
            </div>

            <h3 className="font-display text-xl text-primary">Stay Connected</h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep up with Masjid announcements, Islamic events, and important community updates in
              one place.
            </p>
          </div>
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

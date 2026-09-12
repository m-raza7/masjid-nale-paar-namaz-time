import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  currentAndNextPrayer,
  formatCountdown,
  formatTime12,
  hijriDate,
  toSlots,
  type PrayerRow,
} from "@/lib/prayer";

const hadiths = [
  {
    text: "The prayer is the first matter that a person will be questioned about on the Day of Judgment.",
    theme: "gold",
  },
  {
    text: "Prayer is the light of the believer.",
    theme: "green",
  },
  {
    text: "The closest a servant is to his Lord is while he is prostrating.",
    theme: "gold",
  },
  {
    text: "Whoever establishes prayer establishes his faith.",
    theme: "green",
  },
];

export const Route = createFileRoute("/_public/prayer-times")({
  head: () => ({
    meta: [
      { title: "Today's Prayer Times — Masjid Nale-paar" },
      {
        name: "description",
        content: "Today's Azan and Jamaat times for Fajr, Zuhr, Asr, Maghrib and Isha.",
      },
    ],
  }),
  component: PrayerTimesPage,
});

function PrayerTimesPage() {
  const { data } = useQuery({
    queryKey: ["prayer-schedule"],
    queryFn: async () => {
      const { data } = await supabase
        .from("prayer_times")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as PrayerRow | null;
    },
  });

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const { next, msToNext } = currentAndNextPrayer(data ?? null, now);
  const slots = data ? toSlots(data) : [];

  return (
    <div>
      <div className="relative z-20 w-full overflow-hidden border-b border-gold/20 bg-[#00150d] py-3">
        <div className="marquee-track flex w-max">
          {/* FIRST SET */}
          {hadiths.map((hadith, index) => (
            <div key={`first-${index}`} className="flex shrink-0 items-center whitespace-nowrap">
              <span
                className={`mx-8 text-sm font-medium ${
                  hadith.theme === "gold" ? "text-gold" : "text-primary-foreground/90"
                }`}
              >
                ✦
              </span>

              <span className="text-sm text-primary-foreground/90">{hadith.text}</span>

              <span
                className={`mx-8 text-sm ${
                  hadith.theme === "gold" ? "text-gold" : "text-primary-foreground/60"
                }`}
              >
                ✦
              </span>
            </div>
          ))}

          {/* SECOND SET - REQUIRED FOR INFINITE LOOP */}
          {hadiths.map((hadith, index) => (
            <div key={`second-${index}`} className="flex shrink-0 items-center whitespace-nowrap">
              <span
                className={`mx-8 text-sm font-medium ${
                  hadith.theme === "gold" ? "text-gold" : "text-primary-foreground/90"
                }`}
              >
                ✦
              </span>

              <span className="text-sm text-primary-foreground/90">{hadith.text}</span>

              <span
                className={`mx-8 text-sm ${
                  hadith.theme === "gold" ? "text-gold" : "text-primary-foreground/60"
                }`}
              >
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 pb-16">
        {/* ================= PRAYER TIMES SECTION ================= */}

        {/* <section className="relative overflow-hidden bg-[#faf9f3] py-8 sm:py-10 md:py-14 lg:py-16 dark:bg-background"> */}
        <div className="container relative mx-auto w-full px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-14 lg:py-16">
          {/* Green Background Area */}
          <div className="relative overflow-hidden rounded-2xl bg-[#003d2b] px-4 py-10 shadow-elegant sm:rounded-3xl sm:px-6 sm:py-12 md:px-8 md:py-14 lg:px-10 lg:py-16 dark:bg-gradient-hero">
            {/* Decorative Background */}
            <div className="arabesque pointer-events-none absolute inset-0 opacity-20" />

            <div className="relative mx-auto w-full max-w-4xl">
              {/* ================= HEADER ================= */}
              <div className="mx-auto w-full text-center">
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-gold sm:text-xs sm:tracking-[0.2em]">
                  {hijriDate(now)}
                </div>

                <h1 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl dark:text-primary-foreground">
                  Prayer Times
                </h1>

                <p className="mx-auto mt-2 max-w-full text-xs font-medium leading-5 text-white/70 sm:text-sm md:text-base dark:text-primary-foreground/70">
                  {now.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* ================= NEXT PRAYER CARD ================= */}
              <div className="relative mx-auto mt-8 w-full max-w-xl overflow-hidden rounded-2xl p-[1.5px] sm:mt-10 sm:rounded-3xl">
                {/* Moving Golden Light 1 */}
                <div className="prayer-border-light prayer-border-light-1" />

                {/* Moving Golden Light 2 - opposite side */}
                <div className="prayer-border-light prayer-border-light-2" />

                {/* Main Card */}
                <div
                  className="
      relative
      z-10
      rounded-[14px]
      bg-white
      p-4
      text-[#063b2c]
      shadow-elegant
      sm:rounded-[22px]
      sm:p-6
      md:p-8
      dark:bg-card
      dark:text-card-foreground
    "
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="
        shrink-0
        text-[9px]
        font-medium
        uppercase
        tracking-[0.15em]
        text-muted-foreground
        sm:text-xs
        sm:tracking-[0.2em]
      "
                    >
                      Next Prayer
                    </div>

                    <div
                      className="
        min-w-0
        truncate
        text-right
        text-[9px]
        font-bold
        tracking-wide
        text-muted-foreground
        sm:text-xs
      "
                    >
                      {now.toLocaleString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  {/* Next Prayer */}
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div
                      className="
        min-w-0
        font-display
        text-3xl
        text-[#087f63]
        sm:text-6xl
        md:text-6xl
        dark:text-primary
      "
                    >
                      {next?.name ?? "—"}
                    </div>

                    <div
                      className="
        shrink-0
        whitespace-nowrap
        font-display
        text-2xl
        text-gold
        sm:text-6xl
        md:text-4xl
      "
                    >
                      {formatTime12(next?.azan ?? null)}
                    </div>
                  </div>

                  {/* Current Time */}
                  <div
                    className="
      mt-5
      rounded-xl
      bg-[#f1f0e9]
      p-4
      text-center
      sm:mt-6
      sm:rounded-2xl
      sm:p-5
      md:p-6
      dark:bg-muted/60
    "
                  >
                    <div
                      className="
        text-[9px]
        font-medium
        uppercase
        tracking-[0.15em]
        text-muted-foreground
        sm:text-xs
        sm:tracking-[0.2em]
      "
                    >
                      Current Time
                    </div>

                    <div
                      className="
        mt-2
        whitespace-nowrap
        font-display
        text-3xl
        tabular-nums
        text-[#087f63]
        sm:text-5xl
        md:text-5xl
        dark:text-primary
      "
                    >
                      {now.toLocaleTimeString(undefined, {
                        hour12: true,
                      })}
                    </div>

                    {/* Time Remaining */}
                    <div
                      className="
        mt-4
        text-[9px]
        font-medium
        uppercase
        tracking-[0.15em]
        text-muted-foreground
        sm:mt-5
        sm:text-xs
        sm:tracking-[0.2em]
      "
                    >
                      Time Remaining
                    </div>

                    <div
                      className="
        mt-1
        whitespace-nowrap
        font-display
        text-4xl
        tabular-nums
        text-gold
        sm:text-5xl
        md:text-6xl
      "
                    >
                      {formatCountdown(msToNext)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </section> */}
        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground">
                  Prayer
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground">
                  Azan
                </th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground">
                  Jamaat
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slots.map((s) => (
                <tr key={s.name} className="transition-colors hover:bg-accent/40">
                  <td className="px-6 py-4 font-display text-2xl">{s.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatTime12(s.azan)}</td>
                  <td className="px-6 py-4 font-display text-xl text-primary">
                    {formatTime12(s.jamaat)}
                  </td>
                </tr>
              ))}
              {data && (
                <tr className="bg-gold/5 transition-colors hover:bg-accent/40">
                  <td className="px-6 py-4 font-display text-2xl text-gold">Jumuah</td>
                  <td className="px-6 py-4 text-muted-foreground">{formatTime12(data.jumuah_1)}</td>
                  <td className="px-6 py-4 font-display text-xl text-primary">
                    {formatTime12(data.jumuah_2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* {data && (data.jumuah_2 || data.jumuah_3) && (
          <div className="grid grid-cols-2 border-t border-border bg-muted/30 text-center">
            {[
              ["Jumuah 2", data.jumuah_2],
              ["Jumuah 3", data.jumuah_3],
            ].map(([l, v]) => (
              <div key={l as string} className="px-4 py-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
                <div className="mt-1 font-display text-xl text-gold">
                  {formatTime12(v as string | null)}
                </div>
              </div>
            ))}
          </div>
        )} */}
        </div>
      </div>
    </div>
  );
}

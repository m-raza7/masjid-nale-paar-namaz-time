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

export const Route = createFileRoute("/_public/prayer-times")({
  head: () => ({
    meta: [
      { title: "Today's Prayer Times — Nale-paar Masjid" },
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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-gold">{hijriDate(now)}</div>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Prayer Times</h1>
        <p className="mt-2 text-muted-foreground">
          {now.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl border border-gold/20 rounded-3xl bg-gradient-hero p-8 text-center text-primary-foreground shadow-elegant">
        <div className="text-xs uppercase tracking-[0.2em] text-gold">Next prayer</div>
        <div className="mt-2 font-display text-5xl">{next?.name ?? "—"}</div>
        <div className="mt-2 text-gold">{formatTime12(next?.azan ?? null)}</div>
        <div className="mt-2 text-xs uppercase tracking-[0.2em] tabular-nums">Current Time</div>
        <div className="font-display text-5xl tabular-nums text-gold">
          {now.toLocaleTimeString(undefined, { hour12: true })}
        </div>
        <div className="mt-5 text-xs uppercase tracking-[0.2em] tabular-nums">Time remaining</div>
        <div className="font-display text-6xl tabular-nums">{formatCountdown(msToNext)}</div>
      </div>

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
  );
}

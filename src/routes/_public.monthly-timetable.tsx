import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatTime12, type PrayerRow } from "@/lib/prayer";

export const Route = createFileRoute("/_public/monthly-timetable")({
  head: () => ({
    meta: [
      { title: "Monthly Prayer Timetable — Nale-paar Masjid" },
      {
        name: "description",
        content: "Full monthly Azan and Jamaat prayer timetable for the masjid.",
      },
    ],
  }),
  component: MonthlyPage,
});

function MonthlyPage() {
  const start = new Date();
  start.setDate(1);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const { data, isLoading } = useQuery({
    queryKey: ["prayer-month", iso(start)],
    queryFn: async () => {
      const { data } = await supabase
        .from("prayer_times")
        .select("*")
        .gte("date", iso(start))
        .lte("date", iso(end))
        .order("date");
      return (data ?? []) as PrayerRow[];
    },
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.2em] text-gold">Monthly Schedule</div>
        <h1 className="mt-3 font-display text-5xl">
          {start.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </h1>
      </div>
      <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Fajr</th>
              <th className="px-4 py-3">Sunrise</th>
              <th className="px-4 py-3">Zuhr</th>
              <th className="px-4 py-3">Asr</th>
              <th className="px-4 py-3">Maghrib</th>
              <th className="px-4 py-3">Isha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={7}>
                  Loading…
                </td>
              </tr>
            )}
            {(data ?? []).map((r) => {
              const d = new Date(r.date + "T00:00:00");
              const isToday = iso(d) === iso(new Date());
              return (
                <tr
                  key={r.date}
                  className={isToday ? "bg-gold/10 font-medium" : "hover:bg-accent/40"}
                >
                  <td className="px-4 py-3">
                    <div className="font-display text-base">{d.getDate()}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {d.toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {formatTime12(r.fajr_azan)}
                    <div className="text-[10px] text-muted-foreground">
                      {formatTime12(r.fajr_jamaat)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatTime12(r.sunrise)}</td>
                  <td className="px-4 py-3">
                    {formatTime12(r.zuhr_azan)}
                    <div className="text-[10px] text-muted-foreground">
                      {formatTime12(r.zuhr_jamaat)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {formatTime12(r.asr_azan)}
                    <div className="text-[10px] text-muted-foreground">
                      {formatTime12(r.asr_jamaat)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {formatTime12(r.maghrib_azan)}
                    <div className="text-[10px] text-muted-foreground">
                      {formatTime12(r.maghrib_jamaat)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {formatTime12(r.isha_azan)}
                    <div className="text-[10px] text-muted-foreground">
                      {formatTime12(r.isha_jamaat)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Top row of each cell shows Azan time; smaller row shows Jamaat time.
      </p>
    </div>
  );
}

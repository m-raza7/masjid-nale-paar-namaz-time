import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Calendar, ClockIcon, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { todayISO } from "@/lib/prayer";

export const Route = createFileRoute("/_admin/administrator/")({
  component: Dashboard,
});

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-gold text-gold-foreground"><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 font-display text-4xl text-primary">{value}</div>
    </div>
  );
}

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [pt, an, ev] = await Promise.all([
        supabase.from("prayer_times").select("id", { count: "exact", head: true }),
        supabase.from("announcements").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("events").select("id", { count: "exact", head: true }).gte("event_date", todayISO()),
      ]);
      return { pt: pt.count ?? 0, an: an.count ?? 0, ev: ev.count ?? 0 };
    },
  });
  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-gold">Dashboard</div>
        <h1 className="mt-2 font-display text-4xl">As-salāmu ʿalaykum</h1>
        <p className="text-muted-foreground">Manage your masjid from one place.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={ClockIcon} label="Prayer time entries" value={data?.pt ?? "—"} />
        <Stat icon={Bell} label="Active announcements" value={data?.an ?? "—"} />
        <Stat icon={Calendar} label="Upcoming events" value={data?.ev ?? "—"} />
        <Stat icon={Users} label="Community" value="Open" />
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SCHEDULE_DATE, type PrayerRow } from "@/lib/prayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_admin/administrator/prayer-times")({
  component: PrayerTimesAdmin,
});

const fields = [
  ["fajr_azan", "Fajr Azan"],
  ["fajr_jamaat", "Fajr Jamaat"],
  ["sunrise", "Sunrise"],
  ["zuhr_azan", "Zuhr Azan"],
  ["zuhr_jamaat", "Zuhr Jamaat"],
  ["asr_azan", "Asr Azan"],
  ["asr_jamaat", "Asr Jamaat"],
  ["maghrib_azan", "Maghrib Azan"],
  ["maghrib_jamaat", "Maghrib Jamaat"],
  ["isha_azan", "Isha Azan"],
  ["isha_jamaat", "Isha Jamaat"],
  // ["jumuah", "Jumuah Azan"],
  // ["jumuah_jamaat", "Jumuah Jamaat"],
  // ["jumuah_2", "Jumuah 2"],
  // ["jumuah_3", "Jumuah 3"],
  ["jumuah_1", "Jumuah 1"],
  ["jumuah_2", "Jumuah 2"],
  ["jumuah_3", "Jumuah 3"],
] as const;

type Form = Partial<PrayerRow> & { date: string; notes?: string | null };

function PrayerTimesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
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

  const [form, setForm] = useState<Form>({ date: SCHEDULE_DATE });

  // useEffect(() => {
  //   if (data) setForm({ ...data, date: SCHEDULE_DATE });
  //   else setForm({ date: SCHEDULE_DATE });
  // }, [data]);

  useEffect(() => {
    if (!data) return;

    setForm({
      ...data,
      date: SCHEDULE_DATE,
    });
  }, [data]);

  const save = useMutation({
    // mutationFn: async (f: Form) => {
    //   const payload: any = { ...f, date: SCHEDULE_DATE };
    //   for (const [k] of fields) if (payload[k] === "") payload[k] = null;
    //   const { error } = await supabase.from("prayer_times").upsert(payload, { onConflict: "date" });
    //   if (error) throw error;
    // },

    mutationFn: async (f: Form) => {
      const payload: any = { ...f, date: SCHEDULE_DATE };

      for (const [k] of fields) {
        if (payload[k] === "") payload[k] = null;
      }

      const { data: existing } = await supabase
        .from("prayer_times")
        .select("id")
        .eq("date", SCHEDULE_DATE)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase.from("prayer_times").update(payload).eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("prayer_times").insert(payload);

        if (error) throw error;
      }
    },

    onSuccess: () => {
      toast.success("Schedule updated");
      qc.invalidateQueries({ queryKey: ["prayer-schedule"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-gold">Manage</div>
        <h1 className="mt-2 font-display text-4xl">Prayer Schedule</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the masjid's Azan and Jamaat times once. Update whenever they change — the website
          always shows the latest values.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(form);
        }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map(([k, label]) => (
                <div key={k}>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </Label>
                  <Input
                    type="time"
                    value={((form as any)[k] ?? "").toString().slice(0, 5)}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value } as Form)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Notes
              </Label>
              <Textarea
                value={form.notes ?? ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional notes shown alongside the schedule"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={save.isPending}
                className="bg-gradient-gold text-gold-foreground"
              >
                <Save className="mr-2 h-4 w-4" />
                {save.isPending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

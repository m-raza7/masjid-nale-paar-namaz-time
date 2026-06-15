import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatTime12, type PrayerRow } from "@/lib/prayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/_admin/administrator/prayer-times")({
  component: PrayerTimesAdmin,
});

const fields = [
  ["fajr_azan", "Fajr Azan"], ["fajr_jamaat", "Fajr Jamaat"],
  ["sunrise", "Sunrise"],
  ["zuhr_azan", "Zuhr Azan"], ["zuhr_jamaat", "Zuhr Jamaat"],
  ["asr_azan", "Asr Azan"], ["asr_jamaat", "Asr Jamaat"],
  ["maghrib_azan", "Maghrib Azan"], ["maghrib_jamaat", "Maghrib Jamaat"],
  ["isha_azan", "Isha Azan"], ["isha_jamaat", "Isha Jamaat"],
  ["jumuah_1", "Jumuah 1"], ["jumuah_2", "Jumuah 2"], ["jumuah_3", "Jumuah 3"],
] as const;

type Form = Partial<PrayerRow> & { date: string; notes?: string | null };

function emptyForm(): Form { return { date: new Date().toISOString().slice(0,10) }; }

function PrayerTimesAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-prayer-times"],
    queryFn: async () => {
      const { data } = await supabase.from("prayer_times").select("*").order("date", { ascending: false }).limit(120);
      return (data ?? []) as PrayerRow[];
    },
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm());
  const isEdit = !!data?.find((r) => r.date === form.date);

  const save = useMutation({
    mutationFn: async (f: Form) => {
      const payload: any = { ...f };
      for (const [k] of fields) if (payload[k] === "") payload[k] = null;
      const { error } = await supabase.from("prayer_times").upsert(payload, { onConflict: "date" });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-prayer-times"] }); qc.invalidateQueries({ queryKey: ["prayer-today"] }); qc.invalidateQueries({ queryKey: ["prayer-month"] }); setOpen(false); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (date: string) => {
      const { error } = await supabase.from("prayer_times").delete().eq("date", date);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-prayer-times"] }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Manage</div>
          <h1 className="mt-2 font-display text-4xl">Prayer Times</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setForm(emptyForm())} className="bg-gradient-gold text-gold-foreground"><Plus className="mr-2 h-4 w-4" /> Add / Update day</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display text-2xl">{isEdit ? "Edit" : "Add"} prayer times</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map(([k, label]) => (
                  <div key={k}>
                    <Label>{label}</Label>
                    <Input type="time" value={(form as any)[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value } as Form)} />
                  </div>
                ))}
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <Button type="submit" disabled={save.isPending} className="w-full bg-primary text-primary-foreground">{save.isPending ? "Saving…" : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Date</th><th className="px-4 py-3">Fajr</th><th className="px-4 py-3">Zuhr</th>
              <th className="px-4 py-3">Asr</th><th className="px-4 py-3">Maghrib</th><th className="px-4 py-3">Isha</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(data ?? []).map((r) => (
              <tr key={r.date} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">{new Date(r.date+"T00:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}</td>
                <td className="px-4 py-3">{formatTime12(r.fajr_azan)}</td>
                <td className="px-4 py-3">{formatTime12(r.zuhr_azan)}</td>
                <td className="px-4 py-3">{formatTime12(r.asr_azan)}</td>
                <td className="px-4 py-3">{formatTime12(r.maghrib_azan)}</td>
                <td className="px-4 py-3">{formatTime12(r.isha_azan)}</td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setForm(r as any); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete this day?")) del.mutate(r.date); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

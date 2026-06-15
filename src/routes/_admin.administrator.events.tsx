import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatTime12 } from "@/lib/prayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/_admin/administrator/events")({
  component: EventsAdmin,
});

type Form = { id?: string; title: string; description: string; event_date: string; start_time: string; end_time: string; location: string };
const empty: Form = { title: "", description: "", event_date: new Date().toISOString().slice(0,10), start_time: "", end_time: "", location: "" };

function EventsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
      return data ?? [];
    },
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  const save = useMutation({
    mutationFn: async (f: Form) => {
      const payload = { title: f.title, description: f.description || null, event_date: f.event_date, start_time: f.start_time || null, end_time: f.end_time || null, location: f.location || null };
      if (f.id) { const { error } = await supabase.from("events").update(payload).eq("id", f.id); if (error) throw error; }
      else { const { error } = await supabase.from("events").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved"); qc.invalidateQueries({ queryKey: ["admin-events"] }); qc.invalidateQueries({ queryKey: ["events"] }); setOpen(false); },
    onError: (e: any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("events").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-events"] }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold">Manage</div>
          <h1 className="mt-2 font-display text-4xl">Events</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => setForm(empty)} className="bg-gradient-gold text-gold-foreground"><Plus className="mr-2 h-4 w-4" /> New</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display text-2xl">{form.id ? "Edit" : "New"} event</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }} className="space-y-4">
              <div><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div><Label>Date</Label><Input type="date" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
                <div><Label>Start</Label><Input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} /></div>
                <div><Label>End</Label><Input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} /></div>
              </div>
              <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <Button type="submit" disabled={save.isPending} className="w-full bg-primary text-primary-foreground">{save.isPending ? "Saving…" : "Save"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map((e) => (
          <div key={e.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl">{e.title}</h3>
                <div className="mt-1 text-xs text-muted-foreground">{new Date(e.event_date).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})} · {formatTime12(e.start_time)}{e.end_time ? ` – ${formatTime12(e.end_time)}` : ""}</div>
                {e.location && <div className="mt-1 text-xs text-muted-foreground">{e.location}</div>}
                {e.description && <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>}
              </div>
              <div className="flex shrink-0">
                <Button size="sm" variant="ghost" onClick={() => { setForm({ id: e.id, title: e.title, description: e.description ?? "", event_date: e.event_date, start_time: e.start_time ?? "", end_time: e.end_time ?? "", location: e.location ?? "" }); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete?")) del.mutate(e.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

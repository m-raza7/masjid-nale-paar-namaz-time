import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { s as supabase } from "./client-B0vxMC1r.js";
import { f as formatTime12 } from "./prayer-eI_VmdU3.js";
import { B as Button } from "./button-DjOZMqFS.js";
import { L as Label, I as Input } from "./label-BJaHSwYl.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, T as Textarea } from "./dialog-CMep2jAb.js";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
const fields = [["fajr_azan", "Fajr Azan"], ["fajr_jamaat", "Fajr Jamaat"], ["sunrise", "Sunrise"], ["zuhr_azan", "Zuhr Azan"], ["zuhr_jamaat", "Zuhr Jamaat"], ["asr_azan", "Asr Azan"], ["asr_jamaat", "Asr Jamaat"], ["maghrib_azan", "Maghrib Azan"], ["maghrib_jamaat", "Maghrib Jamaat"], ["isha_azan", "Isha Azan"], ["isha_jamaat", "Isha Jamaat"], ["jumuah_1", "Jumuah 1"], ["jumuah_2", "Jumuah 2"], ["jumuah_3", "Jumuah 3"]];
function emptyForm() {
  return {
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  };
}
function PrayerTimesAdmin() {
  const qc = useQueryClient();
  const {
    data
  } = useQuery({
    queryKey: ["admin-prayer-times"],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("prayer_times").select("*").order("date", {
        ascending: false
      }).limit(120);
      return data2 ?? [];
    }
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const isEdit = !!data?.find((r) => r.date === form.date);
  const save = useMutation({
    mutationFn: async (f) => {
      const payload = {
        ...f
      };
      for (const [k] of fields) if (payload[k] === "") payload[k] = null;
      const {
        error
      } = await supabase.from("prayer_times").upsert(payload, {
        onConflict: "date"
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({
        queryKey: ["admin-prayer-times"]
      });
      qc.invalidateQueries({
        queryKey: ["prayer-today"]
      });
      qc.invalidateQueries({
        queryKey: ["prayer-month"]
      });
      setOpen(false);
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (date) => {
      const {
        error
      } = await supabase.from("prayer_times").delete().eq("date", date);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["admin-prayer-times"]
      });
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Manage" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-2 font-display text-4xl", children: "Prayer Times" })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { onClick: () => setForm(emptyForm()), className: "bg-gradient-gold text-gold-foreground", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          " Add / Update day"
        ] }) }),
        /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[90vh] max-w-2xl overflow-y-auto", children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "font-display text-2xl", children: [
            isEdit ? "Edit" : "Add",
            " prayer times"
          ] }) }),
          /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
            e.preventDefault();
            save.mutate(form);
          }, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Date" }),
              /* @__PURE__ */ jsx(Input, { type: "date", required: true, value: form.date, onChange: (e) => setForm({
                ...form,
                date: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: fields.map(([k, label]) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: label }),
              /* @__PURE__ */ jsx(Input, { type: "time", value: form[k] ?? "", onChange: (e) => setForm({
                ...form,
                [k]: e.target.value
              }) })
            ] }, k)) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Notes" }),
              /* @__PURE__ */ jsx(Textarea, { value: form.notes ?? "", onChange: (e) => setForm({
                ...form,
                notes: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: save.isPending, className: "w-full bg-primary text-primary-foreground", children: save.isPending ? "Saving…" : "Save" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-2xl border border-border bg-card shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[700px] text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Date" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Fajr" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Zuhr" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Asr" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Maghrib" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Isha" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: (data ?? []).map((r) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-accent/30", children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium", children: (/* @__PURE__ */ new Date(r.date + "T00:00:00")).toLocaleDateString(void 0, {
          weekday: "short",
          month: "short",
          day: "numeric"
        }) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: formatTime12(r.fajr_azan) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: formatTime12(r.zuhr_azan) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: formatTime12(r.asr_azan) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: formatTime12(r.maghrib_azan) }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: formatTime12(r.isha_azan) }),
        /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-right", children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
            setForm(r);
            setOpen(true);
          }, children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
            if (confirm("Delete this day?")) del.mutate(r.date);
          }, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
        ] })
      ] }, r.date)) })
    ] }) })
  ] });
}
export {
  PrayerTimesAdmin as component
};

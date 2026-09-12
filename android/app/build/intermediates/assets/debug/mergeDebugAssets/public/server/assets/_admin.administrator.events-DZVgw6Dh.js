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
const empty = {
  title: "",
  description: "",
  event_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
  start_time: "",
  end_time: "",
  location: ""
};
function EventsAdmin() {
  const qc = useQueryClient();
  const {
    data
  } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("events").select("*").order("event_date", {
        ascending: false
      });
      return data2 ?? [];
    }
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const save = useMutation({
    mutationFn: async (f) => {
      const payload = {
        title: f.title,
        description: f.description || null,
        event_date: f.event_date,
        start_time: f.start_time || null,
        end_time: f.end_time || null,
        location: f.location || null
      };
      if (f.id) {
        const {
          error
        } = await supabase.from("events").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("events").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({
        queryKey: ["admin-events"]
      });
      qc.invalidateQueries({
        queryKey: ["events"]
      });
      setOpen(false);
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["admin-events"]
      });
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Manage" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-2 font-display text-4xl", children: "Events" })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { onClick: () => setForm(empty), className: "bg-gradient-gold text-gold-foreground", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          " New"
        ] }) }),
        /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "font-display text-2xl", children: [
            form.id ? "Edit" : "New",
            " event"
          ] }) }),
          /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
            e.preventDefault();
            save.mutate(form);
          }, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Title" }),
              /* @__PURE__ */ jsx(Input, { required: true, value: form.title, onChange: (e) => setForm({
                ...form,
                title: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Description" }),
              /* @__PURE__ */ jsx(Textarea, { rows: 3, value: form.description, onChange: (e) => setForm({
                ...form,
                description: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Date" }),
                /* @__PURE__ */ jsx(Input, { type: "date", required: true, value: form.event_date, onChange: (e) => setForm({
                  ...form,
                  event_date: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "Start" }),
                /* @__PURE__ */ jsx(Input, { type: "time", value: form.start_time, onChange: (e) => setForm({
                  ...form,
                  start_time: e.target.value
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { children: "End" }),
                /* @__PURE__ */ jsx(Input, { type: "time", value: form.end_time, onChange: (e) => setForm({
                  ...form,
                  end_time: e.target.value
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { children: "Location" }),
              /* @__PURE__ */ jsx(Input, { value: form.location, onChange: (e) => setForm({
                ...form,
                location: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: save.isPending, className: "w-full bg-primary text-primary-foreground", children: save.isPending ? "Saving…" : "Save" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: (data ?? []).map((e) => /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border bg-card p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl", children: e.title }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
          new Date(e.event_date).toLocaleDateString(void 0, {
            weekday: "long",
            month: "long",
            day: "numeric"
          }),
          " · ",
          formatTime12(e.start_time),
          e.end_time ? ` – ${formatTime12(e.end_time)}` : ""
        ] }),
        e.location && /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: e.location }),
        e.description && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: e.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex shrink-0", children: [
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
          setForm({
            id: e.id,
            title: e.title,
            description: e.description ?? "",
            event_date: e.event_date,
            start_time: e.start_time ?? "",
            end_time: e.end_time ?? "",
            location: e.location ?? ""
          });
          setOpen(true);
        }, children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
          if (confirm("Delete?")) del.mutate(e.id);
        }, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] })
    ] }) }, e.id)) })
  ] });
}
export {
  EventsAdmin as component
};

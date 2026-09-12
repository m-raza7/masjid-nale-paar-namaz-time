import { jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { s as supabase } from "./client-B0vxMC1r.js";
import { c as cn, B as Button } from "./button-DjOZMqFS.js";
import { L as Label, I as Input } from "./label-BJaHSwYl.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, T as Textarea } from "./dialog-CMep2jAb.js";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import "@supabase/supabase-js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const empty = {
  title: "",
  description: "",
  active: true
};
function AnnouncementsAdmin() {
  const qc = useQueryClient();
  const {
    data
  } = useQuery({
    queryKey: ["admin-announcements"],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("announcements").select("*").order("created_at", {
        ascending: false
      });
      return data2 ?? [];
    }
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const save = useMutation({
    mutationFn: async (f) => {
      if (f.id) {
        const {
          error
        } = await supabase.from("announcements").update({
          title: f.title,
          description: f.description,
          active: f.active
        }).eq("id", f.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("announcements").insert({
          title: f.title,
          description: f.description,
          active: f.active
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({
        queryKey: ["admin-announcements"]
      });
      qc.invalidateQueries({
        queryKey: ["announcements"]
      });
      setOpen(false);
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("announcements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({
        queryKey: ["admin-announcements"]
      });
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Manage" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-2 font-display text-4xl", children: "Announcements" })
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { onClick: () => setForm(empty), className: "bg-gradient-gold text-gold-foreground", children: [
          /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
          " New"
        ] }) }),
        /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "font-display text-2xl", children: [
            form.id ? "Edit" : "New",
            " announcement"
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
              /* @__PURE__ */ jsx(Textarea, { required: true, rows: 5, value: form.description, onChange: (e) => setForm({
                ...form,
                description: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border p-3", children: [
              /* @__PURE__ */ jsx(Label, { children: "Active" }),
              /* @__PURE__ */ jsx(Switch, { checked: form.active, onCheckedChange: (v) => setForm({
                ...form,
                active: v
              }) })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: save.isPending, className: "w-full bg-primary text-primary-foreground", children: save.isPending ? "Saving…" : "Save" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: (data ?? []).map((a) => /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl", children: a.title }),
          !a.active && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground", children: "Inactive" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 whitespace-pre-line text-sm text-muted-foreground", children: a.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex shrink-0", children: [
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
          setForm({
            id: a.id,
            title: a.title,
            description: a.description,
            active: a.active
          });
          setOpen(true);
        }, children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => {
          if (confirm("Delete?")) del.mutate(a.id);
        }, children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
      ] })
    ] }, a.id)) })
  ] });
}
export {
  AnnouncementsAdmin as component
};

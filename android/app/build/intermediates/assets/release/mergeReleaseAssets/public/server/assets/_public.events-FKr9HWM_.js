import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, MapPin } from "lucide-react";
import { s as supabase } from "./client-B0vxMC1r.js";
import { t as todayISO, f as formatTime12 } from "./prayer-eI_VmdU3.js";
import "@supabase/supabase-js";
function EventsPage() {
  const {
    data
  } = useQuery({
    queryKey: ["events", "all"],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("events").select("*").gte("event_date", todayISO()).order("event_date");
      return data2 ?? [];
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl px-4 py-16", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Community" }),
    /* @__PURE__ */ jsx("h1", { className: "mt-2 font-display text-5xl", children: "Events" }),
    /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-5 sm:grid-cols-2", children: [
      (data ?? []).map((e) => /* @__PURE__ */ jsxs("article", { className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-gradient-hero px-6 py-5 text-primary-foreground", children: [
          /* @__PURE__ */ jsx("div", { className: "font-display text-2xl", children: e.title }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-gradient-gold px-3 py-2 text-center text-gold-foreground", children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider", children: new Date(e.event_date).toLocaleString(void 0, {
              month: "short"
            }) }),
            /* @__PURE__ */ jsx("div", { className: "font-display text-2xl leading-none", children: new Date(e.event_date).getDate() })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          e.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: e.description }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-gold" }),
              " ",
              new Date(e.event_date).toLocaleDateString(void 0, {
                weekday: "long",
                month: "long",
                day: "numeric"
              })
            ] }),
            e.start_time && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-gold" }),
              " ",
              formatTime12(e.start_time),
              e.end_time && ` – ${formatTime12(e.end_time)}`
            ] }),
            e.location && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-gold" }),
              " ",
              e.location
            ] })
          ] })
        ] })
      ] }, e.id)),
      data?.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "No upcoming events." })
    ] })
  ] });
}
export {
  EventsPage as component
};

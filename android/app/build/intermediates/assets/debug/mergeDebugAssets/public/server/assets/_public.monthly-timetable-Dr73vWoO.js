import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { s as supabase } from "./client-B0vxMC1r.js";
import { f as formatTime12 } from "./prayer-eI_VmdU3.js";
import "@supabase/supabase-js";
function MonthlyPage() {
  const start = /* @__PURE__ */ new Date();
  start.setDate(1);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  const iso = (d) => d.toISOString().slice(0, 10);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["prayer-month", iso(start)],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("prayer_times").select("*").gte("date", iso(start)).lte("date", iso(end)).order("date");
      return data2 ?? [];
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Monthly Schedule" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-3 font-display text-5xl", children: start.toLocaleDateString(void 0, {
        month: "long",
        year: "numeric"
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[800px] text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Date" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Fajr" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Sunrise" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Zuhr" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Asr" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Maghrib" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Isha" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { className: "divide-y divide-border", children: [
        isLoading && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { className: "px-4 py-6 text-muted-foreground", colSpan: 7, children: "Loading…" }) }),
        (data ?? []).map((r) => {
          const d = /* @__PURE__ */ new Date(r.date + "T00:00:00");
          const isToday = iso(d) === iso(/* @__PURE__ */ new Date());
          return /* @__PURE__ */ jsxs("tr", { className: isToday ? "bg-gold/10 font-medium" : "hover:bg-accent/40", children: [
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsx("div", { className: "font-display text-base", children: d.getDate() }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: d.toLocaleDateString(void 0, {
                weekday: "short"
              }) })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
              formatTime12(r.fajr_azan),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: formatTime12(r.fajr_jamaat) })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground", children: formatTime12(r.sunrise) }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
              formatTime12(r.zuhr_azan),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: formatTime12(r.zuhr_jamaat) })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
              formatTime12(r.asr_azan),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: formatTime12(r.asr_jamaat) })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
              formatTime12(r.maghrib_azan),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: formatTime12(r.maghrib_jamaat) })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
              formatTime12(r.isha_azan),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: formatTime12(r.isha_jamaat) })
            ] })
          ] }, r.date);
        })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Top row of each cell shows Azan time; smaller row shows Jamaat time." })
  ] });
}
export {
  MonthlyPage as component
};

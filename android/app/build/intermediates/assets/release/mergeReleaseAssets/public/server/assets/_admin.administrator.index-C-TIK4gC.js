import { jsxs, jsx } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon, Bell, Calendar, Users } from "lucide-react";
import { s as supabase } from "./client-B0vxMC1r.js";
import { t as todayISO } from "./prayer-eI_VmdU3.js";
import "@supabase/supabase-js";
function Stat({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-full bg-gradient-gold text-gold-foreground", children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 font-display text-4xl text-primary", children: value })
  ] });
}
function Dashboard() {
  const {
    data
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [pt, an, ev] = await Promise.all([supabase.from("prayer_times").select("id", {
        count: "exact",
        head: true
      }), supabase.from("announcements").select("id", {
        count: "exact",
        head: true
      }).eq("active", true), supabase.from("events").select("id", {
        count: "exact",
        head: true
      }).gte("event_date", todayISO())]);
      return {
        pt: pt.count ?? 0,
        an: an.count ?? 0,
        ev: ev.count ?? 0
      };
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-gold", children: "Dashboard" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-2 font-display text-4xl", children: "As-salāmu ʿalaykum" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Manage your masjid from one place." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Stat, { icon: ClockIcon, label: "Prayer time entries", value: data?.pt ?? "—" }),
      /* @__PURE__ */ jsx(Stat, { icon: Bell, label: "Active announcements", value: data?.an ?? "—" }),
      /* @__PURE__ */ jsx(Stat, { icon: Calendar, label: "Upcoming events", value: data?.ev ?? "—" }),
      /* @__PURE__ */ jsx(Stat, { icon: Users, label: "Community", value: "Open" })
    ] })
  ] });
}
export {
  Dashboard as component
};

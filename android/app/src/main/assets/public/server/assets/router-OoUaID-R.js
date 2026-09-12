import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
const appCss = "/assets/styles-CWcuq8mu.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$c = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Al-Noor Masjid — Azan & Prayer Timetable" },
      { name: "description", content: "Daily Azan, Jamaat times, monthly timetable, Jumuah, announcements and community events at Al-Noor Masjid." },
      { property: "og:title", content: "Al-Noor Masjid — Azan & Prayer Timetable" },
      { property: "og:description", content: "Daily Azan, Jamaat times, monthly timetable, Jumuah, announcements and community events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Karla:wght@300;400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$c.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const $$splitComponentImporter$b = () => import("./_public-IVLZLVpg.js");
const Route$b = createFileRoute("/_public")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./_admin-CHw8BNbj.js");
const Route$a = createFileRoute("/_admin")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./_public.index-Cu1Z2VO9.js");
const Route$9 = createFileRoute("/_public/")({
  head: () => ({
    meta: [{
      title: "Al-Noor Masjid — Azan & Prayer Timetable"
    }, {
      name: "description",
      content: "Daily Azan, Jamaat times, monthly prayer timetable, Jumuah and community events at Al-Noor Masjid."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.login-FSmiW5Y_.js");
const Route$8 = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{
      title: "Admin Login — Al-Noor Masjid"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./_public.prayer-times-CaMnlGon.js");
const Route$7 = createFileRoute("/_public/prayer-times")({
  head: () => ({
    meta: [{
      title: "Today's Prayer Times — Al-Noor Masjid"
    }, {
      name: "description",
      content: "Today's Azan and Jamaat times for Fajr, Zuhr, Asr, Maghrib and Isha."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./_public.monthly-timetable-Dr73vWoO.js");
const Route$6 = createFileRoute("/_public/monthly-timetable")({
  head: () => ({
    meta: [{
      title: "Monthly Prayer Timetable — Al-Noor Masjid"
    }, {
      name: "description",
      content: "Full monthly Azan and Jamaat prayer timetable for the masjid."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./_public.events-FKr9HWM_.js");
const Route$5 = createFileRoute("/_public/events")({
  head: () => ({
    meta: [{
      title: "Events — Al-Noor Masjid"
    }, {
      name: "description",
      content: "Upcoming community events at the masjid: halaqas, iftars, lectures and more."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./_public.announcements-BDP6PTH1.js");
const Route$4 = createFileRoute("/_public/announcements")({
  head: () => ({
    meta: [{
      title: "Announcements — Al-Noor Masjid"
    }, {
      name: "description",
      content: "Latest news and announcements from the masjid administration."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./_admin.administrator.index-C-TIK4gC.js");
const Route$3 = createFileRoute("/_admin/administrator/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./_admin.administrator.prayer-times-oXL-zpnE.js");
const Route$2 = createFileRoute("/_admin/administrator/prayer-times")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./_admin.administrator.events-DZVgw6Dh.js");
const Route$1 = createFileRoute("/_admin/administrator/events")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./_admin.administrator.announcements-CaKjTlx1.js");
const Route = createFileRoute("/_admin/administrator/announcements")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const PublicRoute = Route$b.update({
  id: "/_public",
  getParentRoute: () => Route$c
});
const AdminRoute = Route$a.update({
  id: "/_admin",
  getParentRoute: () => Route$c
});
const PublicIndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => PublicRoute
});
const AdminLoginRoute = Route$8.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$c
});
const PublicPrayerTimesRoute = Route$7.update({
  id: "/prayer-times",
  path: "/prayer-times",
  getParentRoute: () => PublicRoute
});
const PublicMonthlyTimetableRoute = Route$6.update({
  id: "/monthly-timetable",
  path: "/monthly-timetable",
  getParentRoute: () => PublicRoute
});
const PublicEventsRoute = Route$5.update({
  id: "/events",
  path: "/events",
  getParentRoute: () => PublicRoute
});
const PublicAnnouncementsRoute = Route$4.update({
  id: "/announcements",
  path: "/announcements",
  getParentRoute: () => PublicRoute
});
const AdminAdministratorIndexRoute = Route$3.update({
  id: "/administrator/",
  path: "/administrator/",
  getParentRoute: () => AdminRoute
});
const AdminAdministratorPrayerTimesRoute = Route$2.update({
  id: "/administrator/prayer-times",
  path: "/administrator/prayer-times",
  getParentRoute: () => AdminRoute
});
const AdminAdministratorEventsRoute = Route$1.update({
  id: "/administrator/events",
  path: "/administrator/events",
  getParentRoute: () => AdminRoute
});
const AdminAdministratorAnnouncementsRoute = Route.update({
  id: "/administrator/announcements",
  path: "/administrator/announcements",
  getParentRoute: () => AdminRoute
});
const AdminRouteChildren = {
  AdminAdministratorAnnouncementsRoute,
  AdminAdministratorEventsRoute,
  AdminAdministratorPrayerTimesRoute,
  AdminAdministratorIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const PublicRouteChildren = {
  PublicAnnouncementsRoute,
  PublicEventsRoute,
  PublicMonthlyTimetableRoute,
  PublicPrayerTimesRoute,
  PublicIndexRoute
};
const PublicRouteWithChildren = PublicRoute._addFileChildren(PublicRouteChildren);
const rootRouteChildren = {
  AdminRoute: AdminRouteWithChildren,
  PublicRoute: PublicRouteWithChildren,
  AdminLoginRoute
};
const routeTree = Route$c._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};

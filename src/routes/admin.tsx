import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Boxes, Gift, Home, Image, Info, LayoutDashboard, Percent, Tags } from "lucide-react";

import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة · Dubai Abaya" },
      {
        name: "description",
        content: "إدارة المخزون والفئات والعروض ومعلومات المتجر وشعاره من لوحة تحكم واحدة.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة الإدارة · Dubai Abaya" },
      { property: "og:description", content: "تحكم كامل بمحتوى المتجر." },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "المنتجات والمخزون", icon: Boxes },
  { to: "/admin/categories", label: "الفئات", icon: Tags },
  { to: "/admin/offers", label: "العروض", icon: Percent },
  { to: "/admin/lottery", label: "السحب الأسبوعي", icon: Gift },
  { to: "/admin/info", label: "المعلومات", icon: Info },
  { to: "/admin/branding", label: "الشعار والهوية", icon: Image },
] as const;

function AdminLayout() {
  const { state } = useStore();

  return (
    <div dir="rtl" className="relative min-h-screen bg-secondary/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="glass h-fit rounded-4xl p-4 lg:sticky lg:top-6 lg:w-64">
          <div className="flex items-center gap-2.5 px-2 pb-4">
            <img src={state.branding.mark} alt="الشعار" className="size-8 object-contain" />
            <span className="font-display text-sm font-extrabold">لوحة الإدارة</span>
          </div>
          <nav className="flex flex-row gap-1.5 overflow-x-auto lg:flex-col">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: "exact" in n && n.exact }}
                activeProps={{ className: "bg-primary text-primary-foreground" }}
                className="tap-pulse flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold text-secondary-foreground"
              >
                <n.icon className="size-4" />
                {n.label}
              </Link>
            ))}
            <Link
              to="/"
              className="tap-pulse flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-sm text-muted-foreground"
            >
              <Home className="size-4" /> عودة للمتجر
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

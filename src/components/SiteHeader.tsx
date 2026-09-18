import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { useStore } from "@/lib/store";

const links = [
  { label: "الرئيسية", to: "/" },
  { label: "الفئات", to: "/categories" },
  { label: "المنتجات", to: "/products" },
  { label: "العروض", to: "/offers" },
  { label: "من نحن", to: "/about" },
  { label: "التواصل", to: "/info" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { state, cartCount, setIsCartOpen } = useStore();
  const topOffer = state.offers[0];

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Announcement Bar */}
      {topOffer && (
        <div className="bg-foreground px-4 py-2 text-center text-xs font-bold text-background sm:text-sm">
          {topOffer.title} - {topOffer.discount}
        </div>
      )}

      <nav className="glass flex w-full items-center justify-between px-4 py-3 sm:px-6">
        <div className="hidden flex-1 items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-foreground font-bold" }}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex-1 lg:hidden"></div>

        <div className="flex flex-1 justify-center">
          <Link to="/" className="tap-pulse flex items-center justify-center">
            <img src={state.branding.mark} alt="شعار المتجر" className="h-12 w-auto object-contain sm:h-14" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1.5">
          <Link
            to="/products"
            aria-label="بحث"
            className="tap-pulse grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground"
          >
            <Search className="size-4" />
          </Link>
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="السلة"
            className="tap-pulse relative grid size-9 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <ShoppingBag className="size-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 grid size-5 place-items-center rounded-full bg-foreground text-[0.62rem] font-bold text-background">
                {cartCount}
              </span>
            )}
          </button>
          <button
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
            className="tap-pulse grid size-9 place-items-center rounded-full bg-secondary text-secondary-foreground lg:hidden"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </nav>

      <motion.div
        initial={false}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-6xl overflow-hidden lg:hidden"
      >
        <div className="glass mt-2 flex flex-col gap-1 rounded-3xl p-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="tap-pulse rounded-2xl px-4 py-3 text-sm text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="tap-pulse rounded-2xl px-4 py-3 text-sm text-muted-foreground"
          >
            لوحة الإدارة
          </Link>
        </div>
      </motion.div>
    </header>
  );
}

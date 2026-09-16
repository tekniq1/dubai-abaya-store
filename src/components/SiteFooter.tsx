import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Settings } from "lucide-react";

import { useStore, whatsappLink } from "@/lib/store";

export function SiteFooter() {
  const { state } = useStore();

  return (
    <footer className="mx-auto max-w-6xl px-5 pb-10">
      <div className="glass flex flex-col items-center justify-between gap-5 rounded-3xl px-6 py-6 sm:flex-row">
        <img
          src={state.branding.logo}
          alt="شعار المتجر"
          loading="lazy"
          className="h-16 w-auto object-contain"
        />

        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href={whatsappLink(state.info.whatsapp, "مرحباً، لدي استفسار عن العبايات")}
            target="_blank"
            rel="noreferrer"
            className="tap-pulse glass flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-accent-foreground"
          >
            <MessageCircle className="size-4" /> واتساب
          </a>
          <a
            href={`https://instagram.com/${state.info.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="tap-pulse glass flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-accent-foreground"
          >
            <Instagram className="size-4" /> إنستغرام
          </a>
          <Link
            to="/admin"
            className="tap-pulse glass flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-accent-foreground"
          >
            <Settings className="size-4" /> الإدارة
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">© ٢٠٢٦ جميع الحقوق محفوظة · دبي</p>
      </div>
    </footer>
  );
}

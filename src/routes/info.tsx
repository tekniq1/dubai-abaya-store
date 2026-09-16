import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Clock, Copy, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/PageShell";
import { useStore, whatsappLink } from "@/lib/store";

export const Route = createFileRoute("/info")({
  head: () => ({
    meta: [
      { title: "التواصل والمعلومات · Dubai Abaya" },
      {
        name: "description",
        content: "واتساب، إنستغرام، البريد، ساعات العمل، والحسابات البنكية للتحويل في Dubai Abaya.",
      },
      { property: "og:title", content: "التواصل · Dubai Abaya" },
      { property: "og:description", content: "كل طرق التواصل وبيانات الدفع البنكي." },
    ],
  }),
  component: InfoPage,
});

function InfoPage() {
  const { state } = useStore();
  const [copied, setCopied] = useState<string | null>(null);
  const { info } = state;

  const copy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <PageShell
      eyebrow="Contact"
      title="التواصل والمعلومات"
      subtitle="نحن قريبون منك في كل خطوة، اختاري الطريقة الأنسب للتواصل."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong flex flex-col gap-3 rounded-4xl p-7"
        >
          <h2 className="font-display text-lg font-bold">قنوات التواصل</h2>
          <a
            href={whatsappLink(info.whatsapp, "مرحباً Dubai Abaya، لدي استفسار")}
            target="_blank"
            rel="noreferrer"
            className="tap-pulse flex items-center gap-3 rounded-3xl bg-background/70 px-4 py-3.5 text-sm"
          >
            <MessageCircle className="size-4 text-primary" /> واتساب · +{info.whatsapp}
          </a>
          <a
            href={`https://instagram.com/${info.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="tap-pulse flex items-center gap-3 rounded-3xl bg-background/70 px-4 py-3.5 text-sm"
          >
            <Instagram className="size-4 text-primary" /> إنستغرام · @{info.instagram}
          </a>
          <a
            href={`mailto:${info.email}`}
            className="tap-pulse flex items-center gap-3 rounded-3xl bg-background/70 px-4 py-3.5 text-sm"
          >
            <Mail className="size-4 text-primary" /> {info.email}
          </a>
          <p className="flex items-center gap-3 rounded-3xl bg-background/70 px-4 py-3.5 text-sm">
            <MapPin className="size-4 text-primary" /> {info.address}
          </p>
          <p className="flex items-center gap-3 rounded-3xl bg-background/70 px-4 py-3.5 text-sm">
            <Clock className="size-4 text-primary" /> {info.hours}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-strong flex flex-col gap-3 rounded-4xl p-7"
        >
          <h2 className="font-display text-lg font-bold">الحسابات البنكية</h2>
          <p className="text-xs text-muted-foreground">
            بعد التحويل أرسلي صورة الإيصال على واتساب لتأكيد الطلب.
          </p>
          {info.banks.map((b) => (
            <div key={b.id} className="rounded-3xl bg-background/70 p-4">
              <p className="flex items-center gap-2 text-sm font-bold">
                <Building2 className="size-4 text-primary" /> {b.bank}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{b.holder}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs tracking-wider" dir="ltr">
                  {b.iban}
                </span>
                <button
                  onClick={() => copy(b.iban, b.id)}
                  className="tap-pulse flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[0.7rem] font-semibold text-secondary-foreground"
                >
                  <Copy className="size-3.5" /> {copied === b.id ? "تم النسخ" : "نسخ"}
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </PageShell>
  );
}

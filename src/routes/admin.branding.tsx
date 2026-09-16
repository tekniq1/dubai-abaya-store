import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Upload } from "lucide-react";

import { AdminButton, AdminCard, readImageFile } from "@/components/admin/AdminUI";
import { useStore } from "@/lib/store";
import defaultLogo from "@/assets/logo.png";
import defaultMark from "@/assets/logo-mark.png";

export const Route = createFileRoute("/admin/branding")({
  component: AdminBranding,
});

function AdminBranding() {
  const { state, update } = useStore();
  const { branding } = state;

  const slots = [
    {
      key: "logo" as const,
      label: "الشعار الكامل (الفوتر)",
      value: branding.logo,
      fallback: defaultLogo,
    },
    {
      key: "mark" as const,
      label: "الشعار المصغّر (الهيدر والمجسم ثلاثي الأبعاد)",
      value: branding.mark,
      fallback: defaultMark,
    },
  ];

  return (
    <AdminCard title="الشعار والهوية">
      <div className="grid gap-5 sm:grid-cols-2">
        {slots.map((s) => (
          <div key={s.key} className="rounded-3xl bg-background/80 p-5">
            <p className="text-sm font-bold">{s.label}</p>
            <div className="fairy-bg mt-4 grid h-40 place-items-center rounded-2xl">
              <img src={s.value} alt={s.label} className="max-h-32 object-contain" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label className="tap-pulse flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground">
                <Upload className="size-3.5" /> رفع صورة
                <input
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f)
                      readImageFile(f, (url) =>
                        update({ branding: { ...branding, [s.key]: url } }),
                      );
                  }}
                />
              </label>
              <AdminButton
                tone="ghost"
                onClick={() => update({ branding: { ...branding, [s.key]: s.fallback } })}
              >
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="size-3.5" /> الشعار الأصلي
                </span>
              </AdminButton>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        يُفضّل شعار PNG بخلفية شفافة لأفضل ظهور داخل الهالة الزجاجية.
      </p>
    </AdminCard>
  );
}

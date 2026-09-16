import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";

import { AdminButton, AdminCard, Field } from "@/components/admin/AdminUI";
import { uid, useStore, type SiteInfo } from "@/lib/store";

export const Route = createFileRoute("/admin/info")({
  component: AdminInfo,
});

function AdminInfo() {
  const { state, update } = useStore();
  const { info } = state;

  const setInfo = (patch: Partial<SiteInfo>) => update({ info: { ...info, ...patch } });

  return (
    <div className="flex flex-col gap-6">
      <AdminCard title="معلومات المتجر والتواصل">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم المتجر" value={info.storeName} onChange={(v) => setInfo({ storeName: v })} />
          <Field
            label="رقم واتساب (بصيغة دولية)"
            dir="ltr"
            value={info.whatsapp}
            onChange={(v) => setInfo({ whatsapp: v })}
          />
          <Field
            label="حساب إنستغرام"
            dir="ltr"
            value={info.instagram}
            onChange={(v) => setInfo({ instagram: v })}
          />
          <Field label="البريد الإلكتروني" dir="ltr" value={info.email} onChange={(v) => setInfo({ email: v })} />
          <Field label="العنوان" value={info.address} onChange={(v) => setInfo({ address: v })} />
          <Field label="ساعات العمل" value={info.hours} onChange={(v) => setInfo({ hours: v })} />
          <div className="sm:col-span-2">
            <Field label="نبذة من نحن" area value={info.about} onChange={(v) => setInfo({ about: v })} />
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="الحسابات البنكية"
        action={
          <AdminButton
            onClick={() =>
              setInfo({
                banks: [...info.banks, { id: uid(), bank: "بنك جديد", holder: "الاسم", iban: "" }],
              })
            }
          >
            <span className="flex items-center gap-1.5">
              <Plus className="size-3.5" /> إضافة بنك
            </span>
          </AdminButton>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {info.banks.map((b) => (
            <div key={b.id} className="rounded-3xl bg-background/80 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{b.bank}</p>
                <AdminButton
                  tone="danger"
                  onClick={() => setInfo({ banks: info.banks.filter((x) => x.id !== b.id) })}
                >
                  <Trash2 className="size-3.5" />
                </AdminButton>
              </div>
              <div className="mt-4 grid gap-3">
                <Field
                  label="اسم البنك"
                  value={b.bank}
                  onChange={(v) =>
                    setInfo({ banks: info.banks.map((x) => (x.id === b.id ? { ...x, bank: v } : x)) })
                  }
                />
                <Field
                  label="صاحب الحساب"
                  value={b.holder}
                  onChange={(v) =>
                    setInfo({ banks: info.banks.map((x) => (x.id === b.id ? { ...x, holder: v } : x)) })
                  }
                />
                <Field
                  label="رقم الحساب أو IBAN"
                  dir="ltr"
                  value={b.iban}
                  onChange={(v) =>
                    setInfo({ banks: info.banks.map((x) => (x.id === b.id ? { ...x, iban: v } : x)) })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        title="المحافظ الإلكترونية"
        action={
          <AdminButton
            onClick={() =>
              setInfo({
                wallets: [...(info.wallets || []), { id: uid(), name: "محفظة جديدة", number: "" }],
              })
            }
          >
            <span className="flex items-center gap-1.5">
              <Plus className="size-3.5" /> إضافة محفظة
            </span>
          </AdminButton>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {(info.wallets || []).map((w) => (
            <div key={w.id} className="rounded-3xl bg-background/80 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">{w.name}</p>
                <AdminButton
                  tone="danger"
                  onClick={() => setInfo({ wallets: info.wallets.filter((x) => x.id !== w.id) })}
                >
                  <Trash2 className="size-3.5" />
                </AdminButton>
              </div>
              <div className="mt-4 grid gap-3">
                <Field
                  label="اسم المحفظة (مثال: جوالي)"
                  value={w.name}
                  onChange={(v) =>
                    setInfo({ wallets: info.wallets.map((x) => (x.id === w.id ? { ...x, name: v } : x)) })
                  }
                />
                <Field
                  label="رقم الإيداع"
                  dir="ltr"
                  value={w.number}
                  onChange={(v) =>
                    setInfo({ wallets: info.wallets.map((x) => (x.id === w.id ? { ...x, number: v } : x)) })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

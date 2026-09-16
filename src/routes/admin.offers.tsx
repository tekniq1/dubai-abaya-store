import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";

import { AdminButton, AdminCard, Field } from "@/components/admin/AdminUI";
import { uid, useStore, type Offer } from "@/lib/store";

export const Route = createFileRoute("/admin/offers")({
  component: AdminOffers,
});

function AdminOffers() {
  const { state, update } = useStore();

  const setOffer = (id: string, patch: Partial<Offer>) =>
    update({ offers: state.offers.map((o) => (o.id === id ? { ...o, ...patch } : o)) });

  return (
    <AdminCard
      title="العروض"
      action={
        <AdminButton
          onClick={() =>
            update({
              offers: [
                ...state.offers,
                { id: uid(), title: "عرض جديد", subtitle: "تفاصيل العرض", discount: 10, code: "NEW10" },
              ],
            })
          }
        >
          <span className="flex items-center gap-1.5">
            <Plus className="size-3.5" /> إضافة عرض
          </span>
        </AdminButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {state.offers.map((o) => (
          <div key={o.id} className="rounded-3xl bg-background/80 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">{o.title}</p>
              <AdminButton
                tone="danger"
                onClick={() => update({ offers: state.offers.filter((x) => x.id !== o.id) })}
              >
                <Trash2 className="size-3.5" />
              </AdminButton>
            </div>
            <div className="mt-4 grid gap-3">
              <Field label="العنوان" value={o.title} onChange={(v) => setOffer(o.id, { title: v })} />
              <Field
                label="الوصف"
                area
                value={o.subtitle}
                onChange={(v) => setOffer(o.id, { subtitle: v })}
              />
              <Field
                label="نسبة الخصم %"
                type="number"
                value={o.discount}
                onChange={(v) => setOffer(o.id, { discount: Number(v) || 0 })}
              />
              <Field
                label="كود الخصم"
                dir="ltr"
                value={o.code}
                onChange={(v) => setOffer(o.id, { code: v.toUpperCase() })}
              />
              <label className="block">
                <span className="text-xs text-muted-foreground">مرتبط بمنتج</span>
                <select
                  value={o.productId ?? ""}
                  onChange={(e) => setOffer(o.id, { productId: e.target.value || undefined })}
                  className="mt-1.5 w-full rounded-2xl bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">بدون</option>
                  {state.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

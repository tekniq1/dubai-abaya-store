import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";

import { AdminButton, AdminCard, Field, readImageFile } from "@/components/admin/AdminUI";
import { uid, useStore, type Product } from "@/lib/store";
import abayaFallback from "@/assets/abaya-1.jpg";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { state, update } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  const setProduct = (id: string, patch: Partial<Product>) =>
    update({ products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

  const addProduct = () => {
    const id = uid();
    update({
      products: [
        {
          id,
          name: "قطعة جديدة",
          tag: "جديد",
          price: 1000,
          image: abayaFallback,
          categoryId: state.categories[0]?.id ?? "abayas",
          description: "وصف القطعة...",
          stock: 5,
          sizes: ["S", "M", "L"],
          styles: [],
        },
        ...state.products,
      ],
    });
    setOpenId(id);
  };

  return (
    <AdminCard
      title="المنتجات والمخزون"
      action={
        <AdminButton onClick={addProduct}>
          <span className="flex items-center gap-1.5">
            <Plus className="size-3.5" /> إضافة منتج
          </span>
        </AdminButton>
      }
    >
      <div className="flex flex-col gap-3">
        {state.products.map((p) => (
          <div key={p.id} className="rounded-3xl bg-background/80 p-4">
            <div className="flex items-center gap-4">
              <img src={p.image} alt={p.name} className="size-16 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {state.categories.find((c) => c.id === p.categoryId)?.name ?? "—"} · {p.price} د.إ
                  · مخزون {p.stock}
                </p>
              </div>
              <AdminButton
                tone="ghost"
                onClick={() => setOpenId(openId === p.id ? null : p.id)}
              >
                {openId === p.id ? "إغلاق" : "تعديل"}
              </AdminButton>
              <AdminButton
                tone="danger"
                onClick={() =>
                  update({ products: state.products.filter((x) => x.id !== p.id) })
                }
              >
                <Trash2 className="size-3.5" />
              </AdminButton>
            </div>

            {openId === p.id && (
              <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                <Field label="الاسم" value={p.name} onChange={(v) => setProduct(p.id, { name: v })} />
                <Field label="الوسم" value={p.tag} onChange={(v) => setProduct(p.id, { tag: v })} />
                <Field
                  label="السعر (د.إ)"
                  type="number"
                  value={p.price}
                  onChange={(v) => setProduct(p.id, { price: Number(v) || 0 })}
                />
                <Field
                  label="السعر قبل الخصم"
                  type="number"
                  value={p.oldPrice ?? 0}
                  onChange={(v) => setProduct(p.id, { oldPrice: Number(v) || undefined })}
                />
                <Field
                  label="المخزون"
                  type="number"
                  value={p.stock}
                  onChange={(v) => setProduct(p.id, { stock: Number(v) || 0 })}
                />
                <label className="block">
                  <span className="text-xs text-muted-foreground">الفئة</span>
                  <select
                    value={p.categoryId}
                    onChange={(e) => setProduct(p.id, { categoryId: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {state.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="القياسات (مفصولة بفاصلة)"
                  value={p.sizes.join(", ")}
                  onChange={(v) =>
                    setProduct(p.id, {
                      sizes: v
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
                <div className="sm:col-span-2">
                  <Field
                    label="الوصف"
                    area
                    value={p.description}
                    onChange={(v) => setProduct(p.id, { description: v })}
                  />
                </div>
                
                {/* إدارة التقييمات */}
                <div className="sm:col-span-2 mt-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold">آراء العملاء</p>
                    <AdminButton
                      onClick={() =>
                        setProduct(p.id, {
                          reviews: [
                            { id: uid(), name: "عميل جديد", text: "تقييم رائع جداً", rating: 5, date: Date.now() },
                            ...(p.reviews || []),
                          ],
                        })
                      }
                    >
                      <span className="flex items-center gap-1.5">
                        <Plus className="size-3.5" /> إضافة تقييم
                      </span>
                    </AdminButton>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(p.reviews || []).map((r) => (
                      <div key={r.id} className="rounded-2xl bg-background/50 p-4 relative">
                        <button
                          onClick={() => setProduct(p.id, { reviews: p.reviews!.filter((x) => x.id !== r.id) })}
                          className="absolute top-4 left-4 text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <div className="grid gap-3 pr-8">
                          <Field
                            label="اسم العميل"
                            value={r.name}
                            onChange={(v) =>
                              setProduct(p.id, {
                                reviews: p.reviews!.map((x) => (x.id === r.id ? { ...x, name: v } : x)),
                              })
                            }
                          />
                          <Field
                            label="التقييم (1-5)"
                            type="number"
                            value={r.rating}
                            onChange={(v) =>
                              setProduct(p.id, {
                                reviews: p.reviews!.map((x) =>
                                  x.id === r.id ? { ...x, rating: Math.min(5, Math.max(1, Number(v) || 5)) } : x
                                ),
                              })
                            }
                          />
                          <Field
                            label="التعليق"
                            area
                            value={r.text}
                            onChange={(v) =>
                              setProduct(p.id, {
                                reviews: p.reviews!.map((x) => (x.id === r.id ? { ...x, text: v } : x)),
                              })
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <label className="tap-pulse flex w-fit cursor-pointer items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-xs font-bold text-secondary-foreground">
                    <Upload className="size-3.5" /> تغيير الصورة
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) readImageFile(f, (url) => setProduct(p.id, { image: url }));
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Upload } from "lucide-react";

import { AdminButton, AdminCard, Field, readImageFile } from "@/components/admin/AdminUI";
import { uid, useStore, type Category } from "@/lib/store";
import fallback from "@/assets/abaya-2.jpg";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { state, update } = useStore();

  const setCategory = (id: string, patch: Partial<Category>) =>
    update({ categories: state.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  return (
    <AdminCard
      title="الفئات"
      action={
        <AdminButton
          onClick={() =>
            update({
              categories: [
                ...state.categories,
                { id: uid(), name: "فئة جديدة", description: "وصف الفئة", image: fallback },
              ],
            })
          }
        >
          <span className="flex items-center gap-1.5">
            <Plus className="size-3.5" /> إضافة فئة
          </span>
        </AdminButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {state.categories.map((c) => (
          <div key={c.id} className="rounded-3xl bg-background/80 p-4">
            <div className="flex items-center gap-3">
              <img src={c.image} alt={c.name} className="size-14 rounded-2xl object-cover" />
              <p className="flex-1 text-sm font-bold">{c.name}</p>
              <AdminButton
                tone="danger"
                onClick={() =>
                  update({ categories: state.categories.filter((x) => x.id !== c.id) })
                }
              >
                <Trash2 className="size-3.5" />
              </AdminButton>
            </div>
            <div className="mt-4 grid gap-3">
              <Field label="الاسم" value={c.name} onChange={(v) => setCategory(c.id, { name: v })} />
              <Field
                label="الوصف"
                area
                value={c.description}
                onChange={(v) => setCategory(c.id, { description: v })}
              />
              <label className="tap-pulse flex w-fit cursor-pointer items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-xs font-bold text-secondary-foreground">
                <Upload className="size-3.5" /> تغيير الصورة
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) readImageFile(f, (url) => setCategory(c.id, { image: url }));
                  }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

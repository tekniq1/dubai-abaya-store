import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

type ProductSearch = { category?: string | undefined; style?: string | undefined };

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    style: typeof search["style"] === "string" ? search["style"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "المنتجات · Dubai Abaya" },
      {
        name: "description",
        content: "تسوّقي عبايات وجلابيات Dubai Abaya مع البحث والتصفية حسب الفئة والنمط والسعر.",
      },
      { property: "og:title", content: "منتجات Dubai Abaya" },
      { property: "og:description", content: "مجموعة كاملة من العبايات والجلابيات الفاخرة." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { state } = useStore();
  const { category, style } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const [q, setQ] = useState("");

  const list = state.products.filter((p) => {
    const matchCategory = !category || p.categoryId === category;
    const matchStyle = !style || p.styles?.includes(style);
    const matchQ = p.name.includes(q.trim());
    return matchCategory && matchStyle && matchQ;
  });

  const availableStyles = Array.from(
    new Set(
      state.products
        .filter((p) => !category || p.categoryId === category)
        .flatMap((p) => p.styles || [])
    )
  );

  return (
    <PageShell
      eyebrow="Shop"
      title="المنتجات"
      subtitle="قطع محدودة تُصنع بعناية، اختاري القياس وأضيفيها إلى السلة."
    >
      <div className="glass mb-8 flex flex-col gap-4 rounded-3xl p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-background/70 px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحثي عن عباية..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate({ search: {} })}
              className={`tap-pulse rounded-full px-4 py-2 text-xs font-semibold ${
                !category ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              الكل
            </button>
            {state.categories.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate({ search: { category: c.id } })}
                className={`tap-pulse rounded-full px-4 py-2 text-xs font-semibold ${
                  category === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {availableStyles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
            <span className="px-2 text-xs text-muted-foreground">التصميم:</span>
            <button
              onClick={() => navigate({ search: { category, style: undefined } })}
              className={`tap-pulse rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                !style
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground border border-border shadow-sm"
              }`}
            >
              الكل
            </button>
            {availableStyles.map((s) => (
              <button
                key={s}
                onClick={() => navigate({ search: { category, style: s } })}
                className={`tap-pulse rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  style === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground border border-border shadow-sm"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <p className="glass rounded-3xl p-10 text-center text-sm text-muted-foreground">
          لا توجد نتائج مطابقة.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

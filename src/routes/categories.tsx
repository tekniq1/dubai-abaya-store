import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "الفئات · Dubai Abaya" },
      {
        name: "description",
        content: "تصفّحي فئات Dubai Abaya: عبايات، جلابيات، سواريه، وشيلات فاخرة.",
      },
      { property: "og:title", content: "فئات Dubai Abaya" },
      { property: "og:description", content: "عبايات وجلابيات وسواريه وشيلات بتصاميم دبي." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { state } = useStore();

  return (
    <PageShell
      eyebrow="Categories"
      title="الفئات"
      subtitle="كل فئة عالم بصري خاص، اختاري ما يناسب إطلالتك."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {state.categories.map((c, i) => {
          const count = state.products.filter((p) => p.categoryId === c.id).length;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/products"
                search={{ category: c.id }}
                className="group glass tap-pulse block overflow-hidden rounded-4xl p-3"
              >
                <div className="overflow-hidden rounded-3xl bg-secondary">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-64"
                  />
                </div>
                <div className="flex items-end justify-between p-5">
                  <div>
                    <h2 className="font-display text-xl font-bold">{c.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                    <p className="mt-2 text-xs text-primary">{count} قطعة</p>
                  </div>
                  <ArrowLeft className="size-5 text-primary transition-transform group-hover:-translate-x-1" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </PageShell>
  );
}

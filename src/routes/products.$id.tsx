import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { formatAED, useStore, whatsappLink } from "@/lib/store";

export const Route = createFileRoute("/products/$id")({
  head: () => ({
    meta: [
      { title: "تفاصيل القطعة · Dubai Abaya" },
      {
        name: "description",
        content: "تفاصيل القطعة، القياسات المتوفرة، السعر، وإمكانية الطلب عبر واتساب.",
      },
      { property: "og:title", content: "تفاصيل القطعة · Dubai Abaya" },
      { property: "og:description", content: "قماش، قياسات، وسعر القطعة قبل إضافتها للسلة." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { state, addToCart, setIsCartOpen, cartCount } = useStore();
  const product = state.products.find((p) => p.id === id);
  const [size, setSize] = useState<string | null>(null);

  if (!product) {
    return (
      <PageShell title="القطعة غير متوفرة" subtitle="ربما تم حذفها من المجموعة.">
        <div className="text-center">
          <Link
            to="/products"
            className="tap-pulse inline-block rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            عودة للمنتجات
          </Link>
        </div>
      </PageShell>
    );
  }

  const chosen = size ?? product.sizes[0] ?? "M";
  const category = state.categories.find((c) => c.id === product.categoryId);

  // Recommendation tracking algorithm
  const similarProducts = state.products
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.categoryId === product.categoryId) score += 2;
      const sharedStyles = p.styles?.filter((s) => product.styles?.includes(s)) || [];
      score += sharedStyles.length;
      return { product: p, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product)
    .slice(0, 4);

  return (
    <PageShell eyebrow={category?.name ?? "Dubai Abaya"} title={product.name}>
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass overflow-hidden rounded-4xl p-3"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-[24rem] w-full rounded-3xl object-cover sm:h-[32rem]"
          />
        </motion.div>

        <div className="glass-strong flex flex-col rounded-4xl p-7">
          <span className="glass w-fit rounded-full px-4 py-1.5 text-[0.7rem] tracking-widest text-accent-foreground">
            {product.tag}
          </span>
          <p className="font-display mt-5 text-3xl font-extrabold text-gradient">
            {formatAED(product.price)}
          </p>
          {product.oldPrice && (
            <p className="mt-1 text-sm text-muted-foreground line-through">
              {formatAED(product.oldPrice)}
            </p>
          )}
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <p className="mt-6 text-xs tracking-widest text-primary uppercase">القياس</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`tap-pulse min-w-12 rounded-2xl px-4 py-2.5 text-sm font-bold ${
                  chosen === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            {product.stock > 0 ? `متوفر · ${product.stock} قطعة في المخزون` : "غير متوفر حالياً"}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => {
                addToCart(product.id, chosen);
                setIsCartOpen(true);
              }}
              disabled={product.stock === 0}
              className="tap-pulse flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-50"
            >
              <ShoppingBag className="size-4" /> إضافة للسلة
            </button>
            <a
              href={whatsappLink(
                state.info.whatsapp,
                `أرغب بطلب: ${product.name} (${chosen}) بسعر ${formatAED(product.price)}`,
              )}
              target="_blank"
              rel="noreferrer"
              className="tap-pulse glass flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-accent-foreground"
            >
              <MessageCircle className="size-4" /> اطلبي عبر واتساب
            </a>
          </div>

          {cartCount > 0 && (
            <button onClick={() => setIsCartOpen(true)} className="mt-5 text-xs text-primary underline text-right">
              لديك {cartCount} قطعة في السلة
            </button>
          )}
        </div>
      </div>

      {(product.reviews && product.reviews.length > 0) && (
        <div className="mt-16 rounded-4xl bg-secondary/50 p-8">
          <h2 className="font-display text-xl font-bold mb-6">آراء العملاء</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((r) => (
              <div key={r.id} className="glass rounded-3xl p-5">
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`size-4 ${i < r.rating ? "fill-current" : "text-border fill-transparent"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-foreground/90 font-medium leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                  <span className="font-bold">{r.name}</span>
                  <span dir="ltr">{new Date(r.date).toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {similarProducts.length > 0 && (
        <div className="mt-24 border-t border-border/40 pt-16">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl font-bold">منتجات مشابهة قد تعجبك</h2>
            <p className="mt-2 text-sm text-muted-foreground">استكشفي تشكيلة تتماشى مع ذوقك</p>
          </motion.header>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similarProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}

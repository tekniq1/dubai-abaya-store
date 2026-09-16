import { Link } from "@tanstack/react-router";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useRef, useState } from "react";

import { formatAED, useStore, type Product } from "@/lib/store";

export type { Product };

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const { addToCart, setIsCartOpen } = useStore();

  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, oklch(1 0 0 / 0.55), transparent 55%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 16);
    rx.set((0.5 - py) * 16);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className="group"
    >
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="glass relative overflow-hidden rounded-3xl p-3 transition-shadow duration-500 hover:shadow-deep"
      >
        <div className="relative overflow-hidden rounded-2xl bg-secondary">
          <Link to="/products/$id" params={{ id: product.id }}>
            <div className="relative flex h-[19rem] w-full overflow-hidden sm:h-[23rem]">
              <motion.img
                src={product.image}
                alt={product.name}
                width={800}
                height={1100}
                loading="lazy"
                className={`h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] ${
                  product.hoverImage ? "w-1/2 border-l border-background/20" : "w-full"
                }`}
                style={{ transform: "translateZ(30px)" }}
              />
              {product.hoverImage && (
                <motion.img
                  src={product.hoverImage}
                  alt={`${product.name} - صورة أخرى`}
                  width={800}
                  height={1100}
                  loading="lazy"
                  className="h-full w-1/2 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  style={{ transform: "translateZ(30px)" }}
                />
              )}
            </div>
          </Link>
          <motion.div
            style={{ backgroundImage: glare }}
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
          />
          <span className="glass-strong absolute top-3 right-3 rounded-full px-3 py-1 text-[0.68rem] font-medium tracking-wide text-accent-foreground">
            {product.tag}
          </span>

          <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => {
                addToCart(product.id, product.sizes[0] ?? "M", 1);
                setAdded(true);
                setIsCartOpen(true);
              }}
              className="tap-pulse glass-strong flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-accent-foreground"
            >
              <ShoppingBag className="size-4" />
              {added ? "تمت الإضافة ✦" : "إضافة للسلة"}
            </button>
          </div>
        </div>

        <div
          className="flex items-center justify-between px-2 pt-4 pb-2"
          style={{ transform: "translateZ(24px)" }}
        >
          <div>
            <h3 className="font-display text-base font-bold">{product.name}</h3>
            <p className="text-xs text-muted-foreground">حرير فاخر · تفصيل دبي</p>
          </div>
          <div className="text-left">
            {product.oldPrice ? (
              <p className="text-[0.68rem] text-muted-foreground line-through">
                {formatAED(product.oldPrice)}
              </p>
            ) : null}
            <p className="font-display text-lg font-extrabold text-gradient">
              {formatAED(product.price)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

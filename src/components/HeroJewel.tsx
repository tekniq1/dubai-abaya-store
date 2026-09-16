import { motion } from "framer-motion";
import { useState } from "react";

import logoFull from "@/assets/logo.png";

export function HeroJewel() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative aspect-square w-full max-w-[420px]"
      style={{ perspective: 1000 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTilt({
          x: ((e.clientY - r.top) / r.height - 0.5) * -12,
          y: ((e.clientX - r.left) / r.width - 0.5) * 12,
        });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="absolute inset-10 rounded-full bg-primary-glow/40 blur-3xl" />

      <motion.img
        src={logoFull}
        alt="شعار Dubai Abaya"
        width={1024}
        height={1024}
        animate={{ y: [-4, 4, -4], rotateX: tilt.x, rotateY: tilt.y }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotateX: { type: "spring", stiffness: 100, damping: 20 },
          rotateY: { type: "spring", stiffness: 100, damping: 20 },
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_12px_24px_oklch(0.6_0.12_300_/_0.2)]"
      />
    </div>
  );
}

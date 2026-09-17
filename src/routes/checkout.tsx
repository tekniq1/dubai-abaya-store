import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, CreditCard, MessageCircle, Truck } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/PageShell";
import { formatAED, useStore, whatsappLink } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب · Dubai Abaya" },
      {
        name: "description",
        content: "أدخلي بياناتك واختاري طريقة الدفع، ثم أرسلي الطلب مباشرة إلى واتساب المتجر.",
      },
      { property: "og:title", content: "إتمام الطلب · Dubai Abaya" },
      { property: "og:description", content: "الدفع عند الاستلام أو تحويل بنكي مع تأكيد واتساب." },
    ],
  }),
  component: CheckoutPage,
});

const methods = [
  { id: "cod", label: "الدفع عند الاستلام", icon: Truck },
  { id: "bank_wallet", label: "دفع بنكي ومحافظ", icon: Banknote },
  { id: "card", label: "بطاقة (قريباً)", icon: CreditCard },
] as const;

function CheckoutPage() {
  const { state, cartDetails, cartTotal, clearCart } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", note: "" });
  const [method, setMethod] = useState<string>("cod");
  const [bankType, setBankType] = useState<"wallet" | "bank">("wallet");
  const [sent, setSent] = useState(false);

  const shipping = cartTotal >= 1500 || cartTotal === 0 ? 0 : 35;
  const grand = cartTotal + shipping;
  const methodLabel = methods.find((m) => m.id === method)?.label ?? "";
  const ready = form.name.trim() !== "" && form.phone.trim() !== "" && cartDetails.length > 0;

  const message = [
    `طلب جديد من ${state.info.storeName}`,
    "",
    ...cartDetails.map(
      (d) => `• ${d.product.name} — قياس ${d.line.size}${d.line.color ? ` — لون ${d.line.color}` : ''} × ${d.line.qty} = ${formatAED(d.total)}`,
    ),
    "",
    `التوصيل: ${shipping === 0 ? "مجاني" : formatAED(shipping)}`,
    `الإجمالي: ${formatAED(grand)}`,
    `طريقة الدفع: ${methodLabel}`,
    "",
    `الاسم: ${form.name}`,
    `الهاتف: ${form.phone}`,
    `المدينة: ${form.city}`,
    `العنوان: ${form.address}`,
    form.note ? `ملاحظات: ${form.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const field = (
    key: keyof typeof form,
    label: string,
    opts?: { area?: boolean; dir?: "ltr" | "rtl" },
  ) => (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      {opts?.area ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          rows={3}
          className="mt-1.5 w-full rounded-2xl bg-background/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <input
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          dir={opts?.dir ?? "rtl"}
          className="mt-1.5 w-full rounded-2xl bg-background/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </label>
  );

  if (sent) {
    return (
      <PageShell title="تم إرسال طلبك" subtitle="سنؤكد التفاصيل معك عبر واتساب قريباً.">
        <div className="glass rounded-4xl p-12 text-center">
          <MessageCircle className="mx-auto size-8 text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">شكراً لثقتك بـ Dubai Abaya ✦</p>
          <Link
            to="/products"
            className="tap-pulse mt-6 inline-block rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground"
          >
            متابعة التسوق
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Checkout"
      title="إتمام الطلب"
      subtitle="بياناتك تُرسل مباشرة إلى واتساب المتجر لتأكيد الطلب."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-strong rounded-4xl p-7">
          <h2 className="font-display text-lg font-bold">بيانات التوصيل</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {field("name", "الاسم الكامل")}
            {field("phone", "رقم الهاتف", { dir: "ltr" })}
            {field("city", "المدينة")}
            {field("address", "العنوان")}
          </div>
          <div className="mt-4">{field("note", "ملاحظات (اختياري)", { area: true })}</div>

          <h2 className="font-display mt-7 text-lg font-bold">طريقة الدفع</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                disabled={m.id === "card"}
                className={`tap-pulse flex flex-col items-center gap-2 rounded-3xl px-4 py-5 text-xs font-semibold disabled:opacity-45 ${
                  method === m.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <m.icon className="size-4" />
                {m.label}
              </button>
            ))}
          </div>

          {method === "bank_wallet" && (
            <div className="mt-5 space-y-4 rounded-3xl bg-background/70 p-5">
              <div className="flex rounded-2xl bg-secondary/50 p-1">
                <button
                  onClick={() => setBankType("wallet")}
                  className={`tap-pulse flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    bankType === "wallet" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  المحافظ الإلكترونية
                </button>
                <button
                  onClick={() => setBankType("bank")}
                  className={`tap-pulse flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                    bankType === "bank" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  الحسابات البنكية
                </button>
              </div>

              {bankType === "wallet" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    حوّلي المبلغ لأحد المحافظ التالية وأرسلي رقم الحوالة على واتساب:
                  </p>
                  {(state.info.wallets || []).map((w) => (
                    <div key={w.id} className="flex justify-between rounded-2xl bg-background/50 px-4 py-3 text-sm">
                      <span className="font-bold">{w.name}</span>
                      <span className="font-medium tracking-wide text-primary" dir="ltr">{w.number}</span>
                    </div>
                  ))}
                </div>
              )}

              {bankType === "bank" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    حوّلي المبلغ إلى أحد الحسابات التالية وأرسلي الإيصال على واتساب:
                  </p>
                  {(state.info.banks || []).map((b) => (
                    <div key={b.id} className="rounded-2xl bg-background/50 p-4 text-sm">
                      <p className="font-bold">{b.bank}</p>
                      <div className="mt-2 flex justify-between text-xs">
                        <span className="text-muted-foreground">{b.holder}</span>
                        <span className="font-medium tracking-wider text-primary" dir="ltr">{b.iban}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="glass-strong h-fit rounded-4xl p-7">
          <h2 className="font-display text-lg font-bold">ملخص</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {cartDetails.map((d) => (
              <li key={`${d.line.productId}-${d.line.size}-${d.line.color || 'none'}`} className="flex flex-col gap-1">
                <div className="flex justify-between gap-3">
                  <span className="text-foreground font-semibold">
                    {d.product.name} × {d.line.qty}
                  </span>
                  <span className="font-bold">{formatAED(d.total)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>القياس: {d.line.size}</span>
                  {d.line.color && (
                    <>
                      <span>·</span>
                      <span>اللون: {d.line.color}</span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-3">
            <span className="font-bold">الإجمالي</span>
            <span className="font-display text-lg font-extrabold text-gradient">
              {formatAED(grand)}
            </span>
          </div>

          <a
            href={ready ? whatsappLink(state.info.whatsapp, message) : undefined}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              if (!ready) return;
              clearCart();
              setSent(true);
            }}
            aria-disabled={!ready}
            className={`tap-pulse mt-7 flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold ${
              ready
                ? "bg-primary text-primary-foreground"
                : "pointer-events-none bg-secondary text-muted-foreground"
            }`}
          >
            <MessageCircle className="size-4" /> إرسال الطلب عبر واتساب
          </a>
          {!ready && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              أكملي الاسم ورقم الهاتف وتأكدي أن السلة غير فارغة.
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}

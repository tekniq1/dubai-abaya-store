import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Crown, Dices, Send, Ticket, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminButton, AdminCard, Field } from "@/components/admin/AdminUI";
import { LotteryCountdown } from "@/components/LotteryEntry";
import { useCountdown, winnerMessage } from "@/lib/lottery";
import { useStore, whatsappLink, type LotteryWinner } from "@/lib/store";

export const Route = createFileRoute("/admin/lottery")({
  component: AdminLottery,
});

const medals = ["🥇", "🥈", "🥉"];

function AdminLottery() {
  const { state, updateLottery, runDraw } = useStore();
  const { tickets, rounds, locked, settings } = state.lottery;
  const [confirm, setConfirm] = useState(false);
  const { done } = useCountdown();

  useEffect(() => {
    if (done && !locked && tickets.length) runDraw();
  }, [done, locked, tickets.length, runDraw]);

  const leaderboard = useMemo(() => {
    const map = new Map<string, LotteryWinner & { last: number }>();
    for (const t of tickets) {
      const key = t.whatsapp.replace(/\D/g, "");
      const prev = map.get(key);
      if (prev) {
        prev.cards += 1;
        prev.last = Math.max(prev.last, t.createdAt);
      } else {
        map.set(key, { name: t.name, whatsapp: t.whatsapp, cards: 1, last: t.createdAt });
      }
    }
    return [...map.values()].sort((a, b) => b.cards - a.cards);
  }, [tickets]);

  const current = rounds[0];
  const status = locked ? (current ? "مكتمل" : "جاري السحب") : "نشط";

  const kpis = [
    { icon: Ticket, label: "الكروت المسجلة هذا الأسبوع", value: String(tickets.length) },
    { icon: Users, label: "عدد المشتركين", value: String(leaderboard.length) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="glass tap-pulse rounded-3xl p-5">
            <k.icon className="size-4 text-primary" />
            <p className="font-display mt-3 text-2xl font-extrabold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
        <div className="glass tap-pulse rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">السحب القادم · الجمعة ٤:٢٠م</p>
            <span className="flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-[10px] font-bold text-primary">
              <span className="size-1.5 animate-ping rounded-full bg-primary" />
              {status}
            </span>
          </div>
          <LotteryCountdown compact />
        </div>
      </div>

      <AdminCard title="التشغيل اليدوي للطوارئ">
        <p className="text-xs text-muted-foreground">
          استخدمي هذا الزر فقط إذا لم يُنفّذ السحب تلقائياً في وقته. سيتم تجميد التسجيل وإغلاق
          الجولة فوراً.
        </p>
        <button
          onClick={() => setConfirm(true)}
          className="tap-pulse mt-4 flex items-center gap-2 rounded-full bg-destructive px-6 py-3 text-xs font-bold text-destructive-foreground"
        >
          <AlertTriangle className="size-4" /> تشغيل السحب يدوياً الآن ⚠️
        </button>
        {locked && (
          <button
            onClick={() => updateLottery({ locked: false })}
            className="tap-pulse mt-3 block rounded-full bg-secondary px-5 py-2.5 text-xs font-bold"
          >
            بدء جولة جديدة (فتح التسجيل)
          </button>
        )}
      </AdminCard>

      <AdminCard title="جدول المتصدرين اللحظي · الجائزة الأولى">
        {leaderboard.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد كروت مسجّلة بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="p-3">الترتيب</th>
                  <th className="p-3">المشترك</th>
                  <th className="p-3">الواتساب</th>
                  <th className="p-3">الكروت</th>
                  <th className="p-3">آخر كود</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((r, i) => (
                  <tr
                    key={r.whatsapp}
                    className={`rounded-2xl ${i === 0 ? "bg-[#E9C877]/20" : "bg-background/70"}`}
                  >
                    <td className="p-3 font-bold">{medals[i] ?? i + 1}</td>
                    <td className="p-3 font-semibold">{r.name}</td>
                    <td className="p-3 text-xs" dir="ltr">
                      {r.whatsapp}
                    </td>
                    <td className="p-3 font-display font-extrabold">{r.cards}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(r.last).toLocaleString("ar-AE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {current && (
        <AdminCard title="الفائزون · إشعار الواتساب">
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                { w: current.topWinner, kind: "top" as const, title: "الجائزة الأولى", icon: Crown },
                {
                  w: current.randomWinner,
                  kind: "random" as const,
                  title: "السحب العشوائي",
                  icon: Dices,
                },
              ] as const
            ).map(
              ({ w, kind, title, icon: Icon }) =>
                w && (
                  <div key={kind} className="rounded-3xl bg-background/80 p-5">
                    <p className="flex items-center gap-2 text-xs font-bold text-primary">
                      <Icon className="size-4" /> {title}
                    </p>
                    <p className="font-display mt-2 text-lg font-extrabold">{w.name}</p>
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      {w.whatsapp}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{w.cards} كرت</p>
                    <a
                      href={whatsappLink(w.whatsapp, winnerMessage(w.name, kind))}
                      target="_blank"
                      rel="noreferrer"
                      className="tap-pulse mt-4 flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-bold text-primary-foreground"
                    >
                      <Send className="size-4" /> إرسال إشعار الفوز عبر الواتساب
                    </a>
                  </div>
                ),
            )}
          </div>
        </AdminCard>
      )}

      <AdminCard title="إعدادات WhatsApp Cloud API">
        <label className="flex items-center justify-between rounded-2xl bg-background/80 px-4 py-3 text-sm">
          <span>تفعيل الإرسال التلقائي عبر WhatsApp Cloud API</span>
          <input
            type="checkbox"
            checked={settings.autoSend}
            onChange={(e) =>
              updateLottery({ settings: { ...settings, autoSend: e.target.checked } })
            }
            className="size-5 accent-[oklch(0.72_0.09_300)]"
          />
        </label>
        {settings.autoSend && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="API Key"
              value={settings.apiKey}
              onChange={(v) => updateLottery({ settings: { ...settings, apiKey: v } })}
            />
            <Field
              label="Phone Number ID"
              value={settings.phoneNumberId}
              onChange={(v) => updateLottery({ settings: { ...settings, phoneNumberId: v } })}
            />
          </div>
        )}
      </AdminCard>

      <AdminCard title="أرشيف السحوبات السابقة">
        {rounds.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد سحوبات سابقة.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="p-3">تاريخ الجولة</th>
                  <th className="p-3">الفائز الأول</th>
                  <th className="p-3">الفائز العشوائي</th>
                  <th className="p-3">الكروت</th>
                  <th className="p-3">حالة التسليم</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((r) => (
                  <tr key={r.id} className="bg-background/70">
                    <td className="p-3 text-xs">{new Date(r.drawnAt).toLocaleString("ar-AE")}</td>
                    <td className="p-3">{r.topWinner?.name ?? "—"}</td>
                    <td className="p-3">{r.randomWinner?.name ?? "—"}</td>
                    <td className="p-3">{r.totalCards}</td>
                    <td className="p-3">
                      <select
                        value={r.delivery}
                        onChange={(e) =>
                          updateLottery({
                            rounds: rounds.map((x) =>
                              x.id === r.id
                                ? { ...x, delivery: e.target.value as "contact" | "delivered" }
                                : x,
                            ),
                          })
                        }
                        className="rounded-xl bg-background px-3 py-2 text-xs outline-none"
                      >
                        <option value="contact">قيد التواصل</option>
                        <option value="delivered">تم التسليم</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={() => setConfirm(false)}
        >
          <div
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-sm rounded-4xl p-6 text-center"
          >
            <button
              onClick={() => setConfirm(false)}
              className="tap-pulse absolute top-4 left-4 rounded-full bg-secondary p-2"
            >
              <X className="size-4" />
            </button>
            <AlertTriangle className="mx-auto size-7 text-destructive" />
            <p className="font-display mt-3 text-base font-extrabold">
              هل أنت متأكد من تنفيذ السحب يدوياً الآن؟
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              سيتم إغلاق الجولة وتجميد التسجيل الجديد.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <AdminButton
                tone="danger"
                onClick={() => {
                  runDraw();
                  setConfirm(false);
                }}
              >
                نعم، نفّذ السحب
              </AdminButton>
              <AdminButton tone="ghost" onClick={() => setConfirm(false)}>
                إلغاء
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

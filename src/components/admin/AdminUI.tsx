import type { ReactNode } from "react";

export function AdminCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="glass-strong rounded-4xl p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  dir,
  area,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number";
  dir?: "ltr" | "rtl";
  area?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      {area ? (
        <textarea
          value={value}
          rows={3}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-2xl bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <input
          type={type}
          value={value}
          dir={dir}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-2xl bg-background/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </label>
  );
}

export function AdminButton({
  children,
  onClick,
  tone = "primary",
}: {
  children: ReactNode;
  onClick: () => void;
  tone?: "primary" | "ghost" | "danger";
}) {
  const tones = {
    primary: "bg-primary text-primary-foreground",
    ghost: "bg-secondary text-secondary-foreground",
    danger: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <button
      onClick={onClick}
      className={`tap-pulse rounded-full px-5 py-2.5 text-xs font-bold ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function readImageFile(file: File, onDone: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => onDone(String(reader.result));
  reader.readAsDataURL(file);
}

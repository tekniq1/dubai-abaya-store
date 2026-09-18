import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import logoFull from "@/assets/logo.png";
import logoMark from "@/assets/logo-mark.png";
import abaya1 from "@/assets/abaya-1.jpg";
import abaya2 from "@/assets/abaya-2.jpg";
import abaya3 from "@/assets/abaya-3.jpg";
import abaya4 from "@/assets/abaya-4.jpg";

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: number;
};

export type Product = {
  id: string;
  name: string;
  tag: string;
  price: number;
  oldPrice?: number | undefined;
  image: string;
  images?: string[];
  categoryId: string;
  description: string;
  stock: number;
  sizes: string[];
  styles: string[];
  fabric?: string;
  material?: string;
  color?: string;
  colors?: string[];
  discount?: number;
  featured?: boolean;
  hoverImage?: string;
  reviews?: Review[];
};

export type Offer = {
  id: string;
  title: string;
  subtitle: string;
  discount: number;
  code: string;
  productId?: string | undefined;
};

export type BankAccount = {
  id: string;
  bank: string;
  holder: string;
  iban: string;
};

export type WalletAccount = {
  id: string;
  name: string;
  number: string;
};

export type SiteInfo = {
  storeName: string;
  whatsapp: string;
  instagram: string;
  email: string;
  address: string;
  hours: string;
  about: string;
  banks: BankAccount[];
  wallets: WalletAccount[];
};

export type Branding = {
  logo: string;
  mark: string;
};

export type CartLine = {
  productId: string;
  size: string;
  color?: string;
  qty: number;
};

export type LotteryTicket = {
  id: string;
  code: string;
  name: string;
  whatsapp: string;
  createdAt: number;
};

export type LotteryWinner = {
  name: string;
  whatsapp: string;
  cards: number;
};

export type LotteryRound = {
  id: string;
  drawnAt: number;
  totalCards: number;
  topWinner: LotteryWinner | null;
  randomWinner: LotteryWinner | null;
  delivery: "contact" | "delivered";
};

export type LotterySettings = {
  autoSend: boolean;
  apiKey: string;
  phoneNumberId: string;
};

export type LotteryState = {
  tickets: LotteryTicket[];
  rounds: LotteryRound[];
  locked: boolean;
  settings: LotterySettings;
};

type StoreState = {
  categories: Category[];
  products: Product[];
  offers: Offer[];
  info: SiteInfo;
  branding: Branding;
  cart: CartLine[];
  isCartOpen: boolean;
  lottery: LotteryState;
};

const defaultState: StoreState = {
  categories: [
    {
      id: "abayas",
      name: "عبايات",
      description: "قصّات مسائية ويومية بحرير وشيفون فاخر.",
      image: abaya1,
    },
    {
      id: "jalabiyas",
      name: "جلابيات",
      description: "جلابيات مطرزة بلمسات ذهبية ولافندر.",
      image: abaya3,
    },
    {
      id: "evening",
      name: "سواريه",
      description: "إطلالات المناسبات بتفاصيل لامعة.",
      image: abaya2,
    },
    {
      id: "shawls",
      name: "شيلات وأوشحة",
      description: "طبقات ناعمة تكمل الإطلالة.",
      image: abaya4,
    },
  ],
  products: [
    {
      id: "p1",
      name: "عباية ليل دبي",
      tag: "جديد",
      price: 1290,
      image: abaya1,
      images: [abaya1, abaya2, abaya3, abaya4],
      categoryId: "abayas",
      description: "عباية حرير بقَصّة مستقيمة وأكمام واسعة، مثالية للسهرات الهادئة.",
      stock: 12,
      sizes: ["S", "M", "L", "XL"],
      styles: ["رسمي", "كلاسيك"],
      fabric: "حرير",
      color: "أسود",
      colors: ["أسود", "كحلي", "عنابي"],
      hoverImage: abaya2,
      reviews: [
        {
          id: "r1",
          name: "نورة الهاشمي",
          text: "خامة الحرير رائعة جداً والتفصيل متقن، شكراً دبي عباية!",
          rating: 5,
          date: Date.now() - 86400000 * 2,
        },
      ],
    },
    {
      id: "p2",
      name: "عباية فيري داست",
      tag: "الأكثر طلباً",
      price: 1450,
      oldPrice: 1750,
      image: abaya2,
      images: [abaya2, abaya3, abaya1],
      categoryId: "evening",
      description: "شيفون مطرز بخرز لؤلؤي يعكس الضوء بلمسة لافندر.",
      stock: 7,
      sizes: ["S", "M", "L"],
      styles: ["مطرز", "سهرة"],
      fabric: "شيفون",
      color: "لافندر",
      colors: ["لافندر", "عاجي", "زيتي"],
      hoverImage: abaya3,
      reviews: [
        {
          id: "r2",
          name: "أمل محمد",
          text: "العباية تجنن باللبس! التطريز اللؤلؤي جداً فخم ودقيق وتستاهل كل درهم.",
          rating: 5,
          date: Date.now() - 86400000 * 5,
        },
        {
          id: "r3",
          name: "سارة عبدالله",
          text: "حلوة ومريحة، بس تمنيت لو في منها ألوان ثانية.",
          rating: 4,
          date: Date.now() - 86400000 * 10,
        },
      ],
    },
    {
      id: "p3",
      name: "جلابية العاج الذهبي",
      tag: "حصري",
      price: 1690,
      image: abaya3,
      images: [abaya3, abaya1, abaya4],
      categoryId: "jalabiyas",
      description: "جلابية بتطريز ذهبي يدوي على قماش عاجي فاخر.",
      stock: 5,
      sizes: ["M", "L", "XL"],
      styles: ["مطرز", "رسمي"],
      fabric: "قطن مصري",
      color: "عاجي",
      colors: ["عاجي", "بيج"],
      hoverImage: abaya1,
      reviews: [
        {
          id: "r4",
          name: "مريم الخالدي",
          text: "القطعة خيال والباكجنق وصلني مرتب وراقي جداً. شكراً لكم.",
          rating: 5,
          date: Date.now() - 86400000 * 1,
        },
      ],
    },
    {
      id: "p4",
      name: "عباية ساتان البنفسج",
      tag: "لمسة مسائية",
      price: 1550,
      image: abaya4,
      images: [abaya4, abaya3, abaya2],
      categoryId: "abayas",
      description: "ساتان بنفسجي بانسيابية عالية وحزام مخفي.",
      stock: 9,
      sizes: ["S", "M", "L", "XL"],
      styles: ["سهرة", "كاجوال"],
      fabric: "ساتان",
      color: "بنفسجي",
      hoverImage: abaya3,
    },
    ...Array.from({ length: 26 }).map((_, i) => {
      const cats = ["abayas", "jalabiyas", "evening", "shawls"];
      const fabrics = ["حرير", "شيفون", "كريب", "مخمل", "ساتان", "دانتيل", "قطن"];
      const colors = ["أسود", "لافندر", "عاجي", "بنفسجي", "كحلي", "عنابي", "زيتي", "بيج"];
      const imgs = [abaya1, abaya2, abaya3, abaya4];
      const categoryId = cats[i % 4] ?? "abayas";
      const img1 = imgs[i % 4] ?? abaya1;
      const img2 = imgs[(i + 1) % 4] ?? abaya2;
      const img3 = imgs[(i + 2) % 4] ?? abaya3;
      
      const prefix = categoryId === "abayas" ? "عباية" : categoryId === "jalabiyas" ? "جلابية" : categoryId === "evening" ? "سواريه" : "شيلة";
      
      return {
        id: `mock_p${i + 5}`,
        name: `${prefix} ${colors[i % colors.length]} ${fabrics[i % fabrics.length]}`,
        tag: i % 3 === 0 ? "جديد" : i % 5 === 0 ? "الأكثر مبيعاً" : "موصى به",
        price: 600 + (i * 45),
        oldPrice: i % 4 === 0 ? 600 + (i * 45) + 300 : undefined,
        image: img1,
        images: [img1, img2, img3],
        categoryId: categoryId,
        description: `قطعة فاخرة وأنيقة مصنوعة من ${fabrics[i % fabrics.length]}، تتميز بتفاصيل مذهلة تناسب إطلالتك في كل الأوقات.`,
        stock: i % 7 === 0 ? 0 : 5 + (i % 10),
        sizes: ["S", "M", "L", "XL"],
        styles: categoryId === "abayas" || categoryId === "jalabiyas" ? ["كلاسيك", "رسمي"] : ["سهرة", "لامع"],
        fabric: fabrics[i % fabrics.length],
        color: colors[i % colors.length],
        hoverImage: img2,
      };
    }),
  ],
  offers: [
    {
      id: "o1",
      title: "خصم افتتاح المجموعة",
      subtitle: "على كل العبايات المسائية لفترة محدودة.",
      discount: 20,
      code: "DUBAI20",
      productId: "p2",
    },
    {
      id: "o2",
      title: "توصيل مجاني داخل الإمارات",
      subtitle: "لكل طلب يتجاوز ١٥٠٠ درهم.",
      discount: 0,
      code: "FREESHIP",
    },
    {
      id: "o3",
      title: "باقة الجلابيات",
      subtitle: "قطعتان بخصم ١٥٪ عند الطلب معاً.",
      discount: 15,
      code: "JALA15",
      productId: "p3",
    },
  ],
  info: {
    storeName: "Dubai Abaya",
    whatsapp: "784494470",
    instagram: "dubai.abaya",
    email: "care@dubaiabaya.ae",
    address: "دبي، الإمارات العربية المتحدة",
    hours: "يومياً ١٠ص – ١٠م",
    about:
      "Dubai Abaya أتيليه رقمي يقدّم عبايات وجلابيات مصنوعة يدوياً بأقمشة نادرة، بروح دبي وهدوء اللافندر.",
    banks: [
      { id: "b1", bank: "بنك الكريمي", holder: "Dubai Abaya", iban: "1234567890" },
    ],
    wallets: [
      { id: "w1", name: "جيب", number: "777000000" },
      { id: "w2", name: "جوالي", number: "711000000" },
      { id: "w3", name: "فلوسك", number: "733000000" },
      { id: "w4", name: "ون كاش", number: "700000000" },
      { id: "w5", name: "موني", number: "770000000" },
    ],
  },
  branding: { logo: logoFull, mark: logoMark },
  cart: [],
  isCartOpen: false,
  lottery: {
    tickets: [],
    rounds: [],
    locked: false,
    settings: { autoSend: false, apiKey: "", phoneNumberId: "" },
  },
};

const KEY = "dubai-abaya-store-v9";

type StoreContextValue = {
  state: StoreState;
  update: (patch: Partial<StoreState>) => void;
  reset: () => void;
  addToCart: (productId: string, size?: string, color?: string, qty?: number) => void;
  setQty: (productId: string, size: string, color: string | undefined, qty: number) => void;
  removeLine: (productId: string, size: string, color?: string) => void;
  clearCart: () => void;
  cartDetails: { line: CartLine; product: Product; total: number }[];
  cartCount: number;
  cartTotal: number;
  setIsCartOpen: (open: boolean) => void;
  updateLottery: (patch: Partial<LotteryState>) => void;
  addTickets: (
    codes: string[],
    name: string,
    whatsapp: string,
  ) => { added: number; duplicates: string[]; total: number };
  runDraw: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoreState>;
        setState({
          ...defaultState,
          ...parsed,
          lottery: {
            ...defaultState.lottery,
            ...(parsed.lottery ?? {}),
            settings: { ...defaultState.lottery.settings, ...(parsed.lottery?.settings ?? {}) },
          },
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value = useMemo<StoreContextValue>(() => {
    const update = (patch: Partial<StoreState>) => setState((s) => ({ ...s, ...patch }));

    const cartDetails = state.cart
      .map((line) => {
        const product = state.products.find((p) => p.id === line.productId);
        if (!product) return null;
        return { line, product, total: product.price * line.qty };
      })
      .filter(Boolean) as { line: CartLine; product: Product; total: number }[];

    return {
      state,
      update,
      reset: () => setState(defaultState),
      addToCart: (productId, size = "M", color, qty = 1) =>
        setState((s) => {
          const found = s.cart.find((l) => l.productId === productId && l.size === size && l.color === color);
          const cart = found
            ? s.cart.map((l) => (l === found ? { ...l, qty: l.qty + qty } : l))
            : [...s.cart, { productId, size, color, qty }];
          return { ...s, cart };
        }),
      setQty: (productId, size, color, qty) =>
        setState((s) => ({
          ...s,
          cart: s.cart
            .map((l) => (l.productId === productId && l.size === size && l.color === color ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        })),
      removeLine: (productId, size, color) =>
        setState((s) => ({
          ...s,
          cart: s.cart.filter((l) => !(l.productId === productId && l.size === size && l.color === color)),
        })),
      clearCart: () => setState((s) => ({ ...s, cart: [] })),
      cartDetails,
      cartCount: cartDetails.reduce((n, d) => n + d.line.qty, 0),
      cartTotal: cartDetails.reduce((n, d) => n + d.total, 0),
      setIsCartOpen: (open) => setState((s) => ({ ...s, isCartOpen: open })),
      updateLottery: (patch) =>
        setState((s) => ({ ...s, lottery: { ...s.lottery, ...patch } })),
      addTickets: (codes, name, whatsapp) => {
        const existing = new Set(state.lottery.tickets.map((t) => t.code));
        const duplicates: string[] = [];
        const fresh: LotteryTicket[] = [];
        for (const raw of codes) {
          const code = raw.trim().toUpperCase();
          if (!code) continue;
          if (existing.has(code) || fresh.some((f) => f.code === code)) {
            duplicates.push(code);
            continue;
          }
          fresh.push({ id: uid(), code, name, whatsapp, createdAt: Date.now() });
        }
        if (fresh.length)
          setState((s) => ({
            ...s,
            lottery: { ...s.lottery, tickets: [...s.lottery.tickets, ...fresh] },
          }));
        const phone = whatsapp.replace(/\D/g, "");
        const owned =
          state.lottery.tickets.filter((t) => t.whatsapp.replace(/\D/g, "") === phone).length +
          fresh.length;
        return { added: fresh.length, duplicates, total: owned };
      },
      runDraw: () =>
        setState((s) => {
          const tickets = s.lottery.tickets;
          if (!tickets.length) return { ...s, lottery: { ...s.lottery, locked: true } };
          const byPerson = new Map<string, LotteryWinner>();
          for (const t of tickets) {
            const key = t.whatsapp.replace(/\D/g, "");
            const prev = byPerson.get(key);
            if (prev) prev.cards += 1;
            else byPerson.set(key, { name: t.name, whatsapp: t.whatsapp, cards: 1 });
          }
          const ranked = [...byPerson.values()].sort((a, b) => b.cards - a.cards);
          const top = ranked[0] ?? null;
          const pool = tickets.filter(
            (t) => !top || t.whatsapp.replace(/\D/g, "") !== top.whatsapp.replace(/\D/g, ""),
          );
          const source = pool.length ? pool : tickets;
          const pick = source[Math.floor(Math.random() * source.length)]!;
          const randomWinner: LotteryWinner = {
            name: pick.name,
            whatsapp: pick.whatsapp,
            cards: byPerson.get(pick.whatsapp.replace(/\D/g, ""))?.cards ?? 1,
          };
          const round: LotteryRound = {
            id: uid(),
            drawnAt: Date.now(),
            totalCards: tickets.length,
            topWinner: top,
            randomWinner,
            delivery: "contact",
          };
          return {
            ...s,
            lottery: { ...s.lottery, locked: true, rounds: [round, ...s.lottery.rounds] },
          };
        }),
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export const formatAED = (n: number) => `${n.toLocaleString("en-US")} د.إ`;

export function whatsappLink(number: string, text: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export const uid = () => Math.random().toString(36).slice(2, 9);

import { createContext, useContext, useEffect, useMemo, useState } from "react";
export { INKS } from "./inks";

export type ToastItem = { id: number; title: string; body: string };

export type Shop = {
  ink: string;
  setInk: (id: string) => void;
  reg: number;
  setReg: (n: number) => void;
  dots: boolean;
  setDots: (b: boolean) => void;
  toast: (title: string, body: string) => void;
  toasts: ToastItem[];
  dismissToast: (id: number) => void;
};

export function useShopState(): Shop {
  const [ink, setInk] = useState("workshop");
  const [reg, setReg] = useState(5);
  const [dots, setDots] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    document.documentElement.dataset.ink = ink;
  }, [ink]);

  useEffect(() => {
    document.documentElement.style.setProperty("--reg", `${reg}px`);
  }, [reg]);

  return useMemo(
    () => ({
      ink,
      setInk,
      reg,
      setReg,
      dots,
      setDots,
      toasts,
      dismissToast: (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
      toast: (title: string, body: string) =>
        setToasts((t) => [...t.slice(-2), { id: Date.now(), title, body }]),
    }),
    [ink, reg, dots, toasts],
  );
}

export const ShopCtx = createContext<Shop | null>(null);

export function useShop(): Shop {
  const shop = useContext(ShopCtx);
  if (!shop) throw new Error("useShop must be used inside ShopCtx");
  return shop;
}

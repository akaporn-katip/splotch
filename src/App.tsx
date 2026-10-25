import { useEffect } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ShopCtx, useShop, useShopState } from "./lib/shop";
import { Masthead } from "./components/site/Masthead";
import { Hero } from "./components/site/Hero";
import { Lab } from "./components/site/Lab";
import { Anatomy } from "./components/site/Anatomy";
import { Inks } from "./components/site/Inks";
import { Notes } from "./components/site/Notes";
import { ToastProvider, ToastViewport, ToastCard } from "./components/ui/overlay";

function Toasts() {
  const { toasts, dismissToast } = useShop();
  return (
    <>
      {toasts.map((t) => (
        <ToastCard
          key={t.id}
          item={t}
          onOpenChange={(open) => {
            if (!open) dismissToast(t.id);
          }}
        />
      ))}
      <ToastViewport />
    </>
  );
}

export function App() {
  const shop = useShopState();

  useEffect(() => {
    document.documentElement.dataset.dots = shop.dots ? "on" : "off";
  }, [shop.dots]);

  return (
    <ShopCtx.Provider value={shop}>
      <TooltipPrimitive.Provider delayDuration={220}>
        <ToastProvider swipeDirection="right">
          <a href="#parts" className="skip-link">
            Skip to the parts
          </a>
          <div className="relative min-h-screen">
            <Masthead />
            <main id="main">
              <Hero />
              <Lab />
              <Anatomy />
              <Inks />
              <Notes />
            </main>
          </div>
          <Toasts />
        </ToastProvider>
      </TooltipPrimitive.Provider>
    </ShopCtx.Provider>
  );
}

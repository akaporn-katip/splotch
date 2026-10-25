/**
 * Public entry point: the component layer plus the data it is printed from.
 *
 * The site sections (Hero, Lab, Anatomy, Inks, Notes, Masthead, Mascot) and the
 * demo's shop state are deliberately not exported — they are the proof sheet
 * this kit is shown on, not the kit.
 */

export * from "./components/ui/primitives";
export * from "./components/ui/form";
export * from "./components/ui/date-picker";
export * from "./components/ui/overlay";
export * from "./components/ui/icons";

export { cx } from "./lib/cx";
export { INKS } from "./lib/inks";
export type { Ink } from "./lib/inks";

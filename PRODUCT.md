# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated, because no question tool is available in this session and the brief named its own libraries: **Vite + React 19 + TypeScript, Tailwind CSS v4, Radix UI primitives**. Chosen because the request names Tailwind and Radix (React component primitives), and a Vite SPA is the shortest path to a fast, static, inspectable component showcase. No deploy target was specified.

## Users

<!-- INFERRED (no answer channel available; see Product Principles note) -->
Front-end developers and designers who want playful, tactile UI without building the visual system from scratch. They arrive mid-build, on a laptop, with a palette already chosen for the product or a mandate to make something feel less corporate. They are evaluating: "can I drop this into my app and does it survive contact with real states?"

## Product Purpose

**Splotch** is a cartoon UI kit: a set of themed, accessible components built on Radix primitives and styled with Tailwind, plus a showcase that demonstrates each one working. Success means a visitor can press the controls, feel the character of the kit in ten seconds, and lift the pattern into their own project.

## Positioning

Most "playful" UI kits are neubrutalist skins: identical grey Radix components with a 4px black border and a hard offset shadow bolted on. Splotch is built the other way around — the surface is a **misregistered risograph funny page**, so its visual grammar (ink plates, halftone dot shading, wobbly key lines, caption boxes and speech balloons) generates the components rather than decorating them. Theming is exposed as a printing-press control, not a settings page.

## Operating Context

Evaluated in a browser, usually alongside a code editor. Visitors read the component, poke it, then read the markup. The showcase must work as a static site with no backend.

## Capabilities and Constraints

- Real interactive components, keyboard accessible, built on Radix: Dialog, DropdownMenu, Tooltip, Tabs, Accordion, Switch, Checkbox, Slider, Select, Progress, Avatar, Toast, Popover, ToggleGroup, Separator.
- A live ink-palette control that re-inks the entire page through CSS custom properties.
- A code panel that shows the markup for the component under inspection.
- No backend, no auth, no analytics. No fabricated customers, benchmarks, pricing, or testimonials.
- **Unconfirmed:** whether this is a library package for distribution or purely a demo surface. Treated as a demo surface that ships reusable component source.

## Brand Commitments

None supplied by the user. The name **Splotch** and the press/ink metaphor are authored here and are placeholders the user can replace.

## Evidence on Hand

None. No logo, existing brand, copy, or product data was provided. All names, issue numbers, colophon text, and component examples are authored and must be treated as replaceable.

## Product Principles

1. **The world generates the component, not the reverse.** Every control must be explainable in ink-on-paper terms; if a pattern only works because "UI kits do it that way", it does not ship.
2. **Legibility is not negotiable.** Cartoon is a material, not a permission slip for low contrast, unreadable type, or mystery meat navigation.
3. **Every state visible.** Hover, active, focus, disabled, loading, empty, and error all exist in the world's own vocabulary.
4. **The visitor is a printer.** Colour and register are controls the user can operate, and operating them is the demonstration.

<!-- Init substitution: this session exposes no structured question tool, so the product record above is inferred from the one-line brief plus the empty project directory, and labelled where it is inferred. -->

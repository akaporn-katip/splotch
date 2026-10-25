import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * The library stylesheet entry. The material system is a plain CSS file, but a
 * library build only takes script entries and merges every stylesheet it reaches
 * into one `style.css`, so the sheet is reached through a virtual module rather
 * than by making `src/index.ts` side-effectful.
 */
const STYLE_ENTRY = "virtual:splotch-style";

/** Root-relative, as Vite resolves it: no filesystem path needed in this config. */
const SHEET = "/src/index.css";

function styleSheet(): Plugin {
  // Vite resolves lib entry paths against the project root before plugins run,
  // so the virtual id arrives as `<root>/virtual:splotch-style`.
  const isStyleEntry = (id: string) => id.endsWith(STYLE_ENTRY);

  return {
    name: "splotch-style-sheet",
    resolveId(id) {
      if (isStyleEntry(id)) return id;
    },
    load(id) {
      if (isStyleEntry(id)) return `import ${JSON.stringify(SHEET)};`;
    },
  };
}

/**
 * The stylesheet entry carries no script, so the build leaves an empty stub chunk
 * next to `style.css`. Drop it once Vite has emitted the CSS asset it belongs to.
 */
function dropEmptyChunks(): Plugin {
  return {
    name: "splotch-drop-empty-chunks",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const [file, output] of Object.entries(bundle)) {
        if (output.type === "chunk" && output.code.trim() === "") delete bundle[file];
      }
    },
  };
}

/**
 * `import "splotch-ui/index.css"` is a side-effect import of a stylesheet, and
 * TypeScript will not resolve a `.css` export target without a declaration for it
 * ("Cannot find module or type declarations for side-effect import"). Emit the
 * declaration next to the sheet so the export can carry a `types` condition.
 */
function styleTypes(): Plugin {
  return {
    name: "splotch-style-types",
    enforce: "post",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "style.d.ts",
        source: "declare const css: string;\nexport default css;\n",
      });
    },
  };
}

/** React is the peer; everything the kit imports itself (Radix) is a plain dependency. */
const EXTERNAL = [/^react($|\/)/, /^react-dom($|\/)/, /^@radix-ui\//];

export default defineConfig(({ mode }) => {
  // `npm run build` — the demo app, unchanged.
  if (mode !== "lib") return { plugins: [react(), tailwindcss()] };

  // `npm run build:lib` — the installable kit: dist-lib/index.js and style.css.
  return {
    plugins: [react(), tailwindcss(), styleSheet(), dropEmptyChunks(), styleTypes()],
    build: {
      outDir: "dist-lib",
      target: "es2022",
      lib: {
        entry: { index: "src/index.ts", style: STYLE_ENTRY },
        formats: ["es"],
        cssFileName: "style",
      },
      rollupOptions: { external: EXTERNAL },
    },
  };
});

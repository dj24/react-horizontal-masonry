import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: {
    resolve: true,
    compilerOptions: {
      jsx: "react-jsx",
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      moduleResolution: "bundler",
      skipLibCheck: true,
    },
  },
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ["react", "react-dom"],
  treeshake: true,
});

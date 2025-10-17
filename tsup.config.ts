import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
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
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  treeshake: true,
});

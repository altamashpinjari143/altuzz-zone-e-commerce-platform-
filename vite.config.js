import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" + HashRouter => GitHub Pages pe kisi bhi repo name ke saath chalta hai
export default defineConfig({
  plugins: [react()],
  base: "./",
});

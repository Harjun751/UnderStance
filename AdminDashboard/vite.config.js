import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        css: true,
        setupFiles: "./src/tests/setup.jsx",
        reporters: ["default", "junit"],
        outputFile: {
            junit: "./coverage/results.xml",
        },
    },
});

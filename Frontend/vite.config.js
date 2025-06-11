import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

const backendHost = process.env.BACKEND_HOST || "127.0.0.1";
const backendPort = process.env.BACKEND_PORT || "3000";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        proxy: {
            "/questions": `http://${backendHost}:${backendPort}`,
            "/stances": `http://${backendHost}:${backendPort}`,
            "/parties": `http://${backendHost}:${backendPort}`,
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        css: true,
        setupFiles: "./src/utils/tests/setup.jsx",
        reporters: ["default", "junit"],
        outputFile: {
            junit: "./coverage/results.xml",
        },
    },
});

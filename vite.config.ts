import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    define: {
        global: "window",       // some libs expect `global`
        "process.env": {},      // avoid undefined process.env
    },
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            buffer: "buffer",
        },
    },
    server: {
        fs: {
            allow: ["."]
        }
    },
    preview: {
        open: true
    },
    appType: "spa",
    optimizeDeps: {
        include: ["buffer", "process", "rsocket-core", "rsocket-websocket-client"],
    },
})

// SPDX-FileCopyrightText: 2025 YangYuhang
// SPDX-License-Identifier: MPL-2.0
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    base: '/app', // 挂载在 /app 路径
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        exclude: ['pdfjs-dist'],
    },
    server: {
        proxy: {
            '/service': {
                target: 'http://127.0.0.1:8010',
                changeOrigin: true,
            },
            '/static': {
                target: 'http://127.0.0.1:8010',
                changeOrigin: true,
            },
        },
    },
});

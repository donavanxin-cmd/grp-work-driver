import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Plugin to mount /api/* serverless handlers during Vite development
function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const rawPath = req.url.split('?')[0].replace(/^\/api\//, '').replace(/\.js$/, '');
        const validEndpoints = [
          'health',
          'keys',
          'traffic-incidents',
          'travel-times',
          'flood-alerts',
          'road-works',
          'traffic-speed-bands',
          'onemap-route'
        ];

        if (validEndpoints.includes(rawPath)) {
          try {
            const modulePath = path.resolve(__dirname, `api/${rawPath}.js`);
            const mod = await import(/* @vite-ignore */ `file://${modulePath}`);
            return await mod.default(req, res);
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message, endpoint: rawPath }));
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});


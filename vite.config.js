import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// every build has a number of its own, in the code and in /version.json: an open page (the installed
// app above all, which has no reload button) asks for the file when it comes back on screen and offers
// to reload when the number changed (src/engine/release.js)
const BUILD = (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 12) || String(Date.now())
const version = {
  name: 'ew-version',
  apply: 'build',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD }) })
  },
}

// the dev server answers the site's functions in api/ as Vercel does when deployed (api/chapter.js)
const functions = {
  name: 'ew-api',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/api/', async (req, res, next) => {
      const url = new URL(req.url, 'http://dev')
      const name = url.pathname.replace(/^\//, '').replace(/[^\w-]/g, '')
      let handler
      try {
        handler = (await server.ssrLoadModule(`/api/${name}.js`)).default
      } catch {
        return next()
      }
      const reply = {
        status(code) { res.statusCode = code; return reply },
        setHeader: (k, v) => res.setHeader(k, v),
        json(body) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)) },
      }
      await handler({ query: Object.fromEntries(url.searchParams) }, reply)
    })
  },
}

export default defineConfig({
  plugins: [react(), version, functions],
  define: { __BUILD__: JSON.stringify(BUILD) },
  build: { chunkSizeWarningLimit: 1500 },
  // the rooms load the Supabase client on demand; bundled at the dev server's start, not found mid-visit
  // (a dependency found late makes Vite re-bundle and refuse the old copy: "504 Outdated Optimize Dep")
  optimizeDeps: { include: ['@supabase/supabase-js'] },
})

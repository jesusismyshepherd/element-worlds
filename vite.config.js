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

export default defineConfig({
  plugins: [react(), version],
  define: { __BUILD__: JSON.stringify(BUILD) },
  build: { chunkSizeWarningLimit: 1500 },
  // the rooms load the Supabase client on demand; bundled at the dev server's start, not found mid-visit
  // (a dependency found late makes Vite re-bundle and refuse the old copy: "504 Outdated Optimize Dep")
  optimizeDeps: { include: ['@supabase/supabase-js'] },
})

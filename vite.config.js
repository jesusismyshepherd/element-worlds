import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { chunkSizeWarningLimit: 1500 },
  // the rooms load the Supabase client on demand; bundled at the dev server's start, not found mid-visit
  // (a dependency found late makes Vite re-bundle and refuse the old copy: "504 Outdated Optimize Dep")
  optimizeDeps: { include: ['@supabase/supabase-js'] },
})

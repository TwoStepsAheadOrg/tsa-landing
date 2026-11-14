import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, existsSync } from 'fs'

// 배포할 때마다 dist/sitemap.xml 의 lastmod 를 빌드 날짜(한국 시간)로 바꾼다(빙, 구글이 바뀐 날을 알 수 있게)
function sitemapLastmod() {
  return {
    name: 'sitemap-lastmod',
    apply: 'build' as const,
    closeBundle() {
      const file = path.resolve(__dirname, 'dist/sitemap.xml')
      if (!existsSync(file)) return
      const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10)
      const xml = readFileSync(file, 'utf8').replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${today}</lastmod>`)
      writeFileSync(file, xml)
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    sitemapLastmod(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        careers: path.resolve(__dirname, 'careers/index.html'),
        ownnext: path.resolve(__dirname, 'ownnext/index.html'),
      },
      output: {
        // 공유 묶음 파일 이름에 gtag, oaiq 같은 추적 도구 이름이 붙으면 광고 차단기가 사이트 전체 코드를 막을 수 있어 중립 이름으로
        chunkFileNames: 'assets/chunk-[hash].js',
      },
    },
  },
  server: {
    proxy: {
      '/api/careers': {
        target: 'https://api.plurank.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})

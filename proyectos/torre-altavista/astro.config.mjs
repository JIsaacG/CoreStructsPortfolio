// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// La página se publica como demo del portafolio en /demos/torre-altavista/.
// `npm run publicar` compila y copia el resultado allí con rutas relativas.
export default defineConfig({
  site: 'https://corestructhn.com',
  base: '/demos/torre-altavista/',
  // Una sola familia tipográfica, descargada en el build y servida desde el propio dominio.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--font-manrope',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

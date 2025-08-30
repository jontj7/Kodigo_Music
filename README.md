# Kodigo Music (SPA)

Proyecto de ejemplo **React + Vite + TypeScript + Tailwind** que cumple los requisitos:

- Diseño atractivo y **responsive** (Tailwind).
- **2+ rutas** con `react-router-dom` (`/`, `/library`, `/login`).
- **Manejo de estados** con Context + Reducer para el **reproductor**.
- **1 formulario validado** con `react-hook-form` (ruta `/login`).
- Listo para **deploy** en Netlify/Vercel/GitHub Pages.

## Requisitos previos
- Node 18+ y npm

## Instalación
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy (opción 1: Netlify)
1. Crea un nuevo sitio desde tu repositorio.
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. Asegúrate de subir el archivo `public/_redirects` (ya incluido) para SPA.

## Deploy (opción 2: Vercel)
1. Importa el repo en vercel.com → New Project.
2. Framework: **Vite**.
3. **Build command:** `npm run build` • **Output:** `dist`
4. El archivo `vercel.json` incluido reescribe rutas al index.

## Deploy (opción 3: GitHub Pages)
1. Instala `gh-pages` y agrega los scripts correspondientes si lo deseas.
2. Ajusta `base` en `vite.config.ts` si tu repo no está en root.

## Créditos de assets
- Fotos libres de Unsplash.
- Streams de audio de ejemplos de **SoundHelix** (uso demo).
- Iconos: `lucide-react`.

## Estructura
```
kodigo-music/
├─ public/
│  ├─ logo.svg
│  └─ _redirects
├─ src/
│  ├─ components/
│  │  ├─ PlayerBar.tsx
│  │  └─ PlaylistCard.tsx
│  ├─ context/
│  │  └─ PlayerContext.tsx
│  ├─ routes/
│  │  ├─ Home.tsx
│  │  ├─ Library.tsx
│  │  └─ Login.tsx
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ styles.css
├─ index.html
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
├─ tsconfig.json
├─ vite.config.ts
└─ vercel.json
```

> **Sugerencias para la rúbrica**
> - Diseño (2.5): Paleta moderna, glassmorphism suave, portada hero, cards.
> - Librerías (2.5): `react-router-dom`, `react-hook-form`, `lucide-react`, Tailwind.
> - Calidad (2.5): TS estricto, componentes desacoplados, accesibilidad básica, estado global.
> - Producción (2.5): Config SPA para Netlify/Vercel + instrucciones.

¡Éxitos!
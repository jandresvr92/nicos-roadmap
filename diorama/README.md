# 🎂 La cima del DevOps — Diorama 3D de cumpleaños

Diorama isométrico interactivo hecho con **React + Vite + Three.js + React Three Fiber + Drei**.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist (estático, se puede subir a Netlify, Vercel, GitHub Pages…)
```

## Personalizar

- **Nombre y mensaje de cumpleaños:** `src/config.js`
- **Textos de los logros (letreros y popups):** `src/data/achievements.js`
- **Música:** la canción es `src/assets/best-friend.mp3`. Para cambiarla, reemplaza ese archivo (o ajusta el `import` y `SONG_TITLE` en `src/ui/UI.jsx` → `MusicButton`).

## Estructura

```
src/
├── App.jsx                 Canvas + estado (logro seleccionado, modal)
├── config.js               Nombre y mensaje de cumpleaños
├── data/achievements.js    Letreros, logos y sus textos
├── scene/
│   ├── Scene.jsx           Cámara ortográfica, OrbitControls limitados, luces
│   ├── Base.jsx            Plataforma circular, rocas, pasto, flores, pinos
│   ├── Mountain.jsx        Montaña en espiral (InstancedMesh) + pedestal
│   ├── Character.jsx       Figura estilo coleccionable con trofeo (animada)
│   ├── Clouds.jsx          <Clouds/> flotantes y <Sun/> sonriente
│   ├── Achievements.jsx    Letreros + logos interactivos (AWS, Terraform, K8s, GPU…)
│   └── Interactive.jsx     Hover (escala + brillo) y click reutilizables
├── ui/UI.jsx               Botón de música, popup de logros, modal y confeti
└── utils/textTexture.js    Texto → CanvasTexture (sin fuentes externas)
```

## Interacción

- Arrastrar: girar (polar limitado 30°–80°) · Rueda/pinch: zoom (limitado)
- Hover sobre letreros/logos: se agrandan y brillan · Click: popup con el logro
- Click en el personaje o en **💬 ¡Feliz Cumpleaños!**: mensaje especial con confeti
- 🔇/🔊 arriba a la derecha: música de fondo (HTML5 `Audio`, en bucle)

import * as THREE from 'three'

const cache = new Map()

/**
 * Dibuja texto en un canvas y lo devuelve como textura (sin descargar fuentes,
 * funciona offline). Se cachea por clave para no recrear texturas.
 */
export function makeTextTexture(lines, { bg = '#c94a3c', fg = '#ffffff', w = 512, h = 256, font = 'bold 64px "Trebuchet MS", "Arial Rounded MT Bold", Arial, sans-serif', border = true } = {}) {
  const key = JSON.stringify([lines, bg, fg, w, h, font, border])
  if (cache.has(key)) return cache.get(key)

  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  if (border) {
    ctx.strokeStyle = 'rgba(0,0,0,0.18)'
    ctx.lineWidth = 14
    ctx.strokeRect(7, 7, w - 14, h - 14)
  }
  ctx.fillStyle = fg
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const arr = Array.isArray(lines) ? lines : [lines]
  // Ajusta tamaño de fuente para que quepa
  let size = parseInt(font.match(/(\d+)px/)[1], 10)
  const fit = () => {
    ctx.font = font.replace(/\d+px/, `${size}px`)
    return Math.max(...arr.map((l) => ctx.measureText(l).width))
  }
  while (fit() > w * 0.88 && size > 12) size -= 2
  const lh = size * 1.15
  const startY = h / 2 - ((arr.length - 1) * lh) / 2
  ctx.shadowColor = 'rgba(0,0,0,0.25)'
  ctx.shadowOffsetY = 3
  arr.forEach((l, i) => ctx.fillText(l, w / 2, startY + i * lh))

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  cache.set(key, tex)
  return tex
}

/** PRNG determinista para que el diorama siempre se vea igual */
export function seeded(seed = 1) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

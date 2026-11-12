import { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { seeded } from '../utils/textTexture'

// ---------- Parámetros de la espiral ----------
export const STEP_COUNT = 26
export const TOP_Y = 3.9 // altura de la cima (donde está el pedestal)
const START_ANGLE = Math.PI / 4 // primer escalón mirando a la cámara

/** Posición/orientación de un escalón de la espiral (0 = base, STEP_COUNT-1 = cima) */
export function stepTransform(i) {
  const t = i / (STEP_COUNT - 1)
  const a = START_ANGLE - t * Math.PI * 2.25
  const r = 4.7 - t * 2.15
  const h = 0.35 + t * (TOP_Y - 0.25)
  return {
    angle: a,
    radius: r,
    height: h,
    x: Math.cos(a) * r,
    z: Math.sin(a) * r,
    // rotación Y para que el frente (+Z local) mire hacia afuera
    facing: Math.atan2(Math.cos(a), Math.sin(a)),
  }
}

const ROCK_COLORS = ['#9b8f84', '#a89a8c', '#8c7f73', '#b3a596', '#94877a', '#a39283']
const DIRT_COLORS = ['#8a5a3c', '#7d5236', '#946446']
const GRASS_COLORS = ['#8db04a', '#9bbd52', '#86a845', '#a3c45c']

function useMountainData() {
  return useMemo(() => {
    const rand = seeded(42)
    const pick = (arr) => arr[Math.floor(rand() * arr.length)]
    const pillars = [] // columnas de roca
    const caps = [] // tapas de pasto
    const stones = [] // losas de piedra sobre los escalones

    // 1) Escalones en espiral
    for (let i = 0; i < STEP_COUNT; i++) {
      const s = stepTransform(i)
      const w = 1.15 + rand() * 0.2
      const d = 1.2 + rand() * 0.2
      pillars.push({
        position: [s.x, s.height / 2, s.z],
        rotation: [0, -s.angle + (rand() - 0.5) * 0.15, 0],
        scale: [w, s.height, d],
        color: i % 3 === 0 ? pick(DIRT_COLORS) : pick(ROCK_COLORS),
      })
      caps.push({
        position: [s.x, s.height + 0.05, s.z],
        rotation: [0, -s.angle, 0],
        scale: [w + 0.06, 0.12, d + 0.06],
        color: pick(GRASS_COLORS),
      })
      // losa de piedra (el "escalón" pisable)
      stones.push({
        position: [s.x * 0.97, s.height + 0.14, s.z * 0.97],
        rotation: [0, -s.angle + (rand() - 0.5) * 0.3, 0],
        scale: [0.55, 0.08, 0.5],
        color: '#cfc6bb',
      })
    }

    // 2) Núcleo de la montaña: rejilla de columnas hexagonales
    for (let x = -3.4; x <= 3.4; x += 0.95) {
      for (let z = -3.4; z <= 3.4; z += 0.95) {
        const jx = x + (rand() - 0.5) * 0.25
        const jz = z + (rand() - 0.5) * 0.25
        const r = Math.hypot(jx, jz)
        if (r > 3.5) continue
        const h = Math.max(0.5, TOP_Y - 0.05 - r * 0.78 + (rand() - 0.5) * 0.35)
        pillars.push({
          position: [jx, h / 2, jz],
          rotation: [0, rand() * Math.PI, 0],
          scale: [1.0 + rand() * 0.15, h, 1.0 + rand() * 0.15],
          color: pick(ROCK_COLORS),
          hex: true,
        })
        if (rand() > 0.35) {
          caps.push({
            position: [jx, h + 0.04, jz],
            rotation: [0, rand() * Math.PI, 0],
            scale: [0.9, 0.1, 0.9],
            color: pick(GRASS_COLORS),
          })
        }
      }
    }
    return { pillars, caps, stones }
  }, [])
}

export default function Mountain() {
  const { pillars, caps, stones } = useMountainData()
  const boxes = pillars.filter((p) => !p.hex)
  const hexes = pillars.filter((p) => p.hex)

  return (
    <group>
      {/* Escalones de roca (cajas low-poly) */}
      <Instances limit={boxes.length} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.95} metalness={0} flatShading />
        {boxes.map((p, i) => (
          <Instance key={i} {...p} />
        ))}
      </Instances>

      {/* Núcleo: columnas hexagonales tipo basalto */}
      <Instances limit={hexes.length} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.6, 1, 6]} />
        <meshStandardMaterial roughness={0.95} flatShading />
        {hexes.map((p, i) => (
          <Instance key={i} {...p} />
        ))}
      </Instances>

      {/* Tapas de pasto */}
      <Instances limit={caps.length} receiveShadow castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={1} />
        {caps.map((p, i) => (
          <Instance key={i} {...p} />
        ))}
      </Instances>

      {/* Losas de piedra */}
      <Instances limit={stones.length} receiveShadow castShadow>
        <cylinderGeometry args={[1, 1, 1, 7]} />
        <meshStandardMaterial roughness={0.9} flatShading />
        {stones.map((p, i) => (
          <Instance key={i} {...p} />
        ))}
      </Instances>

      {/* Pedestal de la cima */}
      <mesh position={[0, TOP_Y + 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.15, 0.4, 24]} />
        <meshStandardMaterial color="#d9d2c8" roughness={0.85} />
      </mesh>
      <mesh position={[0, TOP_Y - 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.4, 1.5, 0.2, 9]} />
        <meshStandardMaterial color="#8aa84a" roughness={1} flatShading />
      </mesh>
    </group>
  )
}

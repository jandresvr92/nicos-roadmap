import { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { seeded } from '../utils/textTexture'

const R = 6.2

/** Plataforma circular de tierra y pasto + decoración (rocas, pasto, flores, árboles) */
export default function Base() {
  const deco = useMemo(() => {
    const rand = seeded(7)
    const rocks = []
    const tufts = []
    const flowers = []
    for (let i = 0; i < 26; i++) {
      const a = rand() * Math.PI * 2
      const r = 4.9 + rand() * 1.0
      const s = 0.25 + rand() * 0.35
      rocks.push({
        position: [Math.cos(a) * r, s * 0.35, Math.sin(a) * r],
        rotation: [rand(), rand() * 3, rand()],
        scale: [s * 1.2, s * 0.8, s],
        color: ['#bdb3a8', '#a99e93', '#c8beb2'][i % 3],
      })
    }
    for (let i = 0; i < 70; i++) {
      const a = rand() * Math.PI * 2
      const r = 3.8 + rand() * 2.2
      const s = 0.12 + rand() * 0.14
      tufts.push({
        position: [Math.cos(a) * r, s / 2, Math.sin(a) * r],
        rotation: [(rand() - 0.5) * 0.4, rand() * 3, (rand() - 0.5) * 0.4],
        scale: [s * 0.5, s * 2.2, s * 0.5],
        color: ['#6f9a35', '#86b043', '#5c8a2c'][i % 3],
      })
    }
    for (let i = 0; i < 18; i++) {
      const a = rand() * Math.PI * 2
      const r = 4.6 + rand() * 1.4
      flowers.push({
        position: [Math.cos(a) * r, 0.1, Math.sin(a) * r],
        color: ['#f28fb8', '#ffcf4a', '#c58cff', '#ffffff', '#ff8a5c'][i % 5],
      })
    }
    return { rocks, tufts, flowers }
  }, [])

  return (
    <group>
      {/* Capa de pasto */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[R, R, 0.24, 64]} />
        <meshStandardMaterial color="#9bb84f" roughness={1} />
      </mesh>
      {/* Borde de pasto que "cae" */}
      <mesh position={[0, -0.26, 0]}>
        <cylinderGeometry args={[R + 0.04, R + 0.04, 0.08, 64]} />
        <meshStandardMaterial color="#7f9e3c" roughness={1} />
      </mesh>
      {/* Tierra */}
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <cylinderGeometry args={[R, R - 0.15, 0.85, 64]} />
        <meshStandardMaterial color="#9a5b3a" roughness={1} />
      </mesh>
      <mesh position={[0, -1.17, 0]}>
        <cylinderGeometry args={[R - 0.15, R - 0.3, 0.1, 64]} />
        <meshStandardMaterial color="#6e3e26" roughness={1} />
      </mesh>

      {/* Rocas sueltas */}
      <Instances limit={deco.rocks.length} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial roughness={0.9} flatShading />
        {deco.rocks.map((p, i) => <Instance key={i} {...p} />)}
      </Instances>

      {/* Matas de pasto */}
      <Instances limit={deco.tufts.length} castShadow>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial roughness={1} flatShading />
        {deco.tufts.map((p, i) => <Instance key={i} {...p} />)}
      </Instances>

      {/* Flores */}
      {deco.flowers.map((f, i) => (
        <group key={i} position={f.position}>
          <mesh position={[0, -0.03, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.14]} />
            <meshStandardMaterial color="#4f7d26" />
          </mesh>
          <mesh position={[0, 0.05, 0]} castShadow>
            <sphereGeometry args={[0.06, 8, 6]} />
            <meshStandardMaterial color={f.color} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.025, 6, 4]} />
            <meshStandardMaterial color="#ffd23f" />
          </mesh>
        </group>
      ))}

      {/* Pinitos */}
      {[
        [5.2, -1.6],
        [3.0, 4.4],
        [-4.6, 3.0],
        [-1.2, -5.3],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.3, 6]} />
            <meshStandardMaterial color="#6b4428" />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow>
            <coneGeometry args={[0.32, 0.6, 7]} />
            <meshStandardMaterial color="#4e8a3a" flatShading />
          </mesh>
          <mesh position={[0, 0.85, 0]} castShadow>
            <coneGeometry args={[0.22, 0.45, 7]} />
            <meshStandardMaterial color="#5e9c44" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}

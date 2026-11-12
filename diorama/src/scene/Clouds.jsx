import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const CLOUD_MAT = { color: '#ffffff', roughness: 1 }

function Cloud({ position, scale = 1, speed = 0.5, amplitude = 0.6, phase = 0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phase
    ref.current.position.x = position[0] + Math.sin(t) * amplitude
    ref.current.position.y = position[1] + Math.sin(t * 1.7) * 0.08
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      {[
        [0, 0, 0, 0.5],
        [0.5, -0.1, 0.05, 0.38],
        [-0.48, -0.12, 0, 0.36],
        [0.15, 0.3, -0.05, 0.38],
        [-0.2, 0.18, 0.15, 0.3],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 20, 16]} />
          <meshStandardMaterial {...CLOUD_MAT} />
        </mesh>
      ))}
    </group>
  )
}

export function Clouds() {
  return (
    <group>
      <Cloud position={[-5.5, 5.4, 2.5]} scale={1.15} speed={0.35} />
      <Cloud position={[3.5, 5.2, -4.6]} scale={0.9} speed={0.42} phase={2} />
      <Cloud position={[5.2, 6.0, -3.0]} scale={0.8} speed={0.5} phase={4} amplitude={0.45} />
      <Cloud position={[-3.2, 2.8, 5.8]} scale={0.6} speed={0.6} phase={1} amplitude={0.4} />
    </group>
  )
}

export function Sun({ position = [-4.8, 7.2, -1.5] }) {
  const ref = useRef()
  const rays = useRef()
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 1.2) * 0.12
    ref.current.quaternion.copy(camera.quaternion) // siempre mira a la cámara
    rays.current.rotation.z = t * 0.3
  })
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.55, 32, 24]} />
        <meshStandardMaterial color="#ffd23f" emissive="#ffb000" emissiveIntensity={0.6} roughness={0.6} />
      </mesh>
      <group ref={rays}>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.78, Math.sin(a) * 0.78, -0.1]} rotation={[0, 0, a - Math.PI / 2]}>
              <coneGeometry args={[0.1, 0.25, 8]} />
              <meshStandardMaterial color="#ffc93a" emissive="#ffa600" emissiveIntensity={0.5} />
            </mesh>
          )
        })}
      </group>
      {/* Carita sonriente */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.17, 0.08, 0.52]}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshStandardMaterial color="#5a3200" />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={'c' + s} position={[s * 0.3, -0.08, 0.47]}>
          <sphereGeometry args={[0.07, 10, 8]} />
          <meshStandardMaterial color="#ff8a5c" transparent opacity={0.7} />
        </mesh>
      ))}
      <mesh position={[0, -0.08, 0.52]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.14, 0.03, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#5a3200" />
      </mesh>
    </group>
  )
}

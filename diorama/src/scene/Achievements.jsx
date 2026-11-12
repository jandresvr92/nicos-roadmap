import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import Interactive, { hoverGlow } from './Interactive'
import { SIGNS } from '../data/achievements'
import { stepTransform } from './Mountain'
import { makeTextTexture } from '../utils/textTexture'

const WOOD = '#8a5a34'
const WOOD_DARK = '#6d4426'

/* ------------------------------------------------------------------ */
/*  Letreros de logros                                                 */
/* ------------------------------------------------------------------ */
function Sign({ data, onSelect }) {
  const s = stepTransform(data.step)
  const out = 0.25
  const pos = [s.x + Math.cos(s.angle) * out, s.height + 0.12, s.z + Math.sin(s.angle) * out]
  const tex = useMemo(() => makeTextTexture(data.label, { bg: data.color }), [data])
  const hoverTex = useMemo(
    () => makeTextTexture(data.label, { bg: new THREE.Color(data.color).offsetHSL(0, 0.05, 0.12).getStyle() }),
    [data]
  )
  const flagRef = useRef()
  useFrame(({ clock }) => {
    if (flagRef.current) flagRef.current.rotation.y = Math.sin(clock.elapsedTime * 2 + data.step) * 0.06
  })

  return (
    <group position={pos} rotation={[0, s.facing, 0]} scale={1.2}>
      <Interactive onSelect={() => onSelect({ kind: 'sign', ...data })}>
        {(hovered) => (
          <group>
            {/* Poste */}
            <mesh position={[-0.62, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.06, 1.1, 8]} />
              <meshStandardMaterial color={WOOD_DARK} roughness={0.9} />
            </mesh>
            <mesh position={[-0.62, 1.13, 0]}>
              <sphereGeometry args={[0.07, 10, 8]} />
              <meshStandardMaterial color="#e8c14a" metalness={0.3} roughness={0.4} />
            </mesh>
            {/* Cartel tipo bandera */}
            <group ref={flagRef} position={[-0.6, 0.82, 0]}>
              <mesh position={[0.64, 0, 0]} castShadow>
                <boxGeometry args={[1.28, 0.6, 0.06]} />
                <meshStandardMaterial attach="material-0" color={WOOD} />
                <meshStandardMaterial attach="material-1" color={WOOD} />
                <meshStandardMaterial attach="material-2" color={WOOD} />
                <meshStandardMaterial attach="material-3" color={WOOD} />
                <meshStandardMaterial attach="material-4" map={hovered ? hoverTex : tex} roughness={0.75} {...hoverGlow(hovered, '#ffb347')} />
                <meshStandardMaterial attach="material-5" map={hovered ? hoverTex : tex} roughness={0.75} {...hoverGlow(hovered, '#ffb347')} />
              </mesh>
            </group>
          </group>
        )}
      </Interactive>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Logos / objetos tecnológicos                                      */
/* ------------------------------------------------------------------ */
function AwsBlock({ onSelect, ...props }) {
  const tex = useMemo(() => makeTextTexture('aws', { bg: '#f39c1f', fg: '#ffffff', font: 'bold 150px Arial, sans-serif', border: false }), [])
  return (
    <group {...props}>
      <Interactive onSelect={() => onSelect('aws')}>
        {(h) => (
          <group>
            <RoundedBox args={[0.95, 0.55, 0.3]} radius={0.12} smoothness={4} castShadow>
              <meshStandardMaterial color={h ? '#ffb347' : '#f39c1f'} roughness={0.6} {...hoverGlow(h, '#ff9500')} />
            </RoundedBox>
            {/* Nubecitas de fondo para la forma de "cloud" */}
            {[[-0.3, 0.25], [0.05, 0.33], [0.32, 0.22]].map(([x, y], i) => (
              <mesh key={i} position={[x, y, -0.02]} castShadow>
                <sphereGeometry args={[0.22 - i * 0.02, 16, 12]} />
                <meshStandardMaterial color={h ? '#ffb347' : '#f39c1f'} roughness={0.6} {...hoverGlow(h, '#ff9500')} />
              </mesh>
            ))}
            <mesh position={[0, -0.02, 0.152]}>
              <planeGeometry args={[0.85, 0.42]} />
              <meshStandardMaterial map={tex} transparent roughness={0.6} />
            </mesh>
          </group>
        )}
      </Interactive>
    </group>
  )
}

function TerraformBlock({ onSelect, ...props }) {
  const tex = useMemo(() => makeTextTexture('TF', { bg: '#7b42bc', font: 'bold 170px Arial, sans-serif', w: 256, h: 256, border: false }), [])
  return (
    <group {...props}>
      <Interactive onSelect={() => onSelect('terraform')}>
        {(h) => (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.55, 0.55, 0.32, 6]} />
              <meshStandardMaterial color={h ? '#9a63e0' : '#7b42bc'} roughness={0.55} flatShading {...hoverGlow(h, '#b388ff')} />
            </mesh>
            <mesh position={[0, 0, 0.165]}>
              <circleGeometry args={[0.4, 6]} />
              <meshStandardMaterial map={tex} roughness={0.55} />
            </mesh>
          </group>
        )}
      </Interactive>
    </group>
  )
}

function KubernetesWheel({ onSelect, ...props }) {
  const ref = useRef()
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.4
  })
  return (
    <group {...props}>
      <Interactive onSelect={() => onSelect('kubernetes')}>
        {(h) => (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.14, 7]} />
              <meshStandardMaterial color={h ? '#5c8dff' : '#326ce5'} roughness={0.5} flatShading {...hoverGlow(h, '#7aa8ff')} />
            </mesh>
            <group ref={ref} position={[0, 0, 0.08]}>
              <mesh>
                <torusGeometry args={[0.22, 0.035, 8, 24]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
              {Array.from({ length: 7 }).map((_, i) => {
                const a = (i / 7) * Math.PI * 2
                return (
                  <mesh key={i} position={[Math.cos(a) * 0.15, Math.sin(a) * 0.15, 0]} rotation={[0, 0, a + Math.PI / 2]}>
                    <boxGeometry args={[0.03, 0.3, 0.03]} />
                    <meshStandardMaterial color="#ffffff" />
                  </mesh>
                )
              })}
              <mesh>
                <sphereGeometry args={[0.05, 10, 8]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          </group>
        )}
      </Interactive>
    </group>
  )
}

function GpuCard({ onSelect, ...props }) {
  const glow = useRef()
  useFrame(({ clock }) => {
    if (glow.current) glow.current.emissiveIntensity = 1.6 + Math.sin(clock.elapsedTime * 3) * 0.6
  })
  return (
    <group {...props}>
      <Interactive onSelect={() => onSelect('gpu')}>
        {(h) => (
          <group>
            <RoundedBox args={[1.0, 0.18, 0.5]} radius={0.04} castShadow>
              <meshStandardMaterial color={h ? '#4a4a4a' : '#2b2b2b'} metalness={0.4} roughness={0.45} {...hoverGlow(h, '#76b900')} />
            </RoundedBox>
            {[-0.24, 0.24].map((x) => (
              <mesh key={x} position={[x, 0.1, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.03, 20]} />
                <meshStandardMaterial color="#111" />
              </mesh>
            ))}
            <mesh position={[0, 0.02, 0.255]}>
              <boxGeometry args={[0.9, 0.04, 0.01]} />
              <meshStandardMaterial ref={glow} color="#76b900" emissive="#76b900" emissiveIntensity={2} toneMapped={false} />
            </mesh>
          </group>
        )}
      </Interactive>
    </group>
  )
}

function Containers({ onSelect, ...props }) {
  return (
    <group {...props}>
      <Interactive onSelect={() => onSelect('containers')} hoverScale={1.1}>
        {(h) => (
          <group>
            {[
              [0, 0.2, 0, '#2f8fd8'],
              [0.62, 0.2, 0.1, '#6a52b5'],
              [0.3, 0.6, 0.05, '#3aa0e8'],
            ].map(([x, y, z, c], i) => (
              <group key={i} position={[x, y, z]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.58, 0.4, 0.4]} />
                  <meshStandardMaterial color={c} roughness={0.6} {...hoverGlow(h, '#7fd0ff')} />
                </mesh>
                {/* nervaduras del contenedor */}
                {[-0.2, -0.1, 0, 0.1, 0.2].map((rx) => (
                  <mesh key={rx} position={[rx, 0, 0.205]}>
                    <boxGeometry args={[0.025, 0.34, 0.01]} />
                    <meshStandardMaterial color="#ffffff" transparent opacity={0.35} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        )}
      </Interactive>
    </group>
  )
}

function Shield({ onSelect, ...props }) {
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.42)
    s.quadraticCurveTo(0.18, 0.36, 0.34, 0.36)
    s.lineTo(0.32, 0.0)
    s.quadraticCurveTo(0.28, -0.28, 0, -0.44)
    s.quadraticCurveTo(-0.28, -0.28, -0.32, 0.0)
    s.lineTo(-0.34, 0.36)
    s.quadraticCurveTo(-0.18, 0.36, 0, 0.42)
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 })
    g.center()
    return g
  }, [])
  return (
    <group {...props}>
      <Interactive onSelect={() => onSelect('secops')}>
        {(h) => (
          <group>
            <mesh geometry={geo} castShadow>
              <meshStandardMaterial color={h ? '#a568e0' : '#7d3fc0'} roughness={0.5} {...hoverGlow(h, '#c99bff')} />
            </mesh>
            <mesh position={[0, 0.02, 0.1]} scale={0.6} geometry={geo}>
              <meshStandardMaterial color="#c9a8ef" roughness={0.5} />
            </mesh>
          </group>
        )}
      </Interactive>
    </group>
  )
}

function Gear({ speed = 0.5, size = 0.25, ...props }) {
  const ref = useRef()
  useFrame((_, dt) => ref.current && (ref.current.rotation.z += dt * speed))
  return (
    <group {...props}>
      <group ref={ref}>
        <mesh castShadow>
          <cylinderGeometry args={[size, size, 0.08, 16]} />
          <meshStandardMaterial color="#9aa0a6" metalness={0.5} roughness={0.4} />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * size, 0, Math.sin(a) * size]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.1, 0.08, 0.08]} />
              <meshStandardMaterial color="#9aa0a6" metalness={0.5} roughness={0.4} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

function Terminal(props) {
  const tex = useMemo(() => makeTextTexture(['$ kubectl apply', '$ terraform plan', '✔ deploy OK'], { bg: '#0d1b12', fg: '#7dff8a', font: 'bold 40px monospace', border: false }), [])
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.7, 0.5, 0.08]} />
        <meshStandardMaterial color="#3b3f45" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.01, 0.045]}>
        <planeGeometry args={[0.6, 0.38]} />
        <meshStandardMaterial map={tex} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, -0.33, 0]}>
        <boxGeometry args={[0.08, 0.18, 0.06]} />
        <meshStandardMaterial color="#3b3f45" />
      </mesh>
    </group>
  )
}

/** Colocar un objeto sobre un escalón, desplazado lateralmente */
function onStep(i, lateral = 0, outward = 0.15, lift = 0.4) {
  const s = stepTransform(i)
  const tx = -Math.sin(s.angle)
  const tz = Math.cos(s.angle)
  return {
    position: [s.x + tx * lateral + Math.cos(s.angle) * outward, s.height + lift, s.z + tz * lateral + Math.sin(s.angle) * outward],
    rotation: [0, s.facing, 0],
  }
}

function onGround(angle, radius, y = 0.3) {
  return {
    position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
    rotation: [0, Math.atan2(Math.cos(angle), Math.sin(angle)), 0],
  }
}

export default function Achievements({ onSelect }) {
  const selectLogo = (key) => onSelect({ kind: 'logo', id: key })
  const selectSign = (id) => onSelect({ kind: 'sign', ...SIGNS.find((s) => s.id === id) })
  const F = Math.PI / 4 // frente (hacia la cámara)

  return (
    <group>
      {SIGNS.map((s) => (
        <Sign key={s.id} data={s} onSelect={onSelect} />
      ))}

      <AwsBlock onSelect={selectLogo} {...onGround(F + 0.3, 5.35, 0.45)} />
      <KubernetesWheel onSelect={selectLogo} {...onGround(F - 1.45, 5.0, 0.5)} />
      <GpuCard onSelect={selectLogo} {...onStep(16, 0, 0.1, 0.3)} />
      <Shield onSelect={() => selectSign('secops')} {...onStep(21, 0, 0.25, 0.6)} />
      <Terminal {...onStep(24, 0.1, -0.05, 0.45)} />

      <TerraformBlock onSelect={selectLogo} {...onGround(F - 0.75, 5.0, 0.55)} />
      <Containers onSelect={selectLogo} {...onGround(F + 0.85, 4.95, 0.02)} />

      <Gear {...onGround(F - 0.25, 4.0, 0.9)} rotation={[Math.PI / 2, 0, 0]} />
      <Gear {...onGround(F - 0.38, 4.1, 0.65)} size={0.16} speed={-0.8} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

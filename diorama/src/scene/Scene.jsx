import { Suspense } from 'react'
import { OrthographicCamera, OrbitControls, ContactShadows, Sparkles } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import Base from './Base'
import Mountain, { TOP_Y, stepTransform } from './Mountain'
import Character from './Character'
import { Clouds, Sun } from './Clouds'
import Achievements from './Achievements'

const deg = (d) => (d * Math.PI) / 180

function Lights() {
  const nv = stepTransform(23)
  return (
    <>
      <ambientLight intensity={0.55} color="#ffe2c4" />
      <hemisphereLight args={['#bfe3ff', '#7a5a3a', 0.55]} />
      <directionalLight
        position={[7, 13, 5]}
        intensity={2.2}
        color="#fff1dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={6}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={40}
      />
      {/* Luz de relleno anaranjada (atardecer) desde la derecha */}
      <directionalLight position={[-6, 4, 8]} intensity={0.45} color="#ffb070" />
      {/* Toque verde en la zona NVIDIA */}
      <pointLight position={[nv.x * 1.25, nv.height + 1.0, nv.z * 1.25]} color="#76ff1a" intensity={6} distance={4.5} decay={2} />
    </>
  )
}

export default function Scene({ onSelect, onCharacterClick }) {
  const { size } = useThree()
  // Zoom responsivo para que el diorama quepa en cualquier pantalla
  const zoom = Math.min(size.width, size.height * 1.1) / 15.5

  return (
    <>
      <OrthographicCamera makeDefault position={[14, 11, 14]} zoom={zoom} near={-50} far={200} />
      <OrbitControls
        target={[0, 2.3, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={deg(30)}
        maxPolarAngle={deg(80)}
        minZoom={zoom * 0.7}
        maxZoom={zoom * 2.6}
        rotateSpeed={0.6}
      />
      <Lights />

      <group position={[0, -1.4, 0]}>
        <Base />
        <Mountain />
        {/* Pedestal: cara superior en TOP_Y + 0.4, radio 1.05 (diámetro 2.1).
            El modelo mide ~1 unidad de alto → scale 3 ≈ 1.5 × diámetro de la cima.
            rotation π/4: el frente del GLB (+Z) mira a la cámara inicial en [14, 11, 14]. */}
        <Suspense fallback={null}>
          <Character position={[0, TOP_Y + 0.4, 0]} rotation={[0, Math.PI / 4, 0]} scale={3} onClick={onCharacterClick} />
        </Suspense>
        <Achievements onSelect={onSelect} />
        <Clouds />
        <Sun />
        <Sparkles count={40} scale={[10, 6, 10]} position={[0, 4, 0]} size={3} speed={0.3} color="#fff3b0" opacity={0.7} />
        <ContactShadows position={[0, -1.3, 0]} opacity={0.35} scale={18} blur={2.5} far={4} />
      </group>
    </>
  )
}

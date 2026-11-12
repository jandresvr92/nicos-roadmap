import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './scene/Scene'
import UI from './ui/UI'

export default function App() {
  const [selected, setSelected] = useState(null)
  const [birthdayOpen, setBirthdayOpen] = useState(false)

  return (
    <div className={`app ${birthdayOpen ? 'split' : ''}`}>
      <div className="stage">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
          onPointerMissed={() => setSelected(null)}
        >
          <Suspense fallback={null}>
            <Scene onSelect={setSelected} onCharacterClick={() => setBirthdayOpen(true)} />
          </Suspense>
        </Canvas>
      </div>
      <UI
        selected={selected}
        onCloseSelected={() => setSelected(null)}
        birthdayOpen={birthdayOpen}
        setBirthdayOpen={setBirthdayOpen}
      />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, useCursor, useGLTF } from '@react-three/drei'

// BASE_URL respeta el `base: './'` de Vite, así el modelo carga tanto en
// `npm run dev` como en un build servido desde una subcarpeta.
const MODEL_URL = `${import.meta.env.BASE_URL}funko-amigo.glb`

// Opcional: si la página incluye el modelo embebido en base64 (window.__FUNKO_GLB__,
// útil en hostings que no sirven archivos .glb), se parsea en memoria sin red.
// En el proyecto normal esta variable no existe y useGLTF descarga el .glb.
let embeddedBuffer
const extendLoader =
  typeof window !== 'undefined' && window.__FUNKO_GLB__
    ? (loader) => {
        if (!embeddedBuffer) {
          const bin = atob(window.__FUNKO_GLB__)
          const bytes = new Uint8Array(bin.length)
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
          embeddedBuffer = bytes.buffer
        }
        loader.load = (_url, onLoad, _onProgress, onError) => loader.parse(embeddedBuffer, '', onLoad, onError)
      }
    : undefined

/**
 * Figura tipo Funko cargada desde GLB.
 * El origen del grupo es la planta de los pies (Y = 0) gracias a <Center top>.
 */
export default function Character({ onClick, ...props }) {
  const { scene } = useGLTF(MODEL_URL, true, true, extendLoader)
  const float = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  // Acabado vinilo/clay mate: sin brillo metálico para que la textura se lea nítida
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return
      child.castShadow = true
      child.receiveShadow = true
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((m) => {
        if (!m) return
        m.roughness = 0.85
        m.metalness = 0.05
        // Los mapas metal/rugosidad de modelos IA multiplican los valores de arriba;
        // se quitan para que el acabado mate sea uniforme.
        m.metalnessMap = null
        m.roughnessMap = null
        m.needsUpdate = true
      })
    })
  }, [scene])

  // Respiración / flotación sutil
  useFrame((state) => {
    const t = state.clock.elapsedTime
    float.current.position.y = (Math.sin(t * 2) + 1) * 0.04
    float.current.rotation.y = Math.sin(t * 0.7) * 0.12
    float.current.scale.y = 1 + Math.sin(t * 2 + 0.6) * 0.01
  })

  return (
    <group {...props}>
      <group
        ref={float}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => (e.stopPropagation(), onClick?.())}
      >
        {/* top: pies en Y = 0. X/Z sin centrar: el cuerpo ya está en el eje del modelo y
            centrar la caja (que incluye el trofeo) desplazaría al personaje del pedestal. */}
        <Center top disableX disableZ>
          <primitive object={scene} />
        </Center>
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_URL, true, true, extendLoader)

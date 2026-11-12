import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'

const tmp = new THREE.Vector3()

/**
 * Envoltura interactiva: al pasar el cursor se agranda suavemente y avisa a sus
 * hijos (render-prop) para que cambien de color; al hacer click llama onSelect.
 */
export default function Interactive({ children, onSelect, hoverScale = 1.15, ...props }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useFrame((_, dt) => {
    if (!ref.current) return
    const s = hovered ? hoverScale : 1
    ref.current.scale.lerp(tmp.set(s, s, s), 1 - Math.exp(-dt * 12))
  })

  return (
    <group
      ref={ref}
      {...props}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.()
      }}
    >
      {typeof children === 'function' ? children(hovered) : children}
    </group>
  )
}

/** Props de material para el "brillo" al pasar el cursor */
export const hoverGlow = (hovered, color = '#ffd27a') => ({
  emissive: hovered ? color : '#000000',
  emissiveIntensity: hovered ? 0.45 : 0,
})

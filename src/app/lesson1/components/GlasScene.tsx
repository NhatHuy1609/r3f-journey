import React, { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface GlassMaterialProps {
  color?: string
  thickness?: number
  roughness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  transmission?: number
  ior?: number
  reflectivity?: number
}

const GlassMaterial: React.FC<GlassMaterialProps> = ({
  color = '#ffffff',
  thickness = 0.5,
  roughness = 0.1,
  clearcoat = 1.0,
  clearcoatRoughness = 0.1,
  transmission = 0.95,
  ior = 1.5,
  reflectivity = 0.2
}) => {
  // Glass material needs a good environment map to show reflections
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0}
      roughness={roughness}
      transmission={transmission} // Transparency
      transparent={true}
      thickness={thickness} // Glass thickness for refraction
      ior={ior} // Index of refraction
      clearcoat={clearcoat} // Clear coating layer
      clearcoatRoughness={clearcoatRoughness}
      envMapIntensity={1}
      reflectivity={reflectivity}
      side={THREE.DoubleSide} // Important for glass
      attenuationDistance={0.5} // How far light goes through the material
      attenuationColor='#ffffff' // Tint as light passes through
    />
  )
}

// A simple drinking glass
function GlassObject() {
  const ref = useRef<THREE.Group>(null)

  // Rotate slightly
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <group ref={ref}>
      {/* Glass body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 2, 32]} />
        <GlassMaterial transmission={0.95} color='#cbdff2' />
      </mesh>

      {/* Bottom of glass (thicker) */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
        <GlassMaterial transmission={0.8} thickness={1} color='#cbdff2' />
      </mesh>
    </group>
  )
}

// Main scene component with environment
export default function GlassScene() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach='background' args={['#f5f5f5']} />

        {/* Environment is crucial for realistic glass */}
        <Environment preset='apartment' background={false} />

        {/* Some scene lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.2} color='#fff' />

        {/* Our glass object */}
        <GlassObject />

        {/* A surface for the glass to sit on and show shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color='#f0f0f0' />
        </mesh>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  )
}

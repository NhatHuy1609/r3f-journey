import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, RoundedBox, Text3D } from '@react-three/drei'
import * as THREE from 'three'

// Interface definitions
interface VesselProps {
  position?: [number, number, number]
  color?: string
  scale?: number
}

interface FloatingCubesProps {
  count?: number
  radius?: number
}

interface CustomExtrudedShapeProps {
  position?: [number, number, number]
}

interface CompoundObjectProps {
  position?: [number, number, number]
}

// A custom geometry using LatheGeometry
const Vessel: React.FC<VesselProps> = ({ position = [0, 0, 0], color = 'teal', scale = 1 }) => {
  const points: THREE.Vector2[] = []
  for (let i = 0; i < 10; i++) {
    const radius = Math.sin(i * 0.2) * 0.5 + 0.5
    points.push(new THREE.Vector2(radius * scale, i * 0.2 * scale))
  }

  return (
    <mesh position={position}>
      <latheGeometry args={[points, 20]} />
      <meshPhongMaterial color={color} shininess={100} />
    </mesh>
  )
}

// A component for creating small floating cubes using instanced meshes
const FloatingCubes: React.FC<FloatingCubesProps> = ({ count = 50, radius = 5 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useRef<THREE.Object3D>(new THREE.Object3D()).current

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const time = clock.getElapsedTime()

    // Update each instance's matrix
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const speed = 0.1 + (i % 5) * 0.05

      dummy.position.set(
        Math.cos(angle + time * speed) * radius,
        Math.sin(time * 0.5 + i) * 2,
        Math.sin(angle + time * speed) * radius
      )

      dummy.rotation.set(time * 0.5 + i, time * 0.3 + i, time * 0.2 + i)

      dummy.scale.setScalar(Math.sin(time + i) * 0.2 + 0.8)

      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshPhongMaterial color='hotpink' />
    </instancedMesh>
  )
}

// An extruded custom shape
const CustomExtrudedShape: React.FC<CustomExtrudedShapeProps> = ({ position = [0, 0, 0] }) => {
  const shape = new THREE.Shape()

  // Create a star shape
  const points = 5
  const outerRadius = 1
  const innerRadius = 0.5

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (i / (points * 2)) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    if (i === 0) {
      shape.moveTo(x, y)
    } else {
      shape.lineTo(x, y)
    }
  }

  shape.closePath()

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 2,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3
  }

  // Animate rotation
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = clock.getElapsedTime() * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color='gold' metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

// An interactive compound object
const CompoundObject: React.FC<CompoundObjectProps> = ({ position = [0, 0, 0] }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)

  // Animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * (active ? 2 : 0.5)
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive(!active)}
      scale={active ? 1.2 : 1}
    >
      {/* Base */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 0.5, 32]} />
        <meshStandardMaterial color={hovered ? 'lightblue' : 'royalblue'} metalness={0.4} roughness={0.7} />
      </mesh>

      {/* Middle section */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshStandardMaterial color={hovered ? 'lightgreen' : 'forestgreen'} metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Top decoration */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.5, 0.7, 32]} />
        <meshStandardMaterial color={hovered ? 'coral' : 'tomato'} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Side decorations - using RoundedBox from drei */}
      {[0, 1, 2, 3].map((i) => (
        <RoundedBox
          key={i}
          args={[0.25, 0.25, 0.25]}
          radius={0.05}
          position={[Math.cos((i * Math.PI) / 2) * 0.8, 0, Math.sin((i * Math.PI) / 2) * 0.8]}
        >
          <meshStandardMaterial color={hovered ? 'gold' : 'orange'} metalness={0.7} roughness={0.3} />
        </RoundedBox>
      ))}
    </group>
  )
}

// Main scene component
const ComplexScene: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }} shadows>
        <color attach='background' args={['#ffffff']} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight position={[-5, 8, -5]} angle={0.3} penumbra={0.8} intensity={1.5} color='lightblue' castShadow />

        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} />

        {/* Scene contents */}
        <group position={[0, -1, 0]}>
          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial color='#f1f1f1' roughness={0.8} metalness={0.2} />
          </mesh>

          {/* Our custom geometries */}
          <Vessel position={[-4, 1, -2]} color='teal' />
          <Vessel position={[-4, 1, 2]} color='purple' scale={0.8} />

          <CustomExtrudedShape position={[4, 2, 0]} />

          <CompoundObject position={[0, 1.5, 0]} />

          <FloatingCubes count={100} radius={7} />
        </group>

        {/* Controls */}
        <OrbitControls enableDamping dampingFactor={0.1} />
      </Canvas>
    </div>
  )
}

export default ComplexScene

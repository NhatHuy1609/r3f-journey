import React from 'react'

import { Mesh } from 'three'
import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls, Stats } from '@react-three/drei'
import { useRef, useState } from 'react'

interface BoxProps {
  position?: [number, number, number]
  color?: string
}

function Box({ position = [0, 0, 0], color = 'orange' }: BoxProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHover] = useState(false)
  const [clicked, setClick] = useState(false)

  return (
    <mesh
      ref={meshRef}
      scale={clicked ? 2 : 1}
      position={position}
      onClick={() => setClick(!clicked)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      {/* <meshStandardMaterial color={hovered ? 'hotpink' : color} /> */}
      <meshPhongMaterial color={hovered ? 'hotpink' : color} />
    </mesh>
  )
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color='#f0f0f0' />
    </mesh>
  )
}

export default function ThreeScene() {
  return (
    <div className='w-full h-[500px]'>
      <Canvas shadows camera={{ position: [3, 3, 3], fov: 60 }}>
        {/* Background color */}
        <color attach='background' args={['#202030']} />

        {/* Lights */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={1024} />
        <spotLight position={[-5, -5, -5]} angle={0.15} penumbra={1} intensity={0.5} castShadow />

        {/* Objects */}
        <Box position={[0, 0, 0.5]} />
        <Floor />

        {/* Grid helper */}
        <Grid infiniteGrid cellSize={1} cellThickness={0.6} sectionSize={3} sectionThickness={1.5} />

        {/* Controls */}
        <OrbitControls />

        {/* Stats */}
        <Stats />
      </Canvas>
    </div>
  )
}

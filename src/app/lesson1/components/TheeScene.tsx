import React, { useRef, useEffect, useState } from 'react'

import { Mesh, AxesHelper, Light, DirectionalLight } from 'three'
import { Canvas } from '@react-three/fiber'
import { Grid, OrbitControls, Stats } from '@react-three/drei'

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

function Sphere({ position = [0, 0, 0], color = 'blue' }: { position?: [number, number, number]; color?: string }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
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

function Axes() {
  const axesRef = useRef<AxesHelper>(null)
  return <primitive ref={axesRef} object={new AxesHelper(5)} />
}

export default function ThreeScene() {
  const lightRef = useRef<DirectionalLight>(null)
  const [shadowMapSize, setShadowMapSize] = useState(1024)

  useEffect(() => {
    if (lightRef.current) {
      const light = lightRef.current
      light.shadow.mapSize.set(shadowMapSize, shadowMapSize) // Update size
      light.shadow.map = null // Dispose old map
      light.shadow.needsUpdate = true // Force re-render
    }
  }, [shadowMapSize])

  return (
    <div className='w-full h-[500px]'>
      <Canvas shadows camera={{ position: [3, 3, 3], fov: 60 }}>
        {/* Background color */}
        <color attach='background' args={['#202030']} />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight
          ref={lightRef}
          position={[5, 5, 5]}
          intensity={8}
          castShadow
          shadow-mapSize={1024}
          // shadow-camera-near={0.1}
          // shadow-camera-far={20}
          // shadow-camera-left={-5}
          // shadow-camera-right={5}
          // shadow-camera-top={5}
          // shadow-camera-bottom={-5}
        />
        {/* <spotLight position={[-5, -5, -5]} angle={0.15} penumbra={1} intensity={0.5} castShadow /> */}

        {/* Objects */}
        {/* <Box position={[0, 0, 0.5]} /> */}
        <Sphere position={[0, 0, 0]} />
        <Floor />

        {/* Grid helper */}
        <Grid infiniteGrid cellSize={1} cellThickness={0.4} sectionSize={3} sectionThickness={0.1} />

        {/* Controls */}
        <OrbitControls />

        {/* Axes */}
        <Axes />

        {/* Stats */}
        <Stats />
      </Canvas>
      <button onClick={() => setShadowMapSize(512)}>Click me to change</button>
    </div>
  )
}

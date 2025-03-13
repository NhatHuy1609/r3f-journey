import React, { useRef, useEffect, useState } from 'react'

import * as THREE from 'three'
import { Mesh, AxesHelper, Light, DirectionalLight, MathUtils } from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Grid, OrbitControls, Stats } from '@react-three/drei'
import { PerspectiveCamera } from '@react-three/drei'

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

function AnimatedCamera({
  targetFov,
  targetPosition,
  targetLookAt
}: {
  targetFov: number
  targetPosition: THREE.Vector3
  targetLookAt: THREE.Vector3
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, targetFov, 0.05)
      cameraRef.current.updateProjectionMatrix()

      // Smoothly update position
      cameraRef.current.position.lerp(targetPosition, 0.05)

      // Cập nhật hướng nhìn
      const lookAt = new THREE.Vector3().lerpVectors(
        cameraRef.current.getWorldDirection(new THREE.Vector3()),
        targetLookAt,
        0.05
      )
      cameraRef.current.lookAt(lookAt)
    }
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault position={targetPosition} fov={75} />
}

export default function ThreeScene() {
  const lightRef = useRef<DirectionalLight>(null)
  const [shadowMapSize, setShadowMapSize] = useState(1024)
  const [targetFov, setTargetFov] = useState(75)
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(5, 5, 8))
  const [targetLookAt, setTargetLookAt] = useState(new THREE.Vector3(0, 0, 0))

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
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 60 }}>
        {/* <AnimatedCamera targetFov={targetFov} targetPosition={targetPosition} targetLookAt={targetLookAt} /> */}
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
        {/* <Sphere position={[0, 0, 0]} /> */}
        {/* <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial
            color='#ffcca6' // Base skin tone
            metalness={0}
            roughness={0.5}
            transmission={0.1} // Slight translucency
            thickness={2} // Material thickness
            attenuationDistance={0.5} // How far light travels inside
            attenuationColor='#ff8080' // Reddish interior (like blood under skin)
            clearcoat={0.1} // Slight oiliness of skin
            clearcoatRoughness={0.8}
            sheen={0.3} // The subtle highlight on skin
            sheenColor='#ffcca6'
            sheenRoughness={0.8}
          />
        </mesh> */}

        <mesh position={[0, 1, 0]} castShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhongMaterial shininess={100} color='red' specular='0xffffff' />
        </mesh>

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
      <div className='flex flex-col gap-2'>
        <button onClick={() => setShadowMapSize(2048)}>Click me to change</button>
        <button
          onClick={() => {
            setTargetFov(40)
            setTargetPosition(new THREE.Vector3(10, 5, 10))
          }}
        >
          Zoom In
        </button>

        <button
          onClick={() => {
            setTargetFov(75)
            setTargetPosition(new THREE.Vector3(5, 5, 8))
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            setTargetFov(50)
            setTargetPosition(new THREE.Vector3(10, 1, 8)) // Di chuyển ngang và thấp dần
            setTargetLookAt(new THREE.Vector3(0, 0, 0)) // Nhìn về vật thể
          }}
        >
          Start Animation
        </button>
      </div>
    </div>
  )
}

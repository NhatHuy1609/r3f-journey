// import React, { useRef, useMemo } from 'react'
// import { Canvas, useFrame, useLoader } from '@react-three/fiber'
// import { OrbitControls, Environment, useTexture } from '@react-three/drei'
// import * as THREE from 'three'

// // Car paint material component
// interface CarPaintProps {
//   baseColor?: string
//   flakeColor?: string
//   clearcoat?: number
//   clearcoatRoughness?: number
//   metalness?: number
//   roughness?: number
//   flakeScale?: number
//   flakeIntensity?: number
// }

// const CarPaintMaterial: React.FC<CarPaintProps> = ({
//   baseColor = '#ff0000',
//   flakeColor = '#ffffff',
//   clearcoat = 1,
//   clearcoatRoughness = 0.1,
//   metalness = 0.9,
//   roughness = 0.5,
//   flakeScale = 100,
//   flakeIntensity = 0.3
// }) => {
//   // Create a noise texture for the metallic flakes
//   const flakeTexture = useMemo(() => {
//     // Generate a texture programmatically
//     const size = 512
//     const data = new Uint8Array(size * size * 4)

//     for (let i = 0; i < size * size * 4; i += 4) {
//       // Random flake spots (sparse)
//       const v = Math.random() > 0.95 ? 255 : 0

//       data[i] = v // R
//       data[i + 1] = v // G
//       data[i + 2] = v // B
//       data[i + 3] = v ? 255 : 0 // A
//     }

//     const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping
//     texture.repeat.set(flakeScale, flakeScale)
//     texture.needsUpdate = true

//     return texture
//   }, [flakeScale])

//   return (
//     <meshPhysicalMaterial
//       color={baseColor}
//       metalness={metalness}
//       roughness={roughness}
//       clearcoat={clearcoat}
//       clearcoatRoughness={clearcoatRoughness}
//       // Use the flake texture as a roughness map
//       // This creates the illusion of small metallic flakes
//       roughnessMap={flakeTexture}
//       roughnessMapTransform={new THREE.Matrix3().scale(flakeScale, flakeScale)}
//       metalnessMap={flakeTexture}
//       metalnessMapTransform={new THREE.Matrix3().scale(flakeScale, flakeScale)}
//       // Make the flakes also slightly change the normal direction
//       normalScale={new THREE.Vector2(flakeIntensity, flakeIntensity)}
//       envMapIntensity={1.5}
//       // Add a slight color shift based on view angle
//       attenuationColor={flakeColor}
//       attenuationDistance={5}
//     />
//   )
// }

// // A simple car component
// function CarModel() {
//   const carRef = useRef<THREE.Group>(null)

//   useFrame(({ clock }) => {
//     if (carRef.current) {
//       carRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.5
//     }
//   })

//   return (
//     <group ref={carRef}>
//       {/* Car body - simplified as a modified box */}
//       <mesh>
//         <boxGeometry args={[3, 0.8, 1.5]} />
//         <CarPaintMaterial baseColor='#1a3faa' flakeColor='#88ccff' flakeScale={200} flakeIntensity={0.2} />
//       </mesh>

//       {/* Car roof */}
//       <mesh position={[0, 0.6, 0]}>
//         <boxGeometry args={[2, 0.4, 1.2]} />
//         <CarPaintMaterial baseColor='#1a3faa' flakeColor='#88ccff' flakeScale={200} flakeIntensity={0.2} />
//       </mesh>

//       {/* Windshield */}
//       <mesh position={[0.9, 0.4, 0]} rotation={[0, 0, Math.PI / 8]}>
//         <planeGeometry args={[0.8, 0.5]} />
//         <meshPhysicalMaterial
//           color='#ffffff'
//           metalness={0}
//           roughness={0.1}
//           transmission={0.9}
//           transparent={true}
//           thickness={0.05}
//           ior={1.5}
//           side={THREE.DoubleSide}
//         />
//       </mesh>

//       {/* Wheels */}
//       {[
//         [-0.8, -0.5, 0.8], // front-right
//         [-0.8, -0.5, -0.8], // front-left
//         [0.8, -0.5, 0.8], // back-right
//         [0.8, -0.5, -0.8] // back-left
//       ].map((position, index) => (
//         <mesh key={index} position={position}>
//           <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} rotation={[0, 0, Math.PI / 2]} />
//           <meshStandardMaterial color='black' roughness={0.8} />
//         </mesh>
//       ))}
//     </group>
//   )
// }

// // Main scene component
// export default function CarScene() {
//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <Canvas camera={{ position: [4, 2, 4], fov: 50 }} shadows>
//         <color attach='background' args={['#202020']} />

//         {/* Environment is crucial for reflective materials */}
//         <Environment preset='sunset' background={false} />

//         {/* Scene lighting */}
//         <ambientLight intensity={0.2} />
//         <spotLight
//           position={[5, 10, 5]}
//           angle={0.3}
//           penumbra={0.8}
//           intensity={1}
//           castShadow
//           shadow-mapSize-width={2048}
//           shadow-mapSize-height={2048}
//         />
//         <spotLight position={[-5, 5, -5]} angle={0.3} penumbra={0.8} intensity={0.5} color='#ffaa00' />

//         {/* Our car model */}
//         <CarModel />

//         {/* Floor */}
//         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
//           <planeGeometry args={[20, 20]} />
//           <meshStandardMaterial roughness={0.8} metalness={0.2} color='#333333' />
//         </mesh>

//         <OrbitControls minPolarAngle={0.2} maxPolarAngle={Math.PI / 2 - 0.1} enablePan={false} />
//       </Canvas>
//     </div>
//   )
// }

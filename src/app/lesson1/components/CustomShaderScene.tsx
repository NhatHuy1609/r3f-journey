// import React, { useRef } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { shaderMaterial } from '@react-three/drei'
// import * as THREE from 'three'
// import { extend } from '@react-three/fiber'

// // Define shader material
// const WaveMaterial = shaderMaterial(
//   // Uniform values that get passed to shader
//   {
//     uTime: 0,
//     uColor: new THREE.Color(0.0, 0.5, 1.0),
//     uNoiseFreq: 3.0,
//     uNoiseAmp: 0.2
//   },
//   // Vertex shader
//   `
//     uniform float uTime;
//     uniform float uNoiseFreq;
//     uniform float uNoiseAmp;

//     varying vec2 vUv;
//     varying float vElevation;

//     // Classic Perlin 3D Noise by Stefan Gustavson
//     vec4 permute(vec4 x) {
//       return mod(((x*34.0)+1.0)*x, 289.0);
//     }
//     vec4 taylorInvSqrt(vec4 r) {
//       return 1.79284291400159 - 0.85373472095314 * r;
//     }
//     vec3 fade(vec3 t) {
//       return t*t*t*(t*(t*6.0-15.0)+10.0);
//     }

//     float noise(vec3 P) {
//       vec3 Pi0 = floor(P);
//       vec3 Pi1 = Pi0 + vec3(1.0);
//       Pi0 = mod(Pi0, 289.0);
//       Pi1 = mod(Pi1, 289.0);
//       vec3 Pf0 = fract(P);
//       vec3 Pf1 = Pf0 - vec3(1.0);
//       vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
//       vec4 iy = vec4(Pi0.y, Pi0.y, Pi1.y, Pi1.y);
//       vec4 iz0 = Pi0.z * vec4(1.0);
//       vec4 iz1 = Pi1.z * vec4(1.0);
//       vec4 ixy = permute(permute(ix) + iy);
//       vec4 ixy0 = permute(ixy + iz0);
//       vec4 ixy1 = permute(ixy + iz1);

//       // Shortened for brevity - this is a simplified version
//       // A complete Perlin noise implementation would go here

//       // Instead we'll use a simpler sine wave pattern
//       float result = sin(P.x * uNoiseFreq + uTime) *
//                     sin(P.y * uNoiseFreq + uTime) *
//                     sin(P.z * uNoiseFreq + uTime) * uNoiseAmp;

//       return result;
//     }

//     void main() {
//       vUv = uv;

//       // Apply the noise to vertex position
//       vec3 pos = position;
//       float noiseVal = noise(vec3(pos.x * uNoiseFreq, pos.y * uNoiseFreq, uTime));
//       pos.z += noiseVal * uNoiseAmp;
//       vElevation = noiseVal;

//       gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//     }
//   `,
//   // Fragment shader
//   `
//     uniform vec3 uColor;
//     uniform float uTime;

//     varying vec2 vUv;
//     varying float vElevation;

//     void main() {
//       // Create a gradient based on the noise elevation
//       vec3 color = mix(uColor, vec3(1.0), vElevation * 2.0 + 0.5);

//       // Add wave pattern
//       color += 0.1 * sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 + uTime);

//       gl_FragColor = vec4(color, 1.0);
//     }
//   `
// )

// // Make it available as a JSX element
// extend({ WaveMaterial })

// // Add the missing type for TypeScript
// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       waveMaterial: any
//     }
//   }
// }

// function WavingPlane() {
//   const materialRef = useRef<any>(null)

//   useFrame(({ clock }) => {
//     if (materialRef.current) {
//       materialRef.current.uTime = clock.getElapsedTime()
//     }
//   })

//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]}>
//       <planeGeometry args={[10, 10, 128, 128]} />
//       <waveMaterial ref={materialRef} side={THREE.DoubleSide} />
//     </mesh>
//   )
// }

// export default function ShaderScene() {
//   return (
//     <div style={{ width: '100%', height: '100vh' }}>
//       <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[5, 5, 5]} intensity={1} />
//         <WavingPlane />
//       </Canvas>
//     </div>
//   )
// }

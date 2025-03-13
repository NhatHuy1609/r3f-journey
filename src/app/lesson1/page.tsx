'use client'

import React from 'react'
import ClientOnly from '@/components/ClientOnly'
import ThreeScene from './components/TheeScene'
import ComplexScene from './components/ComplexScene'
import GlassScene from './components/GlasScene'

function page() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-4xl font-bold mb-8'>React Three Fiber with Next.js & TypeScript</h1>
      <ClientOnly>
        <ThreeScene />
        {/* <GlassScene /> */}
        {/* <ComplexScene /> */}
      </ClientOnly>
    </main>
  )
}

export default page

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Float, PresentationControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function LoadedGemModel() {
  const group = useRef<THREE.Group>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  
  // Load the 3D model from your public folder
  const { scene } = useGLTF('/gem.glb')

  // We recreate our stunning sapphire material here
  const gemMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#0055ff",       // Deep sapphire blue
    transmission: 0.95,     // Glass-like transparency
    opacity: 1,
    metalness: 0,
    roughness: 0.02,        // Very smooth
    ior: 2.4,               // Diamond index of refraction
    thickness: 3.0,         // Volume for light bending
    clearcoat: 1,
  }), [])

  // This finds the shape inside your downloaded model and applies our realistic gem material to it
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = gemMaterial
      }
    })
  }, [scene, gemMaterial])

  // Spin the model unless the user clicks it
  useFrame((_, delta) => {
    if (group.current && !isInteracting) {
      group.current.rotation.y += delta * 0.4
    }
  })

  return (
    <group 
      ref={group}
      onPointerDown={() => setIsInteracting(true)}
      onPointerUp={() => setIsInteracting(false)}
      onPointerOut={() => setIsInteracting(false)}
    >
      {/* If your model is too big or small, change scale from [1, 1, 1] to something else like [2, 2, 2] or [0.5, 0.5, 0.5] */}
      <primitive object={scene} scale={[1, 1, 1]} position={[0, 0, 0]} />
    </group>
  )
}

export default function Hero3DGem() {
  return (
    // Notice there is NO background image here. It is totally transparent so your website's dark background shows naturally!
    <div className="w-full h-[420px] md:h-[560px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
        
        {/* Bright lighting so the gem sparkles */}
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={5} color="#ffffff" />
        <spotLight position={[-5, 5, -5]} angle={0.3} penumbra={1} intensity={3} color="#00aaff" />

        <PresentationControls
          rotation={[0.1, 0, 0]}
          polar={[-0.2, 0.2]} 
          azimuth={[-Math.PI / 4, Math.PI / 4]} 
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }} 
        >
          <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
            <group scale={1.5}>
              <LoadedGemModel />
            </group>
          </Float>
        </PresentationControls>

        {/* This creates the realistic shadow on the "invisible" floor of your website */}
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.5} 
          scale={15} 
          blur={2.5} 
          far={4} 
          color="#001133" 
        />
        
        {/* Environment map to give the glass something to reflect */}
        <Environment preset="city" />
        
      </Canvas>
    </div>
  )
}

// Preload the model so it renders instantly when the page loads
useGLTF.preload('/gem.glb')
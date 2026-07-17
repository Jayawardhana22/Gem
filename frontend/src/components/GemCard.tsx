import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

function FacetedGem() {
  const group = useRef<THREE.Group>(null)

  // 1. CROWN (Top): A cylinder acting as a frustum (flat top, angled sides)
  // Arguments: (radiusTop, radiusBottom, height, radialSegments)
  const crownGeometry = useMemo(() => new THREE.CylinderGeometry(0.8, 1.6, 0.8, 8), [])

  // 2. PAVILION (Bottom): A cone for the bottom point
  // Arguments: (radius, height, radialSegments)
  const pavilionGeometry = useMemo(() => new THREE.ConeGeometry(1.6, 1.6, 8), [])

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35
  })

  // 3. MATERIAL: Shared material optimized for a bright, refractive blue gem
  const gemMaterialProps = {
    color: "#0066ff",     // Bright sapphire blue
    roughness: 0.05,      // Very smooth surface
    transmission: 0.95,   // High transparency for glass/gem effect
    thickness: 2.0,       // Refraction depth
    ior: 2.4,             // Diamond-like Index of Refraction
    clearcoat: 1.0,       // Extra surface shine
    iridescence: 0.2,     // Subtle light splitting
  }

  return (
    <group ref={group}>
      {/* Shifted up by half its height (0.8 / 2 = 0.4) so its wide base sits exactly at y=0 */}
      <mesh geometry={crownGeometry} position={[0, 0.4, 0]}>
        <meshPhysicalMaterial {...gemMaterialProps} />
      </mesh>

      {/* Shifted down by half its height and flipped so its wide base also sits exactly at y=0 */}
      <mesh geometry={pavilionGeometry} position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
        <meshPhysicalMaterial {...gemMaterialProps} />
      </mesh>
    </group>
  )
}

export default function Hero3DGem() {
  return (
    <div className="w-full h-[420px] md:h-[560px]">
      <Canvas camera={{ position: [0, 0.5, 6], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        {/* Adjusted spotlights to be brighter/cooler so the blue color pops */}
        <spotLight position={[5, 8, 5]} angle={0.3} intensity={4} color="#ffffff" />
        <spotLight position={[-6, 2, -4]} angle={0.4} intensity={3} color="#00aaff" />
        
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
          <FacetedGem />
        </Float>
        
        <ContactShadows position={[0, -2.3, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
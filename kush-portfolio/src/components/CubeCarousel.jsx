import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// Darker, richer video-game green (less neon)
const CUBE_GREEN = '#3fb950'
const CUBE_GREEN_DARK = '#2ea043'
// Darker still, used for text/UI so type never looks washed-out bright
const GREEN_TEXT = '#1a7f37'

function CubeCarousel() {
  const [selectedCube, setSelectedCube] = useState(null)
  const [cameraPosition, setCameraPosition] = useState([0, 8, 25])
  const [targetCameraPosition, setTargetCameraPosition] = useState([0, 8, 25])
  const [carouselRotation, setCarouselRotation] = useState(0)
  const [targetCarouselRotation, setTargetCarouselRotation] = useState(0)

  const isModalOpen = selectedCube !== null

  const handleCubeSelect = (cubeName) => {
    setSelectedCube(cubeName)
  }

  return (
    <div className="w-full h-screen bg-white relative">
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        style={{ width: '100%', height: '100vh', position: 'relative', zIndex: 10 }}
        gl={{ antialias: true }}
      >
        {/* Pure white background */}
        <color attach="background" args={['#ffffff']} />
        <fog attach="fog" args={['#ffffff', 40, 120]} />

        {/* Soft, neutral lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[30, 30, 30]}
          intensity={0.6}
          castShadow
        />
        <directionalLight position={[-20, 20, -20]} intensity={0.2} />

        {/* True perspective grid */}
        <PerspectiveGrid />

        {/* Smooth camera controls */}
        <SmoothCameraController
          cameraPosition={cameraPosition}
          setCameraPosition={setCameraPosition}
          targetCameraPosition={targetCameraPosition}
          setTargetCameraPosition={setTargetCameraPosition}
          carouselRotation={carouselRotation}
          setCarouselRotation={setCarouselRotation}
          targetCarouselRotation={targetCarouselRotation}
          setTargetCarouselRotation={setTargetCarouselRotation}
          isModalOpen={isModalOpen}
        />

        {/* Main carousel */}
        <SmoothOrbitingCubes
          selectedCube={selectedCube}
          onSelect={handleCubeSelect}
          carouselRotation={carouselRotation}
          isModalOpen={isModalOpen}
        />
      </Canvas>

      {/* Control Panel */}
      <ControlPanel />

      {/* My Life modal panel */}
      <AnimatePresence>
        {selectedCube === 'My Life' && (
          <AboutPanel onClose={() => setSelectedCube(null)} />
        )}
      </AnimatePresence>

      {/* About Me panel */}
      <AnimatePresence>
        {selectedCube === 'About Me' && (
          <AboutMePanel onClose={() => setSelectedCube(null)} />
        )}
      </AnimatePresence>

      {/* My Experience panel */}
      <AnimatePresence>
        {selectedCube === 'My Experience' && (
          <ExperiencePanel onClose={() => setSelectedCube(null)} />
        )}
      </AnimatePresence>

      {/* My Projects panel */}
      <AnimatePresence>
        {selectedCube === 'My Projects' && (
          <ProjectsPanel onClose={() => setSelectedCube(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default CubeCarousel

function PerspectiveGrid() {
  const gridRef = useRef()
  const horizonGridRef = useRef()

  useFrame(() => {
    // Keep grids static but ensure they render properly
  })

  return (
    <group>
      {/* Floor grid extending to infinity */}
      <gridHelper
        ref={gridRef}
        args={[200, 50, '#e5e7eb', '#f3f4f6']}
        position={[0, -8, 0]}
      />

      {/* Additional horizon grid for depth */}
      <gridHelper
        ref={horizonGridRef}
        args={[100, 25, '#f3f4f6', '#f9fafb']}
        position={[0, 0, -60]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  )
}

function SmoothCameraController({
  cameraPosition,
  setCameraPosition,
  targetCameraPosition,
  setTargetCameraPosition,
  carouselRotation,
  setCarouselRotation,
  targetCarouselRotation,
  setTargetCarouselRotation,
  isModalOpen
}) {
  const { camera, gl } = useThree()
  const velocityRef = useRef({ rotation: 0, camera: [0, 0, 0] })

  useEffect(() => {
    let keysPressed = new Set()

    const handleKeyDown = (event) => {
      keysPressed.add(event.key.toLowerCase())
    }

    const handleKeyUp = (event) => {
      keysPressed.delete(event.key.toLowerCase())
    }

    const updateMovement = () => {
      // Stop controls when modal is open
      if (isModalOpen) {
        return
      }

      const rotSpeed = 0.02
      const camSpeed = 0.8

      // Smooth rotational velocity
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
        velocityRef.current.rotation += rotSpeed
      }
      if (keysPressed.has('d') || keysPressed.has('arrowright')) {
        velocityRef.current.rotation -= rotSpeed
      }

      // Apply damping to rotation
      velocityRef.current.rotation *= 0.95
      setTargetCarouselRotation(prev => prev + velocityRef.current.rotation)

      // Smooth camera movement
      const newTarget = [...targetCameraPosition]
      if (keysPressed.has('w') || keysPressed.has('arrowup')) {
        newTarget[1] += camSpeed
      }
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) {
        newTarget[1] -= camSpeed
      }
      if (keysPressed.has('q')) {
        newTarget[2] -= camSpeed
      }
      if (keysPressed.has('e')) {
        newTarget[2] += camSpeed
      }

      setTargetCameraPosition(newTarget)
    }

    const interval = setInterval(updateMovement, 16) // 60fps

    const handleWheel = (event) => {
      event.preventDefault()
      const delta = event.deltaY * 0.02
      setTargetCameraPosition(prev => [prev[0], prev[1], prev[2] + delta])
    }

    let isDragging = false
    let lastMouseX = 0

    const handleMouseDown = (event) => {
      isDragging = true
      lastMouseX = event.clientX
      gl.domElement.style.cursor = 'grabbing'
    }

    const handleMouseMove = (event) => {
      if (!isDragging) return
      const deltaX = event.clientX - lastMouseX
      velocityRef.current.rotation -= deltaX * 0.005 // Add to velocity for smooth inertia
      lastMouseX = event.clientX
    }

    const handleMouseUp = () => {
      isDragging = false
      gl.domElement.style.cursor = 'grab'
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    gl.domElement.addEventListener('wheel', handleWheel, { passive: false })
    gl.domElement.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    gl.domElement.style.cursor = 'grab'

    return () => {
      clearInterval(interval)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      gl.domElement.removeEventListener('wheel', handleWheel)
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [gl, setTargetCameraPosition, setTargetCarouselRotation, targetCameraPosition, isModalOpen])

  useFrame(() => {
    // Smooth lerp camera position
    setCameraPosition(prev => [
      THREE.MathUtils.lerp(prev[0], targetCameraPosition[0], 0.1),
      THREE.MathUtils.lerp(prev[1], targetCameraPosition[1], 0.1),
      THREE.MathUtils.lerp(prev[2], targetCameraPosition[2], 0.1)
    ])

    // Smooth lerp carousel rotation
    setCarouselRotation(prev => THREE.MathUtils.lerp(prev, targetCarouselRotation, 0.1))

    // Apply to camera
    camera.position.set(...cameraPosition)
    camera.lookAt(0, 0, 0)
  })

  return null
}

function SmoothOrbitingCubes({ selectedCube, onSelect, carouselRotation, isModalOpen }) {
  const groupRef = useRef()

  const orbitingCubes = [
    { id: 'About Me' },
    { id: 'My Experience' },
    { id: 'My Projects' }
  ]

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (groupRef.current) {
      // Only rotate if no modal is open
      if (!isModalOpen) {
        groupRef.current.rotation.y = time * 0.15 + carouselRotation
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Center cube */}
      <GridCube
        cube={{ id: 'My Life' }}
        index={-1}
        totalCubes={1}
        isCenter={true}
        isSelected={selectedCube === 'My Life'}
        onSelect={() => onSelect('My Life')}
      />

      {/* Orbiting cubes */}
      {orbitingCubes.map((cube, index) => (
        <GridCube
          key={cube.id}
          cube={cube}
          index={index}
          totalCubes={orbitingCubes.length}
          isCenter={false}
          isSelected={selectedCube === cube.id}
          onSelect={() => onSelect(cube.id)}
        />
      ))}
    </group>
  )
}

function PixelatedCore({ isSelected }) {
  const positions = [-0.7, 0, 0.7]
  const blockSize = 0.55

  return (
    <group>
      {positions.flatMap((x) =>
        positions.flatMap((y) =>
          positions.map((z) => (
            <mesh
              key={`${x}-${y}-${z}`}
              position={[x, y, z]}
            >
              <boxGeometry args={[blockSize, blockSize, blockSize]} />
              <meshStandardMaterial
                color={CUBE_GREEN}
                emissive={CUBE_GREEN}
                emissiveIntensity={isSelected ? 0.55 : 0.25}
                metalness={0.18}
                roughness={0.15}
              />
            </mesh>
          ))
        )
      )}
    </group>
  )
}

function GridCube({ cube, index, totalCubes, isCenter, isSelected, onSelect }) {
  const meshRef = useRef()
  const wireframeRef = useRef()
  const innerGridRef = useRef()
  const labelRef = useRef()
  const targetScale = useRef(1)
  const currentScale = useRef(1)
  const targetPosition = useRef([0, 0, 0])
  const currentPosition = useRef([0, 0, 0])

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (meshRef.current && wireframeRef.current && innerGridRef.current && labelRef.current) {
      // Center cube stays at origin
      if (isCenter) {
        targetPosition.current = [0, 0, 0]
      } else {
        // Calculate orbital position - true 3D with depth
        const angle = (index / totalCubes) * Math.PI * 2
        const radius = 10
        const heightVariation = Math.sin(angle * 2) * 2

        // Target position
        targetPosition.current = [
          Math.cos(angle) * radius,
          heightVariation,
          Math.sin(angle) * radius
        ]
      }

      // Smooth lerp position
      currentPosition.current = currentPosition.current.map((curr, i) =>
        THREE.MathUtils.lerp(curr, targetPosition.current[i], 0.08)
      )

      // Apply position to all elements
      meshRef.current.position.set(...currentPosition.current)
      wireframeRef.current.position.set(...currentPosition.current)
      innerGridRef.current.position.set(...currentPosition.current)

      // Smooth scale transition
      targetScale.current = isSelected ? 2.0 : 1.0
      currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, 0.08)

      // Add perspective scaling based on Z position
      const perspectiveScale = 1 + (currentPosition.current[2] + 10) * 0.02
      const finalScale = currentScale.current * perspectiveScale

      meshRef.current.scale.setScalar(finalScale)
      wireframeRef.current.scale.setScalar(finalScale)
      innerGridRef.current.scale.setScalar(finalScale)

      // Selected cube gentle rotation
      if (isSelected) {
        const rotSpeed = time * 0.4
        meshRef.current.rotation.y = rotSpeed
        wireframeRef.current.rotation.y = rotSpeed
        innerGridRef.current.rotation.y = rotSpeed
      }

      // Label positioning - always below cube in 3D space
      labelRef.current.position.set(
        currentPosition.current[0],
        currentPosition.current[1] - 2.5 * finalScale,
        currentPosition.current[2]
      )
    }
  })

  return (
    <group>
      {/* Semi-transparent green fill */}
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab' }}
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color={CUBE_GREEN}
          emissive={CUBE_GREEN}
          emissiveIntensity={isSelected ? 0.35 : 0.18}
          metalness={0.15}
          roughness={0.18}
          transparent
          opacity={isSelected ? 0.35 : 0.22}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group
        onClick={onSelect}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'grab' }}
      >
        <PixelatedCore isSelected={isSelected} />
      </group>

      {/* Main wireframe edges */}
      <lineSegments ref={wireframeRef} onClick={onSelect}>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 2, 2)]} />
        <lineBasicMaterial color={isSelected ? CUBE_GREEN : CUBE_GREEN_DARK} linewidth={3} />
      </lineSegments>

      {/* Internal grid structure for lattice effect */}
      <group ref={innerGridRef} onClick={onSelect}>
        {/* Face grids */}
        {[
          // Front face grid
          { pos: [0, 0, 1.001], rot: [0, 0, 0] },
          // Back face grid
          { pos: [0, 0, -1.001], rot: [0, Math.PI, 0] },
          // Right face grid
          { pos: [1.001, 0, 0], rot: [0, Math.PI/2, 0] },
          // Left face grid
          { pos: [-1.001, 0, 0], rot: [0, -Math.PI/2, 0] },
          // Top face grid
          { pos: [0, 1.001, 0], rot: [-Math.PI/2, 0, 0] },
          // Bottom face grid
          { pos: [0, -1.001, 0], rot: [Math.PI/2, 0, 0] }
        ].map((face, i) => (
          <gridHelper
            key={i}
            position={face.pos}
            rotation={face.rot}
            args={[2, 4, CUBE_GREEN_DARK, CUBE_GREEN]}
          />
        ))}
      </group>

      {/* 3D Label that moves with cube */}
      <group ref={labelRef}>
        <Html center>
          <div
            className="pixel-text px-3 py-2 rounded whitespace-nowrap pointer-events-none shadow-lg border-2"
            style={{
              backgroundColor: 'white',
              color: GREEN_TEXT,
              borderColor: CUBE_GREEN,
              fontSize: '9px'
            }}
          >
            {cube.id}
          </div>
        </Html>
      </group>
    </group>
  )
}

function ControlPanel() {
  return (
    <div
      className="absolute top-4 left-4 bg-white border-2 rounded p-4 text-xs font-mono shadow-lg max-w-xs"
      style={{ borderColor: CUBE_GREEN, color: GREEN_TEXT }}
    >
      <div className="space-y-1">
        <div><span className="font-bold">A/D or ← →</span> – Rotate carousel</div>
        <div><span className="font-bold">W/S or ↑ ↓</span> – Move camera up/down</div>
        <div><span className="font-bold">Q/E</span> – Move closer/farther</div>
        <div><span className="font-bold">Mouse Drag</span> – Rotate carousel</div>
        <div><span className="font-bold">Mouse Wheel</span> – Zoom camera</div>
        <div><span className="font-bold">Click cube</span> – Focus & view info</div>
      </div>
    </div>
  )
}

function AboutPanel({ onClose }) {
  const photos = [
    '/life/life-1.jpg',
    '/life/life-2.jpg',
    '/life/life-3.jpg',
    '/life/life-4.jpg',
    '/life/life-5.jpg',
    '/life/life-6.jpg',
    '/life/life-7.jpg',
    '/life/life-8.jpg',
    '/life/life-9.jpg'
  ]
  const [lightbox, setLightbox] = useState(null)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 9999 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-2xl font-bold hover:opacity-70 transition" style={{ color: GREEN_TEXT }}>×</button>
        <h2 className="pixel-text text-lg mb-6" style={{ color: GREEN_TEXT }}>My Life</h2>

        <div className="space-y-5">
          <p className="text-gray-700 text-base">I love building things :)</p>

          <div>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(src)}
                  className="aspect-square overflow-hidden rounded-lg border border-gray-200 group"
                >
                  <img
                    src={src}
                    alt={`Moment ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 flex items-center justify-center bg-black/80 p-6"
            style={{ zIndex: 10001 }}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightbox}
              alt="Enlarged"
              className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function AboutMePanel({ onClose }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 9999 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-2xl font-bold hover:opacity-70 transition" style={{ color: CUBE_GREEN }}>×</button>
        <div className="mb-6 flex justify-center">
          <img src="/about-me.jpg" alt="About Me" className="w-48 h-auto rounded-xl object-cover shadow-lg" style={{ maxHeight: '280px' }} />
        </div>
        <h2 className="pixel-text text-sm mb-4 text-center" style={{ color: GREEN_TEXT }}>Hi! I'm Kush</h2>
        <p className="text-gray-700 leading-relaxed text-sm mb-2">Hi! My name is Kush Patel and I'm an incoming Junior at UIUC studying CS + Econ, with a minor in statistics. I love computer science and building new products.</p>
        <p className="text-gray-700 leading-relaxed text-sm">Some of my passions including hackathons, basketball, movies, and pickleball!</p>
      </motion.div>
    </>
  )
}

function ExperiencePanel({ onClose }) {
  const experiences = [
    { title: 'Salesforce Software Engineer Intern', company: 'Salesforce', period: 'May 2026 - Present', logo: '/logos/salesforce.png' },
    { title: 'Synchrony AI Intern', company: 'Synchrony', period: 'Jan 2026 - March 2025', logo: '/logos/synchrony.png' },
    { title: 'Synchrony AI Developer Intern', company: 'Synchrony', period: 'March 2025 - Jan 2026', logo: '/logos/synchrony.png' },
    { title: 'CS128 Course Assistant', company: 'UIUC', period: 'Jan 2025 - May 2025', logo: '/logos/uiuc.png' }
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 9999 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-2xl font-bold hover:opacity-70 transition" style={{ color: GREEN_TEXT }}>×</button>
        <h2 className="pixel-text text-lg mb-8" style={{ color: GREEN_TEXT }}>My Experience</h2>

        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-lg border border-gray-200 bg-white flex items-center justify-center p-2">
                <img src={exp.logo} alt={exp.company} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{exp.title}</h3>
                <p className="font-medium" style={{ color: GREEN_TEXT }}>{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.period}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}

function ProjectCard({ project, onOpen }) {
  const hasImages = project.images && project.images.length > 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition overflow-hidden flex flex-col">
      {hasImages ? (
        <div className="overflow-hidden bg-gray-100">
          <ProjectGallery images={project.images} title={project.title} variant="card" />
        </div>
      ) : (
        <div
          className="aspect-video flex items-center justify-center pixel-text text-white text-center px-4"
          style={{ background: `linear-gradient(135deg, ${CUBE_GREEN}, ${GREEN_TEXT})`, fontSize: '11px' }}
        >
          {project.title}
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <h3 className="pixel-text mb-2" style={{ color: GREEN_TEXT, fontSize: '11px', lineHeight: 1.5 }}>{project.title}</h3>
        <p className="text-sm text-gray-700 flex-1">{project.short}</p>
        <button
          onClick={() => onOpen(project)}
          className="mt-4 self-start text-sm font-semibold px-4 py-2 rounded-lg text-white transition hover:opacity-90"
          style={{ backgroundColor: GREEN_TEXT }}
        >
          Learn more
        </button>
      </div>
    </div>
  )
}

function ProjectGallery({ images, title, variant = 'full' }) {
  const scrollRef = useRef(null)
  const isCard = variant === 'card'

  const scrollBy = (e, dir) => {
    e.stopPropagation()
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * scrollRef.current.clientWidth, behavior: 'smooth' })
    }
  }

  const imgClass = isCard
    ? 'snap-center shrink-0 w-full aspect-video object-cover'
    : 'snap-center shrink-0 w-full h-auto max-h-[420px] object-contain rounded-xl bg-gray-50 border border-gray-200'

  const arrowClass = isCard
    ? 'w-7 h-7 text-base'
    : 'w-9 h-9 text-lg'

  return (
    <div className={isCard ? 'relative group' : 'relative'}>
      <div
        ref={scrollRef}
        className={`flex gap-0 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar ${isCard ? '' : 'gap-3 rounded-xl'}`}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${title} screenshot ${i + 1}`}
            loading="lazy"
            className={imgClass}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => scrollBy(e, -1)}
            className={`absolute left-2 top-1/2 -translate-y-1/2 ${arrowClass} rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center font-bold hover:bg-white transition ${isCard ? 'opacity-0 group-hover:opacity-100' : ''}`}
            style={{ color: GREEN_TEXT }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={(e) => scrollBy(e, 1)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${arrowClass} rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center font-bold hover:bg-white transition ${isCard ? 'opacity-0 group-hover:opacity-100' : ''}`}
            style={{ color: GREEN_TEXT }}
            aria-label="Next image"
          >
            ›
          </button>
          {isCard ? (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 pointer-events-none">
              {images.map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/80 shadow" />
              ))}
            </div>
          ) : (
            <div className="mt-2 text-center text-xs text-gray-400">Scroll or use the arrows to see more ({images.length} photos)</div>
          )}
        </>
      )}
    </div>
  )
}

function ProjectDetailModal({ project, onClose }) {
  const hasImages = project.images && project.images.length > 0

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        style={{ zIndex: 10001 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] overflow-y-auto"
        style={{ zIndex: 10002 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="sticky top-0 float-right z-10 m-4 w-9 h-9 flex items-center justify-center text-2xl font-bold rounded-full bg-white/90 border border-gray-200 shadow hover:opacity-70 transition"
          style={{ color: GREEN_TEXT }}
        >
          ×
        </button>

        <div className="p-8 pt-6">
          <h2 className="pixel-text mb-6" style={{ color: GREEN_TEXT, fontSize: '16px', lineHeight: 1.5 }}>{project.title}</h2>

          {hasImages && (
            <div className="mb-6">
              <ProjectGallery images={project.images} title={project.title} />
            </div>
          )}

          <div className="space-y-4">
            {project.desc.map((paragraph, i) => (
              <p key={i} className="text-sm text-gray-700 leading-relaxed">{paragraph}</p>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="pixel-text mb-3 text-gray-500" style={{ fontSize: '9px' }}>Technologies</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-2.5 py-1 rounded-md border"
                  style={{ borderColor: CUBE_GREEN, color: GREEN_TEXT, backgroundColor: '#f2fbf4' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition hover:opacity-90"
              style={{ backgroundColor: GREEN_TEXT }}
            >
              Visit live site →
            </a>
          )}
        </div>
      </motion.div>
    </>
  )
}

function ProjectsPanel({ onClose }) {
  const [selected, setSelected] = useState(null)

  const projects = [
    {
      title: 'SafeStamp',
      link: 'https://ai-watermark-detector.onrender.com/',
      images: ['/projects/safestamp/img-1.jpg', '/projects/safestamp/img-2.jpg', '/projects/safestamp/img-3.jpg'],
      short: 'An open source platform, built at HackMIT, that proves whether an AI image is real by cryptographically tying every picture back to the prompt that created it.',
      desc: [
        'My teammate and I built SafeStamp at HackMIT after running into a problem that felt bigger than a weekend project. Nearly 80 percent of Americans now see AI misinformation as one of the technology\'s top dangers, and when we tested the popular detectors, ChatGPT, Gemini, Hive, and even a custom judge agent we wrote ourselves, none of them cracked much past 80 percent accuracy. Guessing was never going to be good enough, so we went the other direction and made authenticity something you can actually prove.',
        'SafeStamp embeds an invisible watermark directly into the pixels of an AI generated image using Least Significant Bit encoding. Each watermark is derived from a SHA-256 hash of the original prompt plus a secret key, then stored in a database that maps every image back to the exact prompt that made it. Upload an image later and the system instantly verifies its origin, all without changing anything you can see. Images are generated through Hugging Face\'s FLUX.1-schnell model and served through a Flask API with dedicated encode and verify routes.',
        'Unlike closed systems like Google SynthID or Meta\'s Stable Signature, SafeStamp is fully open source and built for classrooms, so students and teachers can read the code, watch the watermarking process happen step by step, and understand exactly why detection alone falls short. It is a real provenance system and a teaching tool at the same time.'
      ],
      tech: ['Machine Learning', 'Python', 'Flask', 'LSB Watermarking', 'SHA-256', 'SQLite', 'Hugging Face FLUX.1', 'Image Classification', 'JavaScript', 'Gradio']
    },
    {
      title: 'Productifi',
      link: null,
      images: ['/projects/productifi/img-1.jpg', '/projects/productifi/img-2.jpg', '/projects/productifi/img-3.jpg'],
      short: 'An AI focus companion that reads your camera and microphone in real time to measure how locked in you are and coach you back on track.',
      desc: [
        'I built Productifi because I wanted something smarter than a timer nagging me to get back to work. It uses computer vision to track facial expressions, head pose, and eye gaze while you work, scores your attention in real time, and recognizes emotional state to give productivity insights that actually fit the moment. When it notices you looking away or catches a sustained conversation through the Web Audio API, it steps in before a quick glance turns into a lost half hour.',
        'The coaching layer is powered by Google\'s Gemini Vision API, which delivers live personalized nudges instead of generic reminders. Sessions are fully customizable across modes like Deep Study, Coding Sprint, and Creative Flow, with strict, balanced, and monitor only focus rules and adjustable sensitivity for different environments. A live dashboard tracks attention scores, distraction counts, and streaks, then generates full analytics reports on focus consistency and distraction resistance after each session.',
        'One design choice I am proud of is that all of the vision processing happens locally in the browser, so nothing leaves your machine. It stays private by default while still feeling like a polished, startup quality product.'
      ],
      tech: ['Machine Learning', 'React 19', 'TypeScript', 'TensorFlow.js', 'MediaPipe', 'OpenCV', 'Emotion Recognition', 'Google Gemini', 'Web Audio API', 'Flask', 'SocketIO', 'Zustand', 'TailwindCSS']
    },
    {
      title: 'Starky Interactive',
      link: null,
      images: ['/projects/starky/img-3.jpg', '/projects/starky/img-1.jpg', '/projects/starky/img-2.jpg'],
      short: 'A smart autonomous bulldozer, built at HackIllinois, that uses computer vision to spot nearby workers and stop itself before anyone gets hurt.',
      desc: [
        'At HackIllinois my team and I set out to tackle one of the most dangerous parts of a construction site: heavy machinery operating near people. Starky is a smart bulldozer that pairs computer vision with embedded hardware to add a safety layer that reacts faster than a human operator can.',
        'An ESP32-CAM streams live video that an OpenCV pipeline analyzes to detect workers entering the danger zone. The moment someone is spotted, Starky automatically stops the vehicle, triggers hazard lights, and holds until the area is clear. On top of the safety system, we built in assisted autonomous grading so the machine can help level terrain on its own.',
        'The real challenge was bridging the software and the physical world: getting reliable detection off a tiny camera module and translating those decisions into precise, safe hardware control through the Arduino layer under tight hackathon time pressure.'
      ],
      tech: ['Machine Learning', 'Computer Vision', 'Python', 'OpenCV', 'ESP32-CAM', 'Arduino', 'Embedded Systems', 'Object Detection']
    },
    {
      title: 'PilotHelp',
      link: null,
      images: ['/projects/pilothelp/img-1.jpg', '/projects/pilothelp/img-2.jpg'],
      short: 'A wearable headset, and first place winner at the Pulse Hardware Hackathon, that helps people with vision or hearing loss navigate the world around them.',
      desc: [
        'A hackathon was happening right in our building, and even though we were already running late, we could not resist dropping everything to join and build something meaningful. We spent almost an hour brainstorming, putting ourselves in the shoes of someone who could not see or hear well and asking what they would actually need to move through a space safely.',
        'That became PilotHelp, a wearable headset that helps people with vision or hearing loss sense their surroundings. We carefully placed each component: a camera on the front, a distance sensor on the back so it would not block the camera\'s view, and audio and vibration alerts on each side to signal nearby objects. The alerts let a user feel and hear where obstacles are, even if one of those senses is limited.',
        'To make sure it actually worked, we tested it ourselves by walking through the building with our eyes closed. PilotHelp took first place at the Pulse Hardware Hackathon, and I am proud of it because it was built to make navigating the world a little easier for someone who needs it.'
      ],
      tech: ['Hardware', 'Embedded Systems', 'Computer Vision', 'Distance Sensors', 'Haptic Feedback', 'Audio Alerts']
    },
    {
      title: 'Illinois Front Office',
      link: null,
      images: [],
      short: 'An AI scouting platform for the Illinois Basketball Analytics Internship that turns hours of transfer portal research into a decision you can make in seconds.',
      desc: [
        'When a player enters the transfer portal, a coaching staff might have 48 hours to decide whether to pursue him, and the data they need is scattered across BartTorvik, Sports Reference, internal spreadsheets, and film notes. As a huge college basketball fan, I built Illinois Front Office to close that gap. You ask a question in plain English and the platform routes it to the right one of 12 specialized agents, covering everything from recruiting boards and risk and fit scoring to hidden gem detection, player comparisons, roster building, scenario simulation, and PDF scouting reports.',
        'At its core is a prediction model that estimates two things for any player: a transfer success probability and a projected Box Plus/Minus at Illinois. It is an ensemble of a 400 tree Random Forest, an XGBoost model, and a three layer neural network whose outputs are blended into one weighted score. Tested on data it had never seen, it separated likely contributors from busts about 88 percent of the time, and it learned on its own that a big conference jump usually drags production down, without me ever hardcoding that rule.',
        'Every score is explainable, so a coach can see exactly which stats pushed a player up or down and push back when they disagree. I scraped 200 real Division 1 players from Sports Reference and BartTorvik, using Playwright to get past Cloudflare protection, and trained the model on 3,000 synthetic profiles calibrated to real NCAA distributions, which I label as prototype data honestly throughout the app.'
      ],
      tech: ['Machine Learning', 'scikit-learn', 'XGBoost', 'Random Forest', 'Neural Networks', 'Ensemble Models', 'Next.js 15', 'TypeScript', 'FastAPI', 'Python 3.12', 'Google Gemini', 'Playwright', 'pandas', 'Plotly.js', 'SQLite']
    },
    {
      title: 'Synchrony Shield',
      link: 'https://synchronyshield.vercel.app',
      images: [],
      short: 'A privacy first Chrome extension that took second place at the Synchrony Corporate Hackathon, catching and redacting sensitive data before it ever leaves your browser.',
      desc: [
        'Synchrony Shield came out of the Synchrony Corporate Hackathon, where it earned runner up, and it solves a problem almost everyone has hit: pasting something into a web form and realizing too late that it held sensitive information. The extension watches for personal data and redacts it in real time before any of it can leave the page.',
        'Instead of leaning on an external AI service, it runs entirely client side using tuned regex patterns, which keeps it fast and means your data never gets shipped somewhere else to be scanned. It detects and masks emails, phone numbers, credit card numbers, Social Security numbers, addresses, and formal names, and lets users pick exactly which categories to redact and add their own custom phrases.',
        'We paired the extension with a polished marketing site featuring a live interactive demo, a SWOT analysis, and a responsive design, so the whole thing felt like a real product a company could actually ship.'
      ],
      tech: ['JavaScript', 'Chrome Extension APIs', 'Regex Pattern Matching', 'HTML', 'CSS']
    },
    {
      title: 'PromptGreen',
      link: null,
      images: ['/projects/promptgreen/img-1.jpg', '/projects/promptgreen/img-2.jpg'],
      short: 'A Chrome extension that won Best AI/Software Project at Dev Season of Code, trimming your AI prompts so they burn fewer tokens and less energy.',
      desc: [
        'PromptGreen won Best AI/Software Project at the Dev Season of Code Hackathon. It started from a fact most people never see: every prompt you send to an AI model gets broken into tokens, and more tokens means more computation, which means more electricity drawn inside data centers. As AI use has exploded, that hidden energy cost has quietly ballooned.',
        'PromptGreen sits in your browser and optimizes prompts before they ever reach the model. It analyzes your text, strips out filler words and redundant phrasing, compresses the intent, and restructures the language to use fewer tokens while keeping your original meaning fully intact. Because the savings compound across thousands or millions of prompts, small cleanups add up to a real reduction in energy use without changing your experience.',
        'The extension ships with an onboarding flow, a settings panel, and reporting views so you can actually see the tokens and energy you are saving over time. It made the environmental cost of AI visible and gave people a simple way to shrink it.'
      ],
      tech: ['JavaScript', 'Chrome Extension APIs', 'Service Workers', 'HTML', 'CSS', 'Tokenization']
    },
    {
      title: 'Financial Analysis & News Summarization System',
      link: null,
      images: ['/projects/financial/img-1.jpg', '/projects/financial/img-2.jpg'],
      short: 'An all in one Python tool that helps beginner investors make smarter calls by combining live news, technical analysis, and thousands of simulated price paths.',
      desc: [
        'A friend and I built this because stock research felt intimidating and scattered for anyone just starting out. The tool brings fundamental and technical analysis together in one interactive workflow. Type in any ticker and it pulls 50 recent news articles with short previews, then lets you summarize the ones you care about using Hugging Face\'s BART neural network model so you get the story without reading every word.',
        'On the technical side it charts historical prices and descriptive statistics like mean, median, and standard deviation, then runs Monte Carlo simulations that generate over 30,000 possible future price paths to show the range of where a stock could realistically go. It pulls live data through NewsAPI and Yahoo Finance and scrapes supporting information with BeautifulSoup.',
        'The whole thing was designed for accessibility, so someone with almost no investing experience can still walk away understanding both why a stock is moving and what its future might look like.'
      ],
      tech: ['Machine Learning', 'NLP', 'Hugging Face BART', 'Python', 'pandas', 'NumPy', 'matplotlib', 'yfinance', 'NewsAPI', 'BeautifulSoup', 'Monte Carlo Simulation', 'scipy']
    },
    {
      title: 'MapKit',
      link: 'https://dpandaman.github.io/MapKit/index.html',
      images: ['/projects/mapkit/img-1.jpg', '/projects/mapkit/img-2.jpg'],
      short: 'A community powered toolkit of prebuilt Google Maps templates, submitted to a Google Hackathon, that helps developers skip the setup and start building.',
      desc: [
        'After spending hours wrestling with the Google Maps JavaScript API for my own projects, I built MapKit so other people would not have to fight the same setup. It is a growing collection of plug and play templates and tools that let you get straight to building, whether you are testing an idea or shipping a full product.',
        'MapKit covers common use cases out of the box, including heat maps, business locators, weather overlays, and trip planners, and offers both web templates and Chrome extension templates. Each one comes with a getting started guide that walks you through generating an API key and dropping it into a simple env file, so there is no guesswork.',
        'I submitted it to a Google Hackathon as a community built solution, and it is designed so developers can contribute and share their own templates, making the whole thing more beginner friendly over time.'
      ],
      tech: ['JavaScript', 'Google Maps JavaScript API', 'Node.js', 'HTML', 'CSS', 'Chrome Extensions']
    }
  ]

  // Projects with images come first, original order preserved within each group
  const orderedProjects = [...projects].sort(
    (a, b) => (b.images?.length > 0 ? 1 : 0) - (a.images?.length > 0 ? 1 : 0)
  )

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style={{ zIndex: 9999 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-2xl font-bold hover:opacity-70 transition" style={{ color: GREEN_TEXT }}>×</button>
        <h2 className="pixel-text text-lg mb-8" style={{ color: GREEN_TEXT }}>My Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {orderedProjects.map((project, index) => (
            <ProjectCard key={index} project={project} onOpen={setSelected} />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

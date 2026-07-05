import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

// Bright neon green like Minecraft
const CUBE_GREEN = '#00ff00'
const CUBE_GREEN_DARK = '#00dd00'

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
            className="px-3 py-1 rounded text-sm font-semibold whitespace-nowrap pointer-events-none shadow-lg border-2"
            style={{
              backgroundColor: 'white',
              color: CUBE_GREEN_DARK,
              borderColor: CUBE_GREEN
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
      style={{ borderColor: CUBE_GREEN, color: CUBE_GREEN_DARK }}
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
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-2xl font-bold hover:opacity-70 transition text-white">×</button>
        <h2 className="text-2xl font-bold mb-6 text-white">My Life</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2" style={{ color: CUBE_GREEN }}>Philosophy</h3>
            <p className="text-gray-300 text-sm">The intersection of design, engineering, and creative problem-solving. Every project reflects thoughtful exploration and technical excellence.</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2" style={{ color: CUBE_GREEN }}>Passion</h3>
            <p className="text-gray-300 text-sm">I love computer science and engineering, and I build polished, interactive experiences that blend design with solid technical systems.</p>
          </div>
        </div>
      </motion.div>
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
        <h2 className="text-lg font-bold mb-3 text-center" style={{ color: CUBE_GREEN_DARK }}>Hi! I'm Kush</h2>
        <p className="text-gray-700 leading-relaxed text-sm mb-2">Hi! My name is Kush Patel and I'm an incoming Junior at UIUC studying CS + Econ, with a minor in statistics. I love computer science and building new products.</p>
        <p className="text-gray-700 leading-relaxed text-sm">Some of my passions including hackathons, basketball, movies, and pickleball!</p>
      </motion.div>
    </>
  )
}

function ExperiencePanel({ onClose }) {
  const experiences = [
    { title: 'Salesforce Software Engineer Intern', company: 'Salesforce', period: 'May 2026 - Present' },
    { title: 'Synchrony AI Intern', company: 'Synchrony', period: 'Jan 2026 - March 2025' },
    { title: 'Synchrony AI Developer Intern', company: 'Synchrony', period: 'March 2025 - Jan 2026' },
    { title: 'CS128 Course Assistant', company: 'UIUC', period: 'Jan 2025 - May 2025' }
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
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-96 overflow-y-auto"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-2xl font-bold hover:opacity-70 transition" style={{ color: CUBE_GREEN }}>×</button>
        <h2 className="text-2xl font-bold mb-6" style={{ color: CUBE_GREEN_DARK }}>My Experience</h2>
        
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="relative pl-24">
                <div className="absolute left-0 w-16 flex justify-center">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: CUBE_GREEN }}></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: CUBE_GREEN_DARK }}>{exp.title}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">{exp.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

function ProjectsPanel({ onClose }) {
  const projects = [
    { title: 'SafeStamp', desc: 'My teammate Devanshu Pandya and I built SafeStamp at HackMIT after asking a simple question: how can you actually prove whether an AI-generated image is authentic? Instead of relying on unreliable AI detectors, we built an open-source platform that uses cryptographic LSB watermarking, SHA-256 hashing, and a Flask backend to permanently link AI-generated images to their original prompts, creating a fully verifiable provenance system.' },
    { title: 'Productifi', desc: 'I built Productifi because I wanted something smarter than a timer telling me to get back to work. Using TensorFlow, MediaPipe, OpenCV, and Gemini AI, it analyzes facial expressions, eye gaze, head pose, and audio in real time to measure focus, detect distractions, and provide personalized coaching throughout each work session.' },
    { title: 'Starky Interactive', desc: 'At HackIllinois, my team and I built Starky, a smart bulldozer that combines computer vision with embedded systems to improve construction safety. Using OpenCV, an ESP32-CAM, Arduino, and custom hardware, it detects nearby workers in real time, automatically stops the vehicle, activates hazard lights, and assists with autonomous grading.' },
    { title: 'PilotHelp', desc: 'Coming soon.' },
    { title: 'Illinois Front Office', desc: 'As a huge college basketball fan, I wanted to build the kind of analytics platform I wish every coaching staff had. Illinois Front Office combines 12 specialized AI agents with ensemble machine learning models, predictive analytics, and custom scouting tools to evaluate transfer portal players, predict transfer success, identify undervalued recruits, and generate professional scouting reports in seconds instead of hours.' },
    { title: 'Synchrony Shield', desc: 'Built during the Synchrony Corporate Hackathon, Synchrony Shield is a Chrome extension that protects users from accidentally sharing sensitive information online. Using real-time regex detection and client-side processing, it automatically identifies and redacts emails, phone numbers, credit cards, Social Security numbers, and other PII before data ever leaves the browser.' },
    { title: 'Financial Analysis & News Summarization System', desc: 'I built this platform to make stock research more approachable for everyday investors. It combines real-time market data, NLP-powered news summarization using Hugging Face BART, and Monte Carlo simulations to help users understand both the stories driving a stock and its potential future performance.' },
    { title: 'MapKit', desc: 'After spending hours learning the Google Maps JavaScript API for my own projects, I built MapKit so others wouldn\'t have to. It provides a collection of reusable templates, from business locators to weather overlays and trip planners, that help developers build mapping applications faster while learning Google\'s mapping ecosystem.' }
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
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-96 overflow-y-auto"
        style={{ zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-2xl font-bold hover:opacity-70 transition" style={{ color: CUBE_GREEN }}>×</button>
        <h2 className="text-2xl font-bold mb-6" style={{ color: CUBE_GREEN_DARK }}>My Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
              <h3 className="text-lg font-semibold mb-2" style={{ color: CUBE_GREEN_DARK }}>{project.title}</h3>
              <p className="text-sm text-gray-700">{project.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}

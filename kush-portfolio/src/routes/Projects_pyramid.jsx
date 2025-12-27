import React, { useState } from "react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "AI Analytics Dashboard",
    desc: "Real-time data visualization with machine learning insights and predictive analytics for business intelligence.",
    tech: ["React", "TypeScript", "D3.js", "TensorFlow"],
    year: "2024",
    icon: "📊",
    status: "Live"
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    desc: "Next-gen shopping experience with AR product preview, AI recommendations, and seamless checkout.",
    tech: ["React Native", "Node.js", "GraphQL", "AR.js"],
    year: "2024",
    icon: "🛍️",
    status: "In Development"
  },
  {
    id: 3,
    title: "Design System",
    desc: "Comprehensive design system with 50+ components, automated documentation, and theme generator.",
    tech: ["React", "Storybook", "Figma", "Sass"],
    year: "2023",
    icon: "🎨",
    status: "Live"
  },
  {
    id: 4,
    title: "Real-time Collaboration",
    desc: "Multiplayer design tool with live editing, version control, and team collaboration features.",
    tech: ["React", "WebSocket", "Canvas", "Redis"],
    year: "2023",
    icon: "🤝",
    status: "Beta"
  },
  {
    id: 5,
    title: "Portfolio Website",
    desc: "Modern portfolio with 3D elements, smooth animations, and responsive design showcasing latest work.",
    tech: ["React", "Framer Motion", "Tailwind", "Three.js"],
    year: "2024",
    icon: "✨",
    status: "Live"
  }
];

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(0);

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % PROJECTS.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <main className="flex-1 py-20 px-6">
        <div className="container-lg max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-8">Projects</h1>
            <p className="text-xl text-gray-600">A selection of recent work</p>
          </motion.div>

          {/* 3D Pyramid */}
          <div className="relative mb-16">
            <div
              className="relative h-[500px] flex items-center justify-center"
              style={{ perspective: '1500px' }}
            >
              {/* Pyramid Container */}
              <motion.div
                className="relative w-96 h-96"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: currentProject * 15, // Subtle rotation
                  rotateX: -10, // Slight tilt to see pyramid effect
                }}
                transition={{
                  duration: 1,
                  ease: 'easeInOut',
                }}
              >
                {PROJECTS.map((project, index) => {
                  // Pyramid arrangement: base layer (3 projects) + top layer (2 projects)
                  let x = 0, y = 0, z = 0;

                  if (index === 0) { // Bottom center
                    x = 0; y = 100; z = 0;
                  } else if (index === 1) { // Bottom left
                    x = -150; y = 100; z = -100;
                  } else if (index === 2) { // Bottom right
                    x = 150; y = 100; z = -100;
                  } else if (index === 3) { // Top left
                    x = -75; y = -50; z = 50;
                  } else if (index === 4) { // Top right
                    x = 75; y = -50; z = 50;
                  }

                  const isActive = index === currentProject;

                  return (
                    <motion.div
                      key={project.id}
                      className="absolute w-72 h-72"
                      style={{
                        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                        transformStyle: 'preserve-3d',
                      }}
                      animate={{
                        scale: isActive ? 1.1 : 0.9,
                        opacity: isActive ? 1 : 0.7,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                    >
                      <div className="w-full h-full bg-black/5 border border-black/20 rounded-xl backdrop-blur-sm flex flex-col justify-center items-center p-6 text-center hover:bg-black/10 transition-all duration-500 group cursor-pointer"
                           onClick={() => setCurrentProject(index)}>
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{project.icon}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-black">{project.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            project.status === 'Live' ? 'bg-green-500/20 text-green-700' :
                            project.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-700' :
                            'bg-blue-500/20 text-blue-700'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 text-xs leading-relaxed">{project.desc.slice(0, 80)}...</p>

                        <div className="flex flex-wrap gap-1 mb-3 justify-center">
                          {project.tech.slice(0, 3).map(tech => (
                            <span key={tech} className="px-2 py-1 border border-black/30 text-gray-700 rounded-full text-xs hover:border-black/50 hover:text-black transition-all duration-300">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="text-xs text-gray-600 font-mono">{project.year}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-8 mt-8">
              <button
                onClick={prevProject}
                className="w-12 h-12 border border-black/30 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-3">
                {PROJECTS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProject(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentProject ? 'bg-black w-8' : 'bg-black/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextProject}
                className="w-12 h-12 border border-black/30 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Current Project Details */}
          <motion.div
            key={currentProject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-black mb-4">{PROJECTS[currentProject].title}</h2>
            <p className="text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              {PROJECTS[currentProject].desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="border border-black text-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2">
                <Github size={16} />
                View Code
              </button>
              <button className="border border-black text-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2">
                <ExternalLink size={16} />
                Live Demo
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
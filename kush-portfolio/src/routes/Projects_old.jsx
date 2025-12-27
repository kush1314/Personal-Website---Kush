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

          {/* 3D Carousel */}
          <div className="relative mb-16">
            <div
              className="relative h-[400px] flex items-center justify-center"
              style={{ perspective: '1200px' }}
            >
              {/* Carousel Container */}
              <motion.div
                className="relative w-80 h-80"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: currentProject * -72, // 360 / 5 = 72 degrees per project
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeInOut',
                }}
              >
                {PROJECTS.map((project, index) => {
                  const rotateY = index * 72; // 360 / 5 = 72 degrees
                  const translateZ = 220; // Distance from center

                  return (
                    <div
                      key={project.id}
                      className="absolute w-80 h-80"
                      style={{
                        transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <div className="w-full h-full bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm flex flex-col justify-center items-center p-8 text-center hover:bg-white/10 transition-all duration-500 group">
                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{project.icon}</div>
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            project.status === 'Live' ? 'bg-green-500/20 text-green-400' :
                            project.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-6 text-sm leading-relaxed">{project.desc}</p>

                        <div className="flex flex-wrap gap-2 mb-4 justify-center">
                          {project.tech.slice(0, 4).map(tech => (
                            <span key={tech} className="px-3 py-1 border border-white/30 text-gray-300 rounded-full text-xs hover:border-white/50 hover:text-white transition-all duration-300">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="text-sm text-gray-400 font-mono">{project.year}</div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-8 mt-8">
              <button
                onClick={prevProject}
                className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-3">
                {PROJECTS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProject(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentProject ? 'bg-white w-8' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextProject}
                className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
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
            <h2 className="text-3xl font-bold text-white mb-4">{PROJECTS[currentProject].title}</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {PROJECTS[currentProject].desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2">
                <Github size={16} />
                View Code
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2">
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
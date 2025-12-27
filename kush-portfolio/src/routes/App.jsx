import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "../components/Typewriter.jsx";
import Footer from "../components/Footer.jsx";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [typed1Done, setTyped1Done] = useState(false);
  const [typed2Done, setTyped2Done] = useState(false);

  useEffect(() => {
    if (typed2Done) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [typed2Done]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">

      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-start pl-4 md:pl-8 pt-16 bg-white"
          >
            <div className="px-6 max-w-2xl">
              <div className="text-left space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-xl md:text-2xl text-green-500 pixel-text"
                >
                  <Typewriter
                    text="Hi, my name is Kush"
                    speed={100}
                    onDone={() => setTyped1Done(true)}
                    showCursor={false}
                  />
                </motion.div>

                <div className="text-lg md:text-xl text-green-500 pixel-text">
                  {typed1Done && (
                    <Typewriter
                      text="Welcome to my website :)"
                      speed={80}
                      onDone={() => setTyped2Done(true)}
                      showCursor={true}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSplash && (
        <div className="min-h-screen">
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 bg-white z-40">
            <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
              <h1 className="text-lg font-semibold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                Kush Patel
              </h1>
              <div className="flex gap-8">
                {[
                  { label: 'About', id: 'about' },
                  { label: 'Work', id: 'experience' },
                  { label: 'Projects', id: 'projects' },
                  { label: 'Contact', id: 'contact' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-gray-500 hover:text-black transition-colors text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center pt-24">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <h1 className="text-5xl md:text-7xl font-light text-black mb-6 leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                Frontend Developer
              </h1>
              <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                I build digital products with clean code and thoughtful design
              </p>

              <div className="flex justify-center gap-3 mb-12">
                {["React", "TypeScript", "Next.js"].map((tech) => (
                  <span key={tech} className="text-sm text-gray-400 px-3 py-1 border border-gray-200 rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {tech}
                  </span>
                ))}
              </div>

              <button
                onClick={() => scrollToSection('projects')}
                className="text-black hover:text-gray-600 transition-colors font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                See my work →
              </button>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-24">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-light text-black mb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
                About
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                    I'm a frontend developer with 3+ years of experience building web applications.
                    I specialize in React, TypeScript, and creating clean, performant interfaces.
                  </p>
                  <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Currently at TechFlow Solutions, where I lead frontend development and mentor junior developers.
                    I believe in writing clean code and building products that users love.
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Skills</h3>
                    <div className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <p>React, TypeScript, Next.js</p>
                      <p>Tailwind CSS, Styled Components</p>
                      <p>Node.js, Express, MongoDB</p>
                      <p>Git, Docker, AWS</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Currently</h3>
                    <div className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <p>Frontend Developer at TechFlow</p>
                      <p>Learning Three.js & WebGL</p>
                      <p>Building side projects</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-light text-black mb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
                Work
              </h2>

              <div className="space-y-12">
                {[
                  {
                    title: "Frontend Developer",
                    company: "TechFlow Solutions",
                    period: "2023 - Present",
                    description: "Leading frontend development for enterprise applications. Building scalable React applications and mentoring team members."
                  },
                  {
                    title: "Junior Developer",
                    company: "Digital Innovations Co",
                    period: "2022 - 2023",
                    description: "Developed responsive web applications and collaborated with design teams to create user interfaces."
                  },
                  {
                    title: "Web Development Intern",
                    company: "Creative Agency",
                    period: "2021",
                    description: "Built marketing websites and learned modern development practices."
                  }
                ].map((exp, index) => (
                  <div key={index} className="border-b border-gray-200 pb-12 last:border-b-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-xl font-medium text-black mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {exp.title}
                        </h3>
                        <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-sm text-gray-400 mt-2 md:mt-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="py-24">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-light text-black mb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
                Projects
              </h2>

              <div className="space-y-16">
                {[
                  {
                    title: "Safe Stamp",
                    desc: "Document verification platform using blockchain technology. Built with React and Node.js.",
                    tech: ["React", "Node.js", "MongoDB"],
                    year: "2024"
                  },
                  {
                    title: "TaskFlow Dashboard",
                    desc: "Project management dashboard for development teams with real-time collaboration features.",
                    tech: ["Next.js", "TypeScript", "Prisma"],
                    year: "2024"
                  },
                  {
                    title: "Component Library",
                    desc: "Design system and component library with TypeScript support and automated documentation.",
                    tech: ["React", "TypeScript", "Storybook"],
                    year: "2023"
                  }
                ].map((project, index) => (
                  <div key={index} className="border-b border-gray-200 pb-16 last:border-b-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <h3 className="text-xl font-medium text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {project.title}
                      </h3>
                      <span className="text-sm text-gray-400 mt-2 md:mt-0" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {project.year}
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {project.desc}
                    </p>

                    <div className="flex gap-3 mb-6">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-sm text-gray-400 px-3 py-1 border border-gray-200 rounded-full"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <button className="text-black hover:text-gray-600 transition-colors text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      View project →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-light text-black mb-16" style={{ fontFamily: 'Inter, sans-serif' }}>
                Contact
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-12" style={{ fontFamily: 'Inter, sans-serif' }}>
                    I'm currently open to new opportunities and interesting projects. Feel free to reach out if you'd like to work together.
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Email</h3>
                      <a
                        href="mailto:kush.patel@example.com"
                        className="text-black hover:text-gray-600 transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        kush.patel@example.com
                      </a>
                    </div>

                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>LinkedIn</h3>
                      <a
                        href="https://linkedin.com/in/kushpatel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-gray-600 transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        linkedin.com/in/kushpatel
                      </a>
                    </div>

                    <div>
                      <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>GitHub</h3>
                      <a
                        href="https://github.com/kushpatel"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-gray-600 transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        github.com/kushpatel
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Currently</h3>
                    <div className="space-y-2 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <p>Learning Three.js & WebGL</p>
                      <p>Building side projects</p>
                      <p>Available for work</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm uppercase tracking-wide text-gray-400 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Location</h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      San Francisco, CA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      )}
    </div>
  );
}
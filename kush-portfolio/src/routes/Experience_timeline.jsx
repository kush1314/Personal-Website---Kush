import React from "react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { motion } from "framer-motion";

export default function Experience() {
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
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-8">Experience</h1>
            <p className="text-xl text-gray-600">My professional journey</p>
          </motion.div>

          {/* Experience Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-black/20 transform md:-translate-x-px"></div>

            {[
              {
                year: "2024",
                title: "Senior Frontend Developer",
                company: "TechCorp",
                description: "Leading a team of developers building modern web applications with React and TypeScript. Implemented design systems and improved performance by 40%.",
                side: "left"
              },
              {
                year: "2023",
                title: "Full Stack Developer",
                company: "StartupXYZ",
                description: "Built scalable web applications from scratch using React, Node.js, and MongoDB. Collaborated with designers to create seamless user experiences.",
                side: "right"
              },
              {
                year: "2022",
                title: "Frontend Developer",
                company: "Digital Agency",
                description: "Developed responsive websites and web applications for various clients. Specialized in React development and modern CSS techniques.",
                side: "left"
              },
              {
                year: "2021",
                title: "UI/UX Designer",
                company: "Creative Studio",
                description: "Designed user interfaces and experiences for web and mobile applications. Created wireframes, prototypes, and design systems.",
                side: "right"
              }
            ].map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: exp.side === 'left' ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  exp.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-black rounded-full border-4 border-white transform -translate-x-2 md:-translate-x-2 z-10"></div>

                {/* Content */}
                <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${
                  exp.side === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12'
                }`}>
                  <div className="bg-black/5 border border-black/20 rounded-xl p-6 hover:bg-black/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-mono text-gray-600 bg-black/10 px-2 py-1 rounded">
                        {exp.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-1">{exp.title}</h3>
                    <p className="text-gray-600 mb-3">{exp.company}</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
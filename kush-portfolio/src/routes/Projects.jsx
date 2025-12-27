import React from "react";
import { useNavigate } from "react-router-dom";

const PROJECTS = [
  {
    id: 1,
    title: "Safe Stamp",
    desc: "Real-time data visualization platform with machine learning insights for business intelligence and analytics.",
    tech: ["React", "TypeScript", "D3.js"],
    year: "2024",
    status: "Live"
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    desc: "Modern shopping experience with AR product preview and AI-powered recommendations.",
    tech: ["React Native", "Node.js", "GraphQL"],
    year: "2024",
    status: "In Development"
  },
  {
    id: 3,
    title: "Design System",
    desc: "Comprehensive component library with automated documentation and theme generation.",
    tech: ["React", "Storybook", "Sass"],
    year: "2023",
    status: "Live"
  }
];

export default function Projects() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">

        <div className="mb-8">
          <button
            onClick={() => nav('/?menu=true')}
            className="text-gray-600 hover:text-gray-900 mb-8 flex items-center gap-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ← Back
          </button>

          <h1 className="text-4xl font-normal text-gray-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Projects
          </h1>
        </div>

        <div className="space-y-12">
          {PROJECTS.map((project) => (
            <div key={project.id} className="border-b border-gray-100 pb-12 last:border-b-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-normal text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {project.title}
                  </h2>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    project.status === 'Live'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <span className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {project.year}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
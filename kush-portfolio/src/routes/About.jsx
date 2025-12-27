import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
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
            About
          </h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            I'm a developer and designer who loves creating digital experiences that are both beautiful and functional.
            Currently focused on frontend development with React, TypeScript, and modern design tools.
          </p>

          <h2 className="text-2xl font-normal text-gray-900 mb-6 mt-12" style={{ fontFamily: 'Inter, sans-serif' }}>
            Skills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Frontend",
                skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
              },
              {
                title: "Design",
                skills: ["Figma", "UI/UX", "Prototyping", "Adobe XD"]
              },
              {
                title: "Tools",
                skills: ["Git", "VS Code", "Node.js", "MongoDB"]
              }
            ].map((category) => (
              <div key={category.title}>
                <h3 className="font-medium text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.skills.map((skill) => (
                    <div key={skill} className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
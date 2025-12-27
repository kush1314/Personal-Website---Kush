import React from "react";
import { useNavigate } from "react-router-dom";

export default function Experience() {
  const nav = useNavigate();

  const experiences = [
    {
      title: "Frontend Developer",
      company: "TechFlow Solutions",
      period: "2023 - Present",
      description: "Leading frontend development initiatives for enterprise-scale applications. Architecting scalable React applications and mentoring junior developers.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
    },
    {
      title: "Junior Developer",
      company: "Digital Innovations Co",
      period: "2022 - 2023",
      description: "Developed responsive web applications and collaborated with design teams to create pixel-perfect user interfaces.",
      skills: ["JavaScript", "React", "CSS-in-JS", "Storybook"]
    },
    {
      title: "Web Development Intern",
      company: "Creative Agency",
      period: "2021",
      description: "Started my journey in web development by building marketing websites and learning industry best practices.",
      skills: ["HTML", "CSS", "JavaScript", "WordPress"]
    }
  ];

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
            Experience
          </h1>
        </div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div key={index} className="border-b border-gray-100 pb-12 last:border-b-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-normal text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {exp.title}
                  </h2>
                  <p className="text-lg text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {exp.company}
                  </p>
                </div>
                <span className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {exp.period}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {skill}
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
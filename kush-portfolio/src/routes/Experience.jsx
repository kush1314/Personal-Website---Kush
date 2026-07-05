import React from "react";
import { useNavigate } from "react-router-dom";

export default function Experience() {
  const nav = useNavigate();

  const experiences = [
    {
      title: "CS128 Course Assistant",
      company: "University of Illinois Urbana-Champaign",
      period: "Jan 2025 - May 2025"
    },
    {
      title: "Synchrony AI Developer Intern",
      company: "Synchrony",
      period: "March 2025 - Jan 2026"
    },
    {
      title: "Synchrony AI Intern",
      company: "Synchrony",
      period: "Jan 2026 - March 2025"
    },
    {
      title: "Salesforce Software Engineer Intern",
      company: "Salesforce",
      period: "May 2026 - Present"
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

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="relative pl-24">
                {/* Timeline dot */}
                <div className="absolute left-0 w-16 flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-gray-900 mt-2 ring-4 ring-white"></div>
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-2xl font-normal text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {exp.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {exp.company}
                  </p>
                  <p className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {exp.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
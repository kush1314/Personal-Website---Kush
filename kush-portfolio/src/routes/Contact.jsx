import React from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
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
            Contact
          </h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
            Let's work together on your next project.
          </p>

          <div className="space-y-6 mb-12">
            <div>
              <h3 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Email
              </h3>
              <a
                href="mailto:kush.patel@example.com"
                className="text-gray-600 hover:text-gray-900"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                kush.patel@example.com
              </a>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                LinkedIn
              </h3>
              <a
                href="https://linkedin.com/in/kushpatel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                /in/kushpatel
              </a>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                GitHub
              </h3>
              <a
                href="https://github.com/kushpatel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                /kushpatel
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
import React from "react";
import { useNavigate } from "react-router-dom";

const PROJECTS = [
  {
    id: 1,
    title: "SafeStamp",
    desc: "My teammate Devanshu Pandya and I built SafeStamp at HackMIT after asking a simple question: how can you actually prove whether an AI-generated image is authentic? Instead of relying on unreliable AI detectors, we built an open-source platform that uses cryptographic LSB watermarking, SHA-256 hashing, and a Flask backend to permanently link AI-generated images to their original prompts, creating a fully verifiable provenance system."
  },
  {
    id: 2,
    title: "Productifi",
    desc: "I built Productifi because I wanted something smarter than a timer telling me to get back to work. Using TensorFlow, MediaPipe, OpenCV, and Gemini AI, it analyzes facial expressions, eye gaze, head pose, and audio in real time to measure focus, detect distractions, and provide personalized coaching throughout each work session."
  },
  {
    id: 3,
    title: "Starky Interactive",
    desc: "At HackIllinois, my team and I built Starky, a smart bulldozer that combines computer vision with embedded systems to improve construction safety. Using OpenCV, an ESP32-CAM, Arduino, and custom hardware, it detects nearby workers in real time, automatically stops the vehicle, activates hazard lights, and assists with autonomous grading."
  },
  {
    id: 4,
    title: "PilotHelp",
    desc: "Coming soon."
  },
  {
    id: 5,
    title: "Illinois Front Office",
    desc: "As a huge college basketball fan, I wanted to build the kind of analytics platform I wish every coaching staff had. Illinois Front Office combines 12 specialized AI agents with ensemble machine learning models, predictive analytics, and custom scouting tools to evaluate transfer portal players, predict transfer success, identify undervalued recruits, and generate professional scouting reports in seconds instead of hours."
  },
  {
    id: 6,
    title: "Synchrony Shield",
    desc: "Built during the Synchrony Corporate Hackathon, Synchrony Shield is a Chrome extension that protects users from accidentally sharing sensitive information online. Using real-time regex detection and client-side processing, it automatically identifies and redacts emails, phone numbers, credit cards, Social Security numbers, and other PII before data ever leaves the browser."
  },
  {
    id: 7,
    title: "Financial Analysis & News Summarization System",
    desc: "I built this platform to make stock research more approachable for everyday investors. It combines real-time market data, NLP-powered news summarization using Hugging Face BART, and Monte Carlo simulations to help users understand both the stories driving a stock and its potential future performance."
  },
  {
    id: 8,
    title: "MapKit",
    desc: "After spending hours learning the Google Maps JavaScript API for my own projects, I built MapKit so others wouldn't have to. It provides a collection of reusable templates, from business locators to weather overlays and trip planners, that help developers build mapping applications faster while learning Google's mapping ecosystem."
  }
];

export default function Projects() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-5xl mx-auto px-8 py-16">

        <button
          onClick={() => nav('/?menu=true')}
          className="text-gray-500 hover:text-gray-900 mb-10 flex items-center gap-2 text-sm transition-colors"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-normal text-gray-900 mb-12">
          Projects
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-gray-50 rounded-xl p-8 border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-200"
            >
              <span className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 block">
                {String(project.id).padStart(2, '0')}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {project.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {project.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

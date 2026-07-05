import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Typewriter from "../components/Typewriter.jsx";
import CubeCarousel from "../components/CubeCarousel.jsx";

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

      {!showSplash && <CubeCarousel />}
    </div>
  );
}
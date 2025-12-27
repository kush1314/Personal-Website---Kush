import React, { useEffect, useState } from "react";

export default function Typewriter({ text = "", speed = 80, onDone, showCursor = true }) {
  const [out, setOut] = useState("");
  const [showTypingCursor, setShowTypingCursor] = useState(true);

  useEffect(() => {
    if (!text || out === text) return;

    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) {
        setOut(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(id);
        setTimeout(() => {
          setShowTypingCursor(false);
          if (onDone) {
            setTimeout(onDone, 300);
          }
        }, 800);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text]);

  return (
    <span className="whitespace-pre-wrap">
      {out}
      {showCursor && showTypingCursor && (
        <span className="animate-pulse text-green-500 ml-1">|</span>
      )}
    </span>
  );
}
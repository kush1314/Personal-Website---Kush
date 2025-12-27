import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center">
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} Kush Patel
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";
import React from "react";

export function Results() {
  // Add your sticker image URLs here - just the image URL
  const stickers = [
    "https://i.ibb.co/xScC2cdN/striver.jpg",
    "https://i.ibb.co/7Nn4tnxv/cluely.jpg",
    "https://i.ibb.co/nyhwn11/piyush.jpg",
    "https://i.ibb.co/kgKg0PZt/sapna.jpg",
    "https://i.ibb.co/21pT817y/kirat.jpg",
    "https://i.ibb.co/7N6HvXtx/chai.jpg" ,
    "https://i.ibb.co/ycY2P28H/alakh.jpg",
    "https://i.ibb.co/8ggBjxTY/contri.jpg"
  ];

  return (
    <div className="w-full py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-semibold mb-12 text-center" style={{ color: '#ffffff' }}>
          Some of our top stickers
        </h1>

        {/* Bento Grid */}
        <div className="bento-grid-wrapper">
          <div className="bento-grid">
            {stickers.map((image, index) => (
              <BentoCard key={index} image={image} />
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .bento-grid-wrapper {
          position: relative;
          padding: 2rem 0;
        }

        /* Animated Background Between Cards */
        .bento-grid-wrapper::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
          animation: backgroundPulse 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes backgroundPulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        /* Floating Orbs Animation */
        .bento-grid-wrapper::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          top: 10%;
          right: 10%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 12s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.25rem;
          grid-auto-rows: 200px;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .bento-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 1.5rem;
            grid-auto-rows: 220px;
          }
        }

        @media (min-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 2rem;
            grid-auto-rows: 240px;
          }
        }

        .bento-card {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          background: #000000;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .bento-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .bento-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
        }

        .bento-card:hover .bento-image {
          transform: scale(1.05);
        }

      `}</style>
    </div>
  );
}

function BentoCard({ image }) {
  return (
    <div className="bento-card">
      <img
        src={image}
        alt="Sticker"
        className="bento-image"
        loading="lazy"
      />
    </div>
  );
}


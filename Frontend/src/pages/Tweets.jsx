"use client";
import React from "react";
import { Tweet } from "react-tweet";
import { IconBrandX } from "@tabler/icons-react";

const tweets = [
  "1989525157162152280",
  "1989603131739545968",
  "1989532492299399640",
  "1989445974159495333",
  "1989622744796045536",
  "1989447072547017077",
  "1989455780773597359",
];

export default function TweetMarquee() {
  const duplicatedTweets = [...tweets, ...tweets];

  return (
    <div className="w-full flex flex-col relative overflow-hidden bg-black py-20">

      {/* Header */}
      <div className="pb-10 text-center">
        <h2
          className="text-center text-5xl sm:text-6xl md:text-7xl tracking-tight font-bold text-white"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Loved by Everyone
        </h2>

        <p className="text-neutral-400 text-lg mt-4">
          StickX is already trending across X
        </p>
      </div>

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-[#4c9dfb30] rounded-full blur-[140px] top-20 -left-20"></div>
        <div className="absolute w-[400px] h-[400px] bg-[#ffb7c530] rounded-full blur-[140px] bottom-20 -right-10"></div>
        <div className="absolute w-[350px] h-[350px] bg-[#ffffff15] rounded-full blur-[150px] top-1/2 left-1/2 -translate-x-1/2"></div>
      </div>

      {/* Marquee Container */}
      <div className="tweet-marquee-wrapper relative mt-10">

        <div className="tweet-marquee">
          {duplicatedTweets.map((id, i) => (
            <div key={i} className="tweet-card-container group">

              <div className="tweet-card">
                <div className="absolute top-3 right-3 opacity-60">
                  <IconBrandX className="w-4 h-4 text-white/60" />
                </div>
                <Tweet id={id} />
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* STYLES */}
      <style jsx global>{`
        .tweet-marquee-wrapper {
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .tweet-marquee {
          display: flex;
          gap: 3rem;
          width: fit-content;
          animation: slickScroll 35s linear infinite;
        }

        .tweet-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes slickScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        /* Tweet card container */
        .tweet-card-container {
          flex-shrink: 0;
          width: 360px;
        }

        /* Tweet Card Glass UI */
        .tweet-card {
          position: relative;
          backdrop-filter: blur(25px);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          padding: 20px;
          overflow: hidden;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.25);
          transition: all 0.3s ease;
        }

        .tweet-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(100, 150, 255, 0.4);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.35);
        }

        /* Hide UI pieces from tweets (your sanitizer stays intact) */
        .tweet-container article {
          padding: 0 !important;
          background: transparent !important;
        }
        .tweet-container [data-testid="like"],
        .tweet-container [data-testid="reply"],
        .tweet-container [data-testid="retweet"],
        .tweet-container [data-testid="unretweet"],
        .tweet-container [data-testid="bookmark"],
        .tweet-container [data-testid="share"],
        .tweet-container time,
        .tweet-container [role="group"],
        .tweet-container a[href*="twitter.com"],
        .tweet-container a[href*="x.com"],
        .tweet-container svg:not([data-testid="tweet-avatar-image"]) {
          display: none !important;
        }

        /* Layout fixes */
        .tweet-container article > div {
          display: flex !important;
          flex-direction: row !important;
          gap: 12px !important;
        }

        .tweet-container img {
          border-radius: 50% !important;
          width: 42px !important;
          height: 42px !important;
        }

        .tweet-container [data-testid="User-Name"] {
          color: white !important;
          font-size: 16px !important;
          font-weight: 700 !important;
          font-family: 'Playfair Display', serif !important;
        }
        .tweet-container [data-testid="UserName"] {
          color: #888 !important;
        }

        .tweet-container [data-testid="tweetText"] {
          color: white !important;
          font-size: 15px !important;
          font-family: 'Playfair Display', serif !important;
        }
      `}</style>
    </div>
  );
}

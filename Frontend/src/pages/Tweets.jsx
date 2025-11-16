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
    <div className="w-full flex flex-col bg-[#151515]/20 backdrop-blur-xl relative">
      <div className="py-12 px-4 border-b border-[#252525]">
        <h2 className="text-center text-5xl sm:text-6xl md:text-7xl tracking-tight font-bold text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Our Top Tweets
        </h2>
      </div>

      <div className="w-full relative border-b border-[#252525] py-16">
        <div className="tweet-marquee-wrapper">
          <div className="tweet-marquee">
            {duplicatedTweets.map((id, index) => (
              <div key={index} className="tweet-card-wrapper">
                <div className="w-[320px] relative overflow-hidden mx-auto rounded-2xl bg-black border border-[#252525]">
                  {/* Twitter Icon */}
                  <div className="absolute top-4 right-4 z-30">
                    <IconBrandX className="w-5 h-5 text-white/60" />
                  </div>
                  
                  {/* Tweet Content */}
                  <div className="tweet-card tweet-container p-6">
                    <Tweet id={id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Marquee Wrapper */
        .tweet-marquee-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
        }

        /* Marquee Animation */
        .tweet-marquee {
          display: flex;
          gap: 1.5rem;
          width: fit-content;
          animation: marquee-scroll 40s linear infinite;
        }

        .tweet-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Tweet Card Wrapper */
        .tweet-card-wrapper {
          flex-shrink: 0;
          width: 320px;
          position: relative;
        }

        /* Tweet Card */
        .tweet-card {
          width: 100%;
        }

        /* AGGRESSIVE HIDING - Only show profile, username, and tweet text */
        .tweet-container article {
          padding: 0 !important;
          background: transparent !important;
        }
        
        /* Hide all engagement metrics and buttons */
        .tweet-container [data-testid="like"],
        .tweet-container [data-testid="reply"],
        .tweet-container [data-testid="retweet"],
        .tweet-container [data-testid="unretweet"],
        .tweet-container [data-testid="bookmark"],
        .tweet-container [data-testid="share"],
        .tweet-container [aria-label*="Reply"],
        .tweet-container [aria-label*="Retweet"],
        .tweet-container [aria-label*="Like"],
        .tweet-container [aria-label*="Bookmark"],
        .tweet-container [aria-label*="Share"],
        .tweet-container [role="group"],
        .tweet-container div[role="group"],
        .tweet-container article > div:last-child,
        .tweet-container article > div > div:last-child {
          display: none !important;
        }
        
        /* Hide timestamp, date, view count, analytics */
        .tweet-container time,
        .tweet-container [data-testid="app-text-transition-container"],
        .tweet-container a[href*="/status/"] > time,
        .tweet-container a[aria-label*="·"] {
          display: none !important;
        }
        
        /* Hide verified badges and other icons except profile */
        .tweet-container svg:not([data-testid="tweet-avatar-image"]) {
          display: none !important;
        }
        
        /* Hide the "Read more" and external links */
        .tweet-container a[href*="twitter.com"],
        .tweet-container a[href*="x.com"],
        .tweet-container a[target="_blank"]:not([data-testid="tweet-avatar-link"]) {
          pointer-events: none;
          color: inherit !important;
          text-decoration: none !important;
        }
        
        /* Clean up spacing - Make it look like real tweet */
        .tweet-container article > div {
          display: flex !important;
          flex-direction: row !important;
          gap: 12px !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .tweet-container article > div > div {
          display: flex !important;
          flex-direction: column !important;
          gap: 4px !important;
          flex: 1 !important;
        }
        
        /* Profile picture - Twitter-like size */
        .tweet-container img {
          border-radius: 50% !important;
          width: 40px !important;
          height: 40px !important;
          flex-shrink: 0 !important;
          object-fit: cover !important;
        }
        
        /* User name and handle - Twitter-like styling */
        .tweet-container [data-testid="User-Name"] {
          color: #ffffff !important;
          font-weight: 700 !important;
          font-size: 15px !important;
          line-height: 20px !important;
          font-family: 'Playfair Display', serif !important;
        }
        
        .tweet-container [data-testid="UserName"] {
          color: #8b8b8b !important;
          font-size: 15px !important;
          line-height: 20px !important;
          font-family: 'Playfair Display', serif !important;
        }
        
        /* Tweet text - Twitter-like styling */
        .tweet-container [data-testid="tweetText"] {
          font-size: 15px !important;
          line-height: 20px !important;
          color: #ffffff !important;
          margin-top: 2px !important;
          font-family: 'Playfair Display', serif !important;
          word-wrap: break-word !important;
        }
        
        /* Hide "Copy link" and any footer actions */
        .tweet-container [aria-label*="Copy"],
        .tweet-container [data-testid="copy-link"],
        .tweet-container button,
        .tweet-container a[role="button"] {
          display: none !important;
        }
        
        /* Force black background */
        .tweet-container * {
          background: transparent !important;
        }
        
        .tweet-container article {
          background: transparent !important;
        }

        /* Ensure proper text colors */
        .tweet-container {
          color: #ffffff !important;
        }

        /* Override for specific elements that should be gray */
        .tweet-container [data-testid="UserName"],
        .tweet-container span[style*="color"] {
          color: #8b8b8b !important;
        }
      `}</style>
    </div>
  );
}

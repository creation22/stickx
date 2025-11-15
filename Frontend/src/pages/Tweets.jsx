"use client";
import React, { useState } from "react";
import { Tweet } from "react-tweet";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import { ShineBorder } from "../components/ui/shine-border";

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
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="w-full flex flex-col bg-[#151515]/20 backdrop-blur-xl relative">
      <div className="py-8 border-b border-[#252525]">
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            type: "spring",
            delay: 0.4,
          }}
          className="text-center text-3xl tracking-tight font-medium text-white"
        >
          Our Top Tweets
        </motion.h2>
      </div>

      <div className="w-full relative border-b border-[#252525] py-10">
        <div className="tweet-marquee-wrapper">
          <div className="tweet-marquee">
            {duplicatedTweets.map((id, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  type: "spring",
                  delay: 0.5 + (index % tweets.length) * 0.1,
                }}
                className="tweet-card-wrapper group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="border-dashed border-[#252525] w-full mx-auto relative h-full">
                  <div className="w-full h-full w-[320px] relative overflow-hidden mx-auto py-6 pb-10 flex flex-col rounded-3xl">
                    <ShineBorder shineColor={["#7150E7", "#C89BFF", "#432BA0"]}>
                      <div className="w-full h-full relative overflow-hidden rounded-3xl bg-black/60 backdrop-blur-xl">
                        <AnimatePresence>
                          {hoveredIndex === index && (
                            <motion.span
                              className="absolute inset-0 h-full w-full bg-neutral-800/[0.8] block rounded-3xl z-10"
                              layoutId="hoverBackground"
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                transition: { duration: 0.15 },
                              }}
                              exit={{
                                opacity: 0,
                                transition: { duration: 0.15, delay: 0.2 },
                              }}
                            />
                          )}
                        </AnimatePresence>
                        <div className={cn(
                          "tweet-card tweet-container relative z-20 h-full w-full overflow-hidden p-4"
                        )}>
                          <Tweet id={id} />
                        </div>
                      </div>
                    </ShineBorder>
                    <div className="bg-white mix-blend-plus-lighter absolute h-[100px] w-full blur-[50px] right-0 -bottom-20 opacity-10"></div>
                  </div>
                </div>
              </motion.div>
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
          padding: 8px;
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
          font-family: 'Inter', sans-serif !important;
        }
        
        .tweet-container [data-testid="UserName"] {
          color: #8b8b8b !important;
          font-size: 15px !important;
          line-height: 20px !important;
          font-family: 'Inter', sans-serif !important;
        }
        
        /* Tweet text - Twitter-like styling */
        .tweet-container [data-testid="tweetText"] {
          font-size: 15px !important;
          line-height: 20px !important;
          color: #ffffff !important;
          margin-top: 2px !important;
          font-family: 'Inter', sans-serif !important;
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

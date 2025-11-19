import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  // Helper to download images
  const downloadImage = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "sticker.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share to X
  const shareOnX = (url) => {
    const text = encodeURIComponent("Check out this sticker!");
    const image = encodeURIComponent(url);

    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${image}`;

    window.open(shareUrl, "_blank");
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 gap-8",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group block p-4"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-xl bg-zinc-900">
            <div className="w-full h-60 overflow-hidden">
              <img
                src={item.link}
                alt="sticker"
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => downloadImage(item.link)}
              className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition"
            >
              Download
            </button>

            <button
              onClick={() => shareOnX(item.link)}
              className="px-4 py-2 rounded-lg bg-neutral-700 text-white font-semibold hover:bg-black transition"
            >
              Share to X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

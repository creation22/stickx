import { cn } from "../../lib/utils";
import { useState } from "react";

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  // Navigate to Editor
  const openEditor = (url) => {
    const encoded = encodeURIComponent(url);
    window.location.href = `/editor?img=${encoded}`;
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
          className="relative block p-4"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Sticker Image */}
          <div
            className="relative rounded-xl overflow-hidden border border-white/10 shadow-xl bg-zinc-900 cursor-pointer"
            onClick={() => openEditor(item.link)}
          >
            <div className="w-full h-60 overflow-hidden">
              <img
                src={item.link}
                alt={item.name || "sticker"}
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* Sticker Name */}
          <p className="text-center text-white mt-3 text-lg font-medium truncate">
            {item.name || "Untitled Sticker"}
          </p>
        </div>
      ))}
    </div>
  );
};

import { useEffect, useState } from "react";
import { HoverEffect } from "../components/ui/card-hover-effect";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";

export function Feed() {
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    async function fetchStickers() {
      const res = await fetch("http://localhost:5000/api/stickers");
      const data = await res.json();

      // Transform to HoverEffect-friendly format
      const formatted = data.map(item => ({
        title: "",                // not needed
        description: "",          // not needed
        link: item.imageUrl       // this is your Cloudinary URL
      }));

      setStickers(formatted);
    }

    fetchStickers();
  }, []);

  return (
    <div className="py-10 space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-center text-white">
          Popular Stickers
        </h1>

        <p className="text-center mt-4 text-zinc-400 max-w-2xl mx-auto px-4">
          Explore a curated selection of trending stickers—from the latest memes to viral moments.
          Post them instantly on X, or create your own with one click.
        </p>

        <div className="flex justify-center items-center text-black mt-20">
          <InteractiveHoverButton>Create Your Own Stickers</InteractiveHoverButton>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8">
        {/* Stickers appear dynamically */}
        <HoverEffect items={stickers} />
      </div>
    </div>
  );
}

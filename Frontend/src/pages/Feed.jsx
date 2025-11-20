import { useEffect, useState } from "react";

export function Feed() {
  const [stickers, setStickers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 28;

  const API = import.meta.env.VITE_API_URL; // <— USE ENV

  useEffect(() => {
    async function fetchStickers() {
      try {
        const res = await fetch(`${API}/api/stickers`);
        const data = await res.json();
        setStickers(data);
      } catch (err) {
        console.error("Error loading stickers:", err);
      }
    }

    fetchStickers();
  }, [API]);

  // SEARCH FILTER
  const filtered = stickers.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="py-10 space-y-12">
      <div>
        <h1 className="text-4xl font-bold text-center text-white">
          Popular Stickers
        </h1>

        <p className="text-center mt-4 text-zinc-400 max-w-2xl mx-auto px-4">
          Explore a curated selection of trending stickers—from the latest memes
          to viral moments.
        </p>

        {/* Create Btn */}
        <div className="flex justify-center items-center mt-10">
          <button
            className="px-6 py-3 text-lg font-bold bg-white text-black rounded-xl shadow-lg hover:scale-105 transition"
            onClick={() => (window.location.href = "/editor")}
          >
            Create Your Own Stickers
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="flex justify-center mt-8 px-4">
          <input
            type="text"
            placeholder="Search stickers..."
            className="w-full max-w-md px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* STICKER GRID */}
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {paginated.map((item) => (
          <div
            key={item._id}
            className="cursor-pointer group"
            onClick={() =>
              (window.location.href = `/editor?template=${encodeURIComponent(
                item.imageUrl
              )}`)
            }
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow transition">
              <div className="w-full h-40 md:h-48 flex items-center justify-center overflow-hidden rounded-lg bg-zinc-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            </div>

            <div className="text-white font-semibold mt-2 text-sm text-center">
              {item.title}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded-lg border border-zinc-700 text-white ${
            page === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-zinc-800"
          }`}
        >
          Prev
        </button>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded-lg border border-zinc-700 text-white ${
            page === totalPages
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-zinc-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

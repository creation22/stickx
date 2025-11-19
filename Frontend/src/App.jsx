import './App.css'
import Hero from './pages/Hero'
import { Analytics } from "@vercel/analytics/react"
import StickerEditor from './pages/Editor'
import { Feed } from './pages/Feed'
import { Routes, Route } from "react-router-dom"
import { Navbar } from './components/ui/resizable-navbar'
import Footer from './pages/Footer'
import { Nav } from './pages/Navabar'

function App() {
  return (
    <div className="min-h-screen w-full relative bg-black">
      <Analytics />

      {/* Global Background Layer */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%)",
        }}
      />

      {/* All content sits ABOVE */}
      <div className="relative z-10">

        {/* GLOBAL NAVBAR */}
        <div className="sticky top-0 z-50">
          <Nav/>
        </div>

        {/* PAGE ROUTES */}
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/editor" element={<StickerEditor />} />
        </Routes>

        {/* GLOBAL FOOTER */}
        <Footer />

      </div>
    </div>
  );
}

export default App;

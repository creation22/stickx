
import './App.css'
import Hero from './pages/Hero'
import Footer from './pages/Footer'
import  AccordionUsage from './pages/Questions.jsx'
import TweetGrid from './pages/Tweets'
import { Results } from './pages/Results'
import { Analytics } from "@vercel/analytics/react"
function App() {
  return (
    <div className="min-h-screen w-full relative bg-black">
      <Analytics/>

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
        <Hero />
        <Results />
        <AccordionUsage/>
        <TweetGrid/>
        <Footer />
      </div>

    </div>
  );
}

export default App

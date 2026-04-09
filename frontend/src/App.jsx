import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import Stills from "../pages/Stills";
import Motion from "../pages/Motion";
import About from "../pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stills" element={<Stills />} />
        <Route path="/motion" element={<Motion />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/:type/:slug"
          element={
            <div className="min-h-screen bg-cream pt-28 px-6 md:px-10 max-w-6xl mx-auto page-transition">
              <p className="font-mono text-xs text-charcoal/40">
                Case study — coming soon
              </p>
            </div>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

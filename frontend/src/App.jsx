import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import Stills from "../pages/Stills";
import Motion from "../pages/Motion";
import About from "../pages/About";
import Shop           from "../pages/Shop";
import ProductDetail  from "../pages/ProductDetail";
import Checkout       from "../components/shop/checkout/Checkout";
import OrderSuccess   from "../pages/OrderSuccess";


const pageTransition = {
  initial: { opacity:0, y:18 },
  animate: { opacity:1, y:0, transition:{ duration:0.6, ease:[0.16,1,0.3,1] } },
  exit:    { opacity:0, y:-14, transition:{ duration:0.35, ease:[0.16,1,0.3,1] } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition}>
        <Routes location={location}>
          <Route path="/"          element={<Home />}   />
          <Route path="/stills"    element={<Stills />} />
          <Route path="/motion"    element={<Motion />} />
          <Route path="/about"     element={<About />}  />
          <Route path="/shop"          element={<Shop />}           />
          <Route path="/shop/:slug"    element={<ProductDetail />}  />
          <Route path="/checkout"      element={<Checkout />}       />
          <Route path="/order-success" element={<OrderSuccess />}   />
          <Route path="/:type/:slug" element={
            <div style={{
              minHeight: "100vh", backgroundColor: "var(--bg)",
              padding: "120px 48px 80px",
            }}>
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.68rem", color: "var(--fg-40)",
              }}>Case study — coming soon</p>
            </div>
          } />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}
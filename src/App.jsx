import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { EstimateProvider } from "./components/EstimateContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StickyBar from "./components/StickyBar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import ReviewsPage from "./pages/ReviewsPage";
import Contact from "./pages/Contact";
import RequestEstimate from "./pages/RequestEstimate";
import ThankYou from "./pages/ThankYou";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { window.__agcNavigate = navigate; }, [navigate]); // used by the demo build only
  return null;
}

export default function App() {
  return (
    <EstimateProvider>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/our-work" element={<Navigate to="/services" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/service-area" element={<Navigate to="/contact" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/request-estimate" element={<RequestEstimate />} />
          <Route path="/book" element={<Navigate to="/request-estimate" replace />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <StickyBar />
    </EstimateProvider>
  );
}

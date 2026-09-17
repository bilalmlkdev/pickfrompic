import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Header from "./components/organisms/Header";
import PageShell from "./components/templates/PageShell";
import Dashboard from "./pages/Dashboard";
import ColorConversion from "./pages/ColorConversion";
import { DashboardProvider } from "./context/DashboardContext";
import MainPicker from "./pages/MainPicker";
import NotFound from "./pages/NotFound";
import TopLoader from "./components/atoms/TopLoader";
import ErrorBoundary from "./components/organisms/ErrorBoundary";
import OfflineBanner from "./components/organisms/OfflineBanner";
import useDocumentTitle from "./hooks/useDocumentTitle";

const DelayedRoutes = () => {
  const location = useLocation();
  useDocumentTitle();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [loaderKey, setLoaderKey] = useState(0);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname && !showLoader) {
      setShowLoader(true);
      setLoaderKey((k) => k + 1);
    }
  }, [location, displayLocation, showLoader]);

  const handleLoaderComplete = useCallback(() => {
    setDisplayLocation(location);
    setShowLoader(false);
  }, [location]);

  return (
    <>
      {showLoader && <TopLoader key={loaderKey} onComplete={handleLoaderComplete} />}
      <Routes location={showLoader ? displayLocation : location}>
        <Route path="/" element={<MainPicker />} />
        <Route path="/color/:hex" element={<ColorConversion />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
        <Route path="/dashboard/:tab/create" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <BrowserRouter>
          <OfflineBanner />
          <PageShell>
            <Header />
            <DelayedRoutes />
          </PageShell>
        </BrowserRouter>
      </DashboardProvider>
    </ErrorBoundary>
  );
}

export default App;

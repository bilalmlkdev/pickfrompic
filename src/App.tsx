import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  useDocumentTitle();

  return (
    <ErrorBoundary>
      <DashboardProvider>
        <BrowserRouter>
          <OfflineBanner />
          <PageShell>
            <TopLoader />
            <Header />
            <Routes>
              <Route path="/" element={<MainPicker />} />
              <Route path="/color/:hex" element={<ColorConversion />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/:tab" element={<Dashboard />} />
              <Route path="/dashboard/:tab/create" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageShell>
        </BrowserRouter>
      </DashboardProvider>
    </ErrorBoundary>
  );
}

export default App;

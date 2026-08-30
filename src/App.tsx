import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import ColorDetailPage from "./pages/ColorDetailsPage";
import { DashboardProvider } from "./context/DashboardContext";
import MainPicker from "./pages/MainPicker";

function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-cyan-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col transition-colors">
          <Header />
          <Routes>
            <Route path="/" element={<MainPicker />} />
            <Route path="/color/:hex" element={<ColorDetailPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:tab" element={<Dashboard />} />
            <Route path="/dashboard/:tab/create" element={<Dashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </DashboardProvider>
  );
}

export default App;

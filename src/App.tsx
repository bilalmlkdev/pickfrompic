import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
// import CreatePalette from "./pages/CreatePalette";
// import GradientMaker from "./pages/GradientMaker";
import ColorConversion from "./pages/ColorConversion";
import ContrastChecker from "./pages/ContrastChecker"; // Added import
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
            <Route path="/color/:hex" element={<ColorConversion />} />

            {/* New Route */}
            <Route path="/contrast-checker" element={<ContrastChecker />} />

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

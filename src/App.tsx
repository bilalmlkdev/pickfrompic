import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/organisms/Header";
import PageShell from "./components/templates/PageShell";
import Dashboard from "./pages/Dashboard";
import ColorConversion from "./pages/ColorConversion";
import ContrastChecker from "./pages/ContrastChecker";
import { DashboardProvider } from "./context/DashboardContext";
import MainPicker from "./pages/MainPicker";

function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <PageShell>
            <Header />
          <Routes>
            <Route path="/" element={<MainPicker />} />
            <Route path="/color/:hex" element={<ColorConversion />} />
            <Route path="/contrast-checker" element={<ContrastChecker />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:tab" element={<Dashboard />} />
            <Route path="/dashboard/:tab/create" element={<Dashboard />} />
          </Routes>
        </PageShell>
      </BrowserRouter>
    </DashboardProvider>
  );
}

export default App;

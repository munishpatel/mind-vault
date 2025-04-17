import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Journal from "./pages/Journal";
import Checklist from "./pages/Checklist";
import Planner from "./pages/Planner";
import OfflineStatus from "./components/OfflineStatus";

function App() {
  return (
    <BrowserRouter basename="/mind-vault">
      <OfflineStatus />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/planner" element={<Planner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import PortalApp from "./portal/PortalApp";
import VerifyPage from "./portal/VerifyPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/portal" element={<PortalApp />} />
      <Route path="/portal/verify" element={<VerifyPage />} />
    </Routes>
  );
}

export default App;

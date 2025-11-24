import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Anvandare from "./pages/Anvandare";
import Projekt from "./pages/Projekt";
import Team from "./pages/Team";
import Kompetenser from "./pages/Kompetenser";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/anvandare" element={<Anvandare />} />
                <Route path="/projekt" element={<Projekt />} />
                <Route path="/team" element={<Team />} />
                <Route path="/kompetenser" element={<Kompetenser />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

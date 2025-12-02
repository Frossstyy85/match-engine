import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Anvandare from "./pages/Anvandare";
import Projekt from "./pages/Projekt";
import Team from "./pages/Team";
import Kompetenser from "./pages/Kompetenser";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Enkel auth-check
const isAuthenticated = () => {
    return localStorage.getItem("user") !== null;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={!isAuthenticated() ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!isAuthenticated() ? <Register /> : <Navigate to="/" />} />

                {/* Protected routes */}
                <Route path="/" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/anvandare" element={isAuthenticated() ? <Anvandare /> : <Navigate to="/login" />} />
                <Route path="/projekt" element={isAuthenticated() ? <Projekt /> : <Navigate to="/login" />} />
                <Route path="/team" element={isAuthenticated() ? <Team /> : <Navigate to="/login" />} />
                <Route path="/kompetenser" element={isAuthenticated() ? <Kompetenser /> : <Navigate to="/login" />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to={isAuthenticated() ? "/" : "/login"} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

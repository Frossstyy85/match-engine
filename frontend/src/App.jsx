import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Pages
import Dashboard from "./pages/Dashboard";
import Anvandare from "./pages/Anvandare";
import Projekt from "./pages/Projekt";
import Team from "./pages/Team";
import Kompetenser from "./pages/Kompetenser";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
// Guards
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/anvandare"
          element={
            <PrivateRoute>
              <Anvandare />
            </PrivateRoute>
          }
        />
        <Route
          path="/projekt"
          element={
            <PrivateRoute>
              <Projekt />
            </PrivateRoute>
          }
        />
        <Route
          path="/team"
          element={
            <PrivateRoute>
              <Team />
            </PrivateRoute>
          }
        />
        <Route
          path="/kompetenser"
          element={
            <PrivateRoute>
              <Kompetenser />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

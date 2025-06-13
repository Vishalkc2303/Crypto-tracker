import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../layout/Layout";
import Dashboard from "../components/Dashboard/Dashboard";
import { Login } from "../components/Auth/Login";
import { Register } from "../components/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import PublicRoute from "./PublicRoute";
import { WatchListPage } from "../pages/WatchListPage";

const AppRoutes = () => {
  // const Navigate = useNavigate();
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Wrap a parent route in ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            <Route path="/watchlist" element={<WatchListPage />} />
          </Route>

          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* 👇 Wildcard route: catches all unmatched routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default AppRoutes;

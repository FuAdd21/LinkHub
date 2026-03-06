// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProtectedRoute from "./Components/ProtectedRoute";
import ForgotPassword from "./Components/ForgetPassword";
import WelcomePage from "./Components/WelcomePage";
import PublicProfile from "./pages/PublicProfile";
import Onboarding from "./pages/Onboarding";
import { Toaster } from "react-hot-toast";

// Lazy-loaded dashboard pages
const DashboardLayout = lazy(() =>
  import("./pages/dashboard/DashboardLayout")
);

function App() {
  return (
    <Router>
      <>
        <Toaster position="top-center" reverseOrder={false} />
      </>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/create-profile" 
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Suspense
                fallback={
                  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <DashboardLayout />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/:username" element={<PublicProfile />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/50">
              404: Page not found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

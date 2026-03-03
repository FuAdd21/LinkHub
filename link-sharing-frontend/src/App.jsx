// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserPage from "./Components/UserPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminDashboard from "./Components/AdminDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import ForgotPassword from "./Components/ForgetPassword";
import WelcomePage from "./Components/WelcomePage";
import PublicDashboard from "./Components/PublicDashboard";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <>
        <Toaster position="top-center" reverseOrder={false} />
      </>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/:username" element={<PublicDashboard />} />
        <Route path="/:username" element={<UserPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<div>404: page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;

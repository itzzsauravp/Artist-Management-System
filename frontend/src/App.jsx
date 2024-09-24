import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/userInfo"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;

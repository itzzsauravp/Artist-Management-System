import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import validateTokenFE from "../utils/validateTokenFE";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await validateTokenFE();
        setIsValid(result.isValid);
      } catch {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return isValid ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

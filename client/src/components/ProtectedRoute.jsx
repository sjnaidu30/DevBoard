import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/me");
        if (res.data.user) {
          setUser(res.data.user);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "40vh" }}>
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default ProtectedRoute;

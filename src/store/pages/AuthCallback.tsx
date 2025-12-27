import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading } = useAuth();
  const [hasToken] = useState(() => !!searchParams.get("token"));

  useEffect(() => {
    // Wait for auth loading to complete
    if (!loading) {
      // If we had a token in the URL and we're now authenticated, go to store
      if (hasToken && isAuthenticated) {
        navigate("/store", { replace: true });
      }
      // If we had a token but auth still failed, or no token at all, go to login
      else if (!isAuthenticated) {
        // Give it a moment in case the session check is still processing
        const timer = setTimeout(() => {
          navigate("/store/login", { replace: true });
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, loading, hasToken, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg" style={{ color: "black" }}>
        Completing sign in...
      </div>
    </div>
  );
};

export default AuthCallback;

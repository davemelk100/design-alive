import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { checkAdminAuth } from "../utils/adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();

  // Automatically redirect to admin panel since no password is required
  useEffect(() => {
    navigate("/admin");
  }, [navigate]);

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <button
          onClick={handleBackClick}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Site
        </button>

        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-8">
          <h1 className="text-4xl sm:text-5xl font-bold dark:text-white mb-6 text-center">
            Admin Access
          </h1>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Redirecting to admin panel...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

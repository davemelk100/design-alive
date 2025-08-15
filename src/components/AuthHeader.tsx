import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthModal } from "./AuthModal";
import { UserProfile } from "./UserProfile";

export const AuthHeader: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-end p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Bottom of Left Navigation - Fixed Position */}
      <div className="fixed bottom-4 left-4 z-50 w-56">
        {isAuthenticated && user ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user.name || user.email.split("@")[0]}!
              </span>
            </div>
            <button
              onClick={() => setShowUserProfile(true)}
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              View Profile
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-lg"
          >
            Log in
          </button>
        )}
      </div>

      {/* Auth Modal - Rendered via Portal to escape positioning constraints */}
      {showAuthModal &&
        createPortal(
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />,
          document.body
        )}

      {/* User Profile Modal - Rendered via Portal to escape positioning constraints */}
      {showUserProfile &&
        createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Profile
                  </h2>
                  <button
                    onClick={() => setShowUserProfile(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <UserProfile />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

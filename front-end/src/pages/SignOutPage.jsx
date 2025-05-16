// src/pages/SignOutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if necessary

// Simple LogOutIcon
const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

function SignOutPage() {
  const { logout, currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    // The logout function in AuthContext already handles navigation
    // so we don't need to navigate('/') here explicitly after calling it.
    await logout(); 
    // setIsLoggingOut(false); // Component will likely unmount after logout
  };

  const openConfirmation = () => {
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  const confirmSignOut = () => {
    closeConfirmation();
    handleSignOut();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-800 text-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
        <p className="text-lg text-gray-700 dark:text-gray-200">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-800 text-center px-4">
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-lg rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
          Sign Out
        </h1>
        {currentUser && (
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Are you sure you want to sign out, <span className="font-semibold">{currentUser.username}</span>?
          </p>
        )}
        {!currentUser && (
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Are you sure you want to sign out?
          </p>
        )}

        <button
          onClick={openConfirmation}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOutIcon />
          {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
        </button>

        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="mt-4 w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-gray-200 font-medium rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
        >
          Cancel
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-full">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">Confirm Sign Out</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You will be returned to the login page.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirmation}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-gray-200 font-medium rounded-lg transition-colors"
              >
                Stay In
              </button>
              <button
                onClick={confirmSignOut}
                disabled={isLoggingOut}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                    </div>
                ) : (
                    'Confirm Sign Out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-10 text-xs text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} Style App. All rights reserved.
      </p>
    </div>
  );
}

export default SignOutPage;

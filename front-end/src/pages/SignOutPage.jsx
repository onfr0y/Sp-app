// src/pages/SignOutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Adjust path if necessary

// Simple LogOutIcon - styled for the new theme
const LogOutIcon = ({ className = "h-5 w-5 mr-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// Spinner Icon for buttons
const ButtonSpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


function SignOutPage() {
  const { logout, currentUser, isLoading: authIsLoading } = useAuth(); // Renamed isLoading to authIsLoading
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await logout();
    // Component will likely unmount, so setIsLoggingOut(false) might not be reached or necessary.
  };

  const openConfirmation = () => setShowConfirmation(true);
  const closeConfirmation = () => setShowConfirmation(false);

  const confirmSignOut = () => {
    closeConfirmation();
    handleSignOut();
  };

  // Note: Ensure "Open Sans" is imported in your project's main CSS or index.html
  // <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">

  if (authIsLoading) { // Use the renamed isLoading
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white/90 font-['Open_Sans',_sans-serif] text-center px-4 relative">
        {/* Background Image */}
        <div className="fixed inset-0 bg-[url('https://i.pinimg.com/736x/74/d9/b6/74d9b62c4603875276c53e75e7b93cd5.jpg')] bg-cover bg-center z-[-2]"></div>
        {/* Dark Overlay */}
        <div className="fixed inset-0 bg-black/70 z-[-1]"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50 mb-4"></div>
        <p className="text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-['Open_Sans',_sans-serif] text-white/90 text-center px-4 relative">
      {/* Background Image */}
      <div className="fixed inset-0 bg-[url('https://i.pinimg.com/736x/de/d3/45/ded3457a372af8ee97e0c7ef0f2a8f1d.jpg')] bg-cover bg-center z-[-2]"></div>
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/70 z-[-1]"></div>

      <div className="w-full max-w-md p-6 sm:p-8 bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10">
        <h1 className="text-3xl font-semibold text-gray-50 mb-6">
          Sign Out
        </h1>
        {currentUser && (
          <p className="text-gray-300/90 mb-8 text-lg">
            Are you sure you want to sign out, <span className="font-semibold text-gray-100">{currentUser.username}</span>?
          </p>
        )}
        {!currentUser && ( // Should ideally not happen if sign out page is protected
          <p className="text-gray-300/90 mb-8 text-lg">
            You are about to sign out.
          </p>
        )}

        <button
          onClick={openConfirmation}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center px-6 py-3 bg-red-600/80 hover:bg-red-500/90 border border-red-400/30 text-white font-semibold rounded-full shadow-lg hover:shadow-red-500/30 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-black/50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? <ButtonSpinnerIcon /> : <LogOutIcon />}
          <span className={isLoggingOut ? 'ml-2' : ''}>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-gray-200 hover:text-white font-medium rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black/50"
        >
          Cancel
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full animate-popIn">
            <h2 className="text-xl font-semibold text-gray-50 mb-4">Confirm Sign Out</h2>
            <p className="text-gray-300/90 mb-6">
              You will be returned to the login page.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={closeConfirmation}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/30 text-gray-200 hover:text-white font-medium rounded-full transition-colors w-full sm:w-auto"
              >
                Stay In
              </button>
              <button
                onClick={confirmSignOut}
                disabled={isLoggingOut}
                className="px-5 py-2.5 bg-red-600/80 hover:bg-red-500/90 border border-red-400/30 text-white font-semibold rounded-full transition-colors disabled:opacity-60 w-full sm:w-auto flex items-center justify-center"
              >
                {isLoggingOut ? (
                    <>
                        <ButtonSpinnerIcon />
                        <span className="ml-2">Processing...</span>
                    </>
                ) : (
                    'Confirm & Sign Out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-12 text-xs text-white/50">
        &copy; {new Date().getFullYear()} O2 Style App. All rights reserved.
      </p>
    </div>
  );
}

export default SignOutPage;
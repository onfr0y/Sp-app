// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-800 text-center px-4">
      <h1 className="text-6xl sm:text-8xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</h1>
      <p className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        Oops! Page Not Found.
      </p>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-150 ease-in-out"
      >
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;

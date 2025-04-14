import React from 'react';
import './index.css';

function Catebub() {
  return (
    <div>
      {/* Filter Buttons */}
      <div className="pt-1 mx-10 flex flex-wrap gap-2">
        <div className="relative flex flex-wrap gap-2">
          <button className="border border-gray-200 dark:border-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-700 shadow-sm transition-all duration-200">
            Asian
          </button>
          <button className="border border-gray-200 dark:border-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-700 shadow-sm transition-all duration-200">
            Black
          </button>
          <button className="border border-gray-200 dark:border-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-700 shadow-sm transition-all duration-200">
            White
          </button>
          <button className="border border-gray-200 dark:border-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-700 shadow-sm transition-all duration-200">
            Asian
          </button>
        </div>
      </div>
    </div>
  );
}

export default Catebub;
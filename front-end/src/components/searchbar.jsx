import React from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/search');
  };

  return (
    <div 
      className="md:resize w-full max-w-screen-xl px-4 sm:px-6 mx-3 mt-5 lg:px-8 py-5 g transition-transform duration-300 hover:scale-105"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="relative flex items-center border border-gray-200 dark:border-gray-700 rounded-full shadow-sm transition-all duration-200 p-2 sm:p-3 md:p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0"
        >
          <g clipPath="url(#clip0_18_3844)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.5 0.75C3.77208 0.75 0.75 3.77208 0.75 7.5C0.75 11.2279 3.77208 14.25 7.5 14.25C9.09376 14.25 10.5585 13.6976 11.7133 12.7739L15.9697 17.0303C16.2626 17.3232 16.7374 17.3232 17.0303 17.0303C17.3232 16.7374 17.3232 16.2626 17.0303 15.9697L12.7739 11.7133C13.6976 10.5585 14.25 9.09376 14.25 7.5C14.25 3.77208 11.2279 0.75 7.5 0.75ZM2.25 7.5C2.25 4.60051 4.60051 2.25 7.5 2.25C10.3995 2.25 12.75 4.60051 12.75 7.5C12.75 10.3995 10.3995 12.75 7.5 12.75C4.60051 12.75 2.25 10.3995 2.25 7.5Z"
              fill="currentColor"
            />
          </g>
          <defs>
            <clipPath id="clip0_18_3844">
              <rect width="18" height="18" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <input
          type="text"
          placeholder="Search..."
          className="ml-2 sm:ml-3 md:ml-4 font-mono text-xs sm:text-sm md:text-base lg:text-lg font-medium bg-transparent focus:outline-none w-full placeholder-gray-500 dark:placeholder-gray-400"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

export default SearchBar;

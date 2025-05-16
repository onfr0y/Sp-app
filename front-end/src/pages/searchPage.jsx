// src/pages/searchPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate }  from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Search Icon (magnifying glass)
const SearchIcon = ({ className = "w-5 h-5 text-gray-500" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

// Home Icon
const HomeIcon = ({ className = "w-6 h-6 text-gray-700" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

// Clear search text icon (X)
const ClearIcon = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchType = 'users'; // Hardcoded to users for now

  const { authToken } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Dummy recent searches - replace with actual logic if needed
  const recentSearches = ["WHITE", "Black", "Asian", "Thai"];

  useEffect(() => {
    // Effect to fetch search results when searchTerm changes (debounced)
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setError(null);
      return; // Exit if search term is empty
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        let response;
        if (searchType === 'users') {
          response = await axios.get(`${API_BASE_URL}/api/users/search`, {
            headers: { Authorization: `Bearer ${authToken}` },
            params: { q: searchTerm.trim() }
          });
        } 
        setSearchResults(response.data || []);
      } catch (err) {
        console.error(`Error searching ${searchType}:`, err.response?.data?.message || err.message);
        setError(err.response?.data?.message || `Failed to fetch ${searchType}.`);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms delay before making the API call

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on component unmount or searchTerm change
  }, [searchTerm, searchType, authToken, API_BASE_URL]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
  };

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term); // Set search term to the clicked recent search
  };

  return (
    // Main container with white background, removing dark theme classes
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      {/* Top bar with Search Input and Home button, styled like the image */}
      <div className="sticky top-0 z-10 bg-white pt-4 pb-3 px-4 border-b border-gray-200"> {/* Added border-b for subtle separation */}
        <div className="flex items-center space-x-3">
          {/* Search input container, replicating the style of SearchBar.jsx */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> {/* Adjusted padding for icon */}
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search type of your outfit..." // Placeholder from image
              // Styling to match SearchBar.jsx and image (rounded-full, bg-gray-100, etc.)
              className="w-full pl-12 pr-10 py-3 border border-gray-300 bg-gray-100 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700" // Adjusted padding for clear icon
                aria-label="Clear search"
              >
                <ClearIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          {/* Home button */}
          <button 
            onClick={() => navigate('/')} 
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0" // Adjusted padding and ensure it doesn't shrink
            aria-label="Go home"
          >
            <HomeIcon className="w-6 h-6 text-gray-700"/>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto px-4 py-4">
        {/* Conditional rendering: Show recent searches or search results */}
        {searchTerm.trim() === '' && !isLoading && !error ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent</h2>
            <ul className="space-y-2">
              {recentSearches.map((term, index) => (
                <li key={index} 
                    onClick={() => handleRecentSearchClick(term)}
                    // Styling for recent search items
                    className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                  <div className="p-2 bg-gray-100 rounded-full mr-3"> {/* Circular background for icon */}
                    <SearchIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <span className="text-gray-700">{term}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {/* Results Area (Users) */}
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
                <p className="ml-3 text-gray-600">Searching...</p>
              </div>
            )}
            {error && !isLoading && (
              <div className="text-center py-10 px-4">
                <p className="text-red-500">{error}</p>
              </div>
            )}
            {!isLoading && !error && searchResults.length === 0 && searchTerm.trim() !== '' && (
              <div className="text-center py-10 px-4">
                <p className="text-gray-500">No users found for "{searchTerm}".</p>
              </div>
            )}

            {searchType === 'users' && searchResults.length > 0 && !isLoading && !error && (
              <ul className="space-y-1">
                {searchResults.map((user) => (
                  <li key={user._id} className="hover:bg-gray-100 rounded-lg transition-colors duration-150">
                    <Link to={`/profile/${user._id}`} className="flex items-center space-x-3 group p-3">
                      <img
                        src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=e0e0e0&color=333&size=128&font-size=0.33&bold=true&rounded=true`}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=e0e0e0&color=333&size=128&font-size=0.33&bold=true&rounded=true`}}
                      />
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-black">{user.username}</p>
                        {user.desc && <p className="text-xs text-gray-500 truncate max-w-xs">{user.desc}</p>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;

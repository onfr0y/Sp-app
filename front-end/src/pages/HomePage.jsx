// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import TextHeader from '../components/text-header.jsx';
import SearchBar from '../components/searchbar.jsx';
import Photobuble from '../components/photobuble.jsx'; // Use the Photobuble version that you know works with static data
import Catebub from '../components/cate-bub.jsx';
import DynamicActionBar from '../components/DynamicActionBar.jsx';
import axios from 'axios';

function HomePage() {
  // State for posts fetched from backend
  const [feedPosts, setFeedPosts] = useState([]); // Initialize with empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the base URL for your API.
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Fallback

  useEffect(() => {
    const fetchFeedPosts = async () => {
      console.log("HomePage useEffect: Starting to fetch posts...");
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = `${API_BASE_URL}/api/posts`;
        console.log("HomePage useEffect: Fetching from URL:", endpoint);
        const response = await axios.get(endpoint);

        console.log("HomePage useEffect: Raw response from backend:", response);

        if (response && response.data && Array.isArray(response.data)) {
          console.log("HomePage useEffect: Data is an array. Length:", response.data.length);
          // Validate each item to ensure it has id, image, and height
          const validatedPosts = response.data.map((post, index) => {
            const isValid = post && typeof post.id !== 'undefined' &&
                            typeof post.image === 'string' && post.image.trim() !== '' &&
                            typeof post.height === 'number' && !isNaN(post.height);
            if (!isValid) {
              console.warn(`HomePage useEffect: Post at index ${index} is invalid or missing required fields (id, image, height):`, post);
            }
            return isValid ? post : null;
          }).filter(post => post !== null); // Remove invalid posts

          if (validatedPosts.length !== response.data.length) {
            console.warn("HomePage useEffect: Some posts were filtered out due to validation issues.");
          }
          
          console.log("HomePage useEffect: Validated posts to be set:", validatedPosts);
          setFeedPosts(validatedPosts);

        } else {
          console.error("HomePage useEffect: Data received from backend is NOT a valid array or is missing.", response ? response.data : 'No response data');
          throw new Error("Invalid data format received from the server.");
        }
      } catch (err) {
        console.error("HomePage useEffect: Error during fetchPosts:", err);
        let errorMessage = "Failed to load feed.";
        if (err.response) { // Axios error structure
          console.error("HomePage useEffect: Axios error response data:", err.response.data);
          console.error("HomePage useEffect: Axios error response status:", err.response.status);
          errorMessage = err.response.data?.message || err.message || "Error from server (no specific message).";
        } else if (err.request) { // Request was made but no response
          console.error("HomePage useEffect: No response received for the request:", err.request);
          errorMessage = "No response from server. Check backend and network.";
        } else { // Something else happened
          errorMessage = err.message || "An unknown error occurred during fetching.";
        }
        setError(errorMessage);
        setFeedPosts([]); // Clear posts on error
      } finally {
        setIsLoading(false);
        console.log("HomePage useEffect: Fetching finished. isLoading:", false);
      }
    };

    fetchFeedPosts();
  }, [API_BASE_URL]); // Dependency array

  console.log("HomePage render: isLoading:", isLoading, "error:", error, "feedPosts count:", feedPosts.length);

  return (
    <>
      <TextHeader />
      <div>
        <SearchBar />
        <Catebub />
      </div>

      <div className="mt-6 sm:mt-8 px-2 sm:px-4">
        {isLoading && <div className="w-full text-center py-10">Loading photos... (HomePage)</div>}
        {error && <div className="w-full text-center py-10 text-red-500">Error loading feed (HomePage): {error}</div>}
        {!isLoading && !error && (
          <>
            {console.log("HomePage render: Passing to Photobuble, data length:", feedPosts.length, "First item (if any):", feedPosts[0])}
            {/* Use the Photobuble version that you confirmed works with static data */}
            <Photobuble data={feedPosts} />
          </>
        )}
         {!isLoading && !error && feedPosts.length === 0 && (
          <div className="w-full text-center py-10">No photos to display yet. (HomePage)</div>
        )}
      </div>
      <DynamicActionBar />
    </>
  );
}

export default HomePage;
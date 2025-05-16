// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import TextHeader from '../components/text-header.jsx';
import SearchBar from '../components/searchbar.jsx';
import Photobuble from '../components/photobuble.jsx';
import Catebub from '../components/cate-bub.jsx';
import DynamicActionBar from '../components/DynamicActionBar.jsx';
import axios from 'axios';
import DetailedPostModal from '../components/DetailedPostModal.jsx'; // Import the modal
import { useAuth } from '../context/AuthContext.jsx'; // To get current user for author info fallback

function HomePage() {
  const [feedPosts, setFeedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the modal
  const [selectedPostForModal, setSelectedPostForModal] = useState(null);
  const [authorDetails, setAuthorDetails] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const { currentUser } = useAuth(); // Get current user details

  useEffect(() => {
    const fetchFeedPosts = async () => {
      console.log("HomePage useEffect: Starting to fetch posts...");
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = `${API_BASE_URL}/api/posts`;
        console.log("HomePage useEffect: Fetching from URL:", endpoint);
        const response = await axios.get(endpoint);

        if (response && response.data && Array.isArray(response.data)) {
          console.log("HomePage useEffect: Data is an array. Length:", response.data.length);
          const validatedPosts = response.data.map((post) => {
            // Ensure all necessary fields for both Photobuble and DetailedPostModal are present
            const isValid = post &&
                            typeof post.id !== 'undefined' && // Photobuble key, Modal ID
                            typeof post.image === 'string' && // Photobuble display image
                            typeof post.height === 'number' && !isNaN(post.height) && // Photobuble layout
                            typeof post.userId === 'string' && // For fetching author
                            (typeof post.desc === 'string' || post.desc === null || typeof post.desc === 'undefined') && // Description
                            Array.isArray(post.likes) && // Likes array
                            typeof post.createdAt !== 'undefined'; // Post date
                            // The 'img' array from the backend model is also good to have directly on the post object
                            // if the DetailedPostModal needs to show multiple images or specific details from it.
                            // The backend currently maps the first image from 'img' to 'post.image'.
                            // If 'post.img' itself is needed, ensure it's passed through.

            if (!isValid) {
              console.warn(`HomePage useEffect: Post is invalid or missing required fields:`, post);
            }
            return isValid ? post : null;
          }).filter(post => post !== null);

          if (validatedPosts.length !== response.data.length) {
            console.warn("HomePage useEffect: Some posts were filtered out due to validation issues.");
          }
          
          setFeedPosts(validatedPosts);

        } else {
          console.error("HomePage useEffect: Data received from backend is NOT a valid array or is missing.", response ? response.data : 'No response data');
          throw new Error("Invalid data format received from the server.");
        }
      } catch (err) {
        console.error("HomePage useEffect: Error during fetchPosts:", err);
        let errorMessage = "Failed to load feed.";
        if (err.response) {
          errorMessage = err.response.data?.message || err.message || "Error from server.";
        } else if (err.request) {
          errorMessage = "No response from server. Check backend and network.";
        } else {
          errorMessage = err.message || "An unknown error occurred during fetching.";
        }
        setError(errorMessage);
        setFeedPosts([]);
      } finally {
        setIsLoading(false);
        console.log("HomePage useEffect: Fetching finished.");
      }
    };

    fetchFeedPosts();
  }, [API_BASE_URL]);

  // Function to handle when a post is clicked in Photobuble
  const handlePostClick = async (postData) => {
    console.log("Post clicked in Photobuble, opening modal for:", postData);
    setSelectedPostForModal(postData); // Set the full post data

    if (postData && postData.userId) {
      try {
        setAuthorDetails(null); // Clear previous author details, show loading state in modal
        console.log(`Fetching author details for userId: ${postData.userId}`);
        const userResponse = await axios.get(`${API_BASE_URL}/api/users/${postData.userId}`);
        if (userResponse.data) {
          console.log("Author details fetched for modal:", userResponse.data);
          setAuthorDetails(userResponse.data);
        } else {
          console.warn("No data returned for author for modal.");
          setAuthorDetails({ username: 'Unknown User', profilePicture: '' }); // Fallback
        }
      } catch (err) {
        console.error("Error fetching author details for modal:", err);
        setAuthorDetails({ username: 'User N/A', profilePicture: '' }); // Error fallback
      }
    } else {
      console.warn("Clicked post data is missing userId, cannot fetch author for modal.");
      // If the author is the current user, we can use their details directly
      if (currentUser && postData && postData.userId === currentUser._id) {
        setAuthorDetails(currentUser);
      } else {
        setAuthorDetails({ username: 'Author Info Unavailable', profilePicture: '' });
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedPostForModal(null);
    setAuthorDetails(null);
  };

  return (
    <>
      <TextHeader />
      <div>
        <SearchBar />
        <Catebub />
      </div>

      <div className="mt-6 sm:mt-8 px-2 sm:px-4">
        {isLoading && <div className="w-full text-center py-10 text-gray-500">Loading photos...</div>}
        {error && <div className="w-full text-center py-10 text-red-500">Error: {error}</div>}
        {!isLoading && !error && (
          <Photobuble data={feedPosts} onItemClick={handlePostClick} />
        )}
         {!isLoading && !error && feedPosts.length === 0 && (
          <div className="w-full text-center py-10 text-gray-500">No photos to display yet.</div>
        )}
      </div>
      <DynamicActionBar />

      {/* Render the modal conditionally */}
      {selectedPostForModal && (
        <DetailedPostModal
          post={selectedPostForModal}
          author={authorDetails}
          currentUser={currentUser} // Pass current user for like status, etc.
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default HomePage;

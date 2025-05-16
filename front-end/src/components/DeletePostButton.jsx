// front-end/src/components/DeletePostButton.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Adjust path if your AuthContext is located elsewhere

// Define the base URL for your API.
// It's good practice to ensure this is consistent across your components that make API calls.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Simple Trash Icon component (or you can use one from a library like lucide-react)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const DeletePostButton = ({ postId, onPostDeleted, className = '' }) => {
  const { authToken } = useAuth(); // We only need authToken for the delete request header
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!postId) {
      setError("Post ID is missing. Cannot delete.");
      console.error("DeletePostButton: Post ID is missing.");
      return;
    }

    // Confirmation dialog
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return; // User cancelled
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      // Axios typically throws an error for non-2xx status codes,
      // so checking response.status === 200 is a good confirmation.
      if (response.status === 200) {
        console.log(`Post ${postId} deleted successfully from server.`);
        if (onPostDeleted) {
          onPostDeleted(postId); // Callback to notify parent component for UI update
        }
        // Optionally, you could show a temporary success message here
        // if the UI update isn't immediate or obvious.
      } else {
        // This case might be redundant if axios throws an error for non-2xx,
        // but it's a safeguard.
        throw new Error(response.data?.message || `Failed to delete post. Status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      let errorMessage = "An error occurred while deleting the post.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // If there's an error, you might want to display it
  // This is a simple way; you could integrate it more smoothly into your UI
  if (error) {
    return (
      <div className={`text-red-500 text-xs p-2 ${className}`}>
        <p>Error: {error}</p>
        <button
          onClick={() => { setError(null); /* Optionally, re-enable the main button or try again */ }}
          className="mt-1 text-blue-600 hover:underline text-xs"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className={`p-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-700/20 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title="Delete Post"
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <TrashIcon />
      )}
      <span className="sr-only">Delete Post</span> {/* For accessibility */}
    </button>
  );
};

export default DeletePostButton;
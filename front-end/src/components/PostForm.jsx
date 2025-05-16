// src/components/PostForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // AuthProvider is usually higher up the tree

import ImageUploadInput from './ImageUploadInput';

const POSTS_API_URL = 'http://localhost:3000/api/posts';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const { currentUser, authToken, isAuthenticated, isLoading: authIsLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Effect to redirect if not authenticated
  useEffect(() => {
    // Wait for initial auth check to complete before redirecting
    if (!authIsLoading && !isAuthenticated) {
      console.log('PostForm: Not authenticated, navigating to login.');
      navigate('/login');
    }
  }, [isAuthenticated, authIsLoading, navigate]);

  // Moved handleFileChange to the component scope
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setFormError(null); // Clear previous file-related errors if any
    } else {
      setSelectedFile(null); // Clear if no file is selected (e.g., user cancels dialog)
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated || !currentUser || !authToken) {
      setFormError("You must be logged in to create a post.");
      return;
    }
    if (!selectedFile) {
      setFormError("Please select an image.");
      return;
    }
    // ... other validations ...

    setFormLoading(true);
    setFormError(null);

    const apiFormData = new FormData();
    apiFormData.append('title', title);
    apiFormData.append('desc', content);
    apiFormData.append('userId', currentUser._id); // Safely from context
    apiFormData.append('postImages', selectedFile);

    try {
      const response = await fetch(POSTS_API_URL, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data' is automatically set by browser with FormData
          'Authorization': `Bearer ${authToken}`, // Token from context
        },
        body: apiFormData,
      });

      if (response.ok) {
          // const newPost = await response.json(); // Optionally get the created post data
          navigate('/'); // Navigate to homepage or post page
      } else {
          const errorData = await response.json();
          setFormError(errorData.message || "Failed to create post. Status: " + response.status);
      }
    } catch (err) {
      console.error("Post creation error:", err); // Log the actual error
      setFormError("An error occurred during post creation. Please check the console.");
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading if auth state is still being determined
  if (authIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="animate-spin h-6 w-6 text-indigo-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  // If definitely not authenticated (after loading), this component might not even render due to useEffect redirect
  // But as a fallback:
  if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Redirecting to login...</p>
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-3xl font-bold text-gray-800">Create Your Post, {currentUser?.username}!</h1>
        <button onClick={logout} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm">Logout</button>
      </div>
      {formError && (
            <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm" role="alert">
            <p className="font-semibold">Error:</p>
            <p>{formError}</p>
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-1">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={formLoading} required
            className="mt-1 block w-full px-3 py-2 rounded-md border border-white/40 bg-white/50 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-600/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400" />
        </div>
        <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-800 mb-1">Content (Description)</label>
            <textarea id="content" rows="6" value={content} onChange={(e) => setContent(e.target.value)} disabled={formLoading} required
            className="mt-1 block w-full px-3 py-2 rounded-md border border-white/40 bg-white/50 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-600/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"></textarea>
        </div>
        {/* ImageUploadInput handles its own display of the selected file/preview */}
        <ImageUploadInput selectedFile={selectedFile} onFileChange={handleFileChange} disabled={formLoading} />
        <div className="flex justify-end pt-2">
            <button type="submit" disabled={formLoading || !selectedFile} /* Also disable if no file selected */
            className={`px-6 py-2 bg-indigo-600/80 backdrop-blur-sm border border-indigo-500/50 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white/30 transition duration-150 ease-in-out ${(formLoading || !selectedFile) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {formLoading ? 'Creating...' : 'Create Post'}
            </button>
        </div>
        </form>
    </div>
  );
}
export default PostForm;
// src/pages/PostPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostPageHeader from '../components/PostPageHeader'; // Assuming this is styled or simple
import PostForm from '../components/PostForm';           // Using the simplified PostForm
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PostPage = () => {
  const navigate = useNavigate();
  const { currentUser, authToken, isAuthenticated, isLoading: authIsLoading } = useAuth();

  // State managed by PostPage
  const [selectedFile, setSelectedFile] = useState(null); // Stores the File object for upload
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Effect to redirect if not authenticated or auth is still loading
  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      console.log('PostPage: Not authenticated, redirecting to login.');
      navigate('/login', { replace: true });
    }
  }, [authIsLoading, isAuthenticated, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // This function will be passed to ImageUploadInput via PostForm
  const handleFileSelectedFromInput = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null); // Clear previous file-related errors
      setSuccessMessage('');
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(null);
    setSuccessMessage('');

    if (!isAuthenticated || !currentUser?._id) {
      setError("Authentication error. Please log in again.");
      setSubmitting(false); // Ensure submitting is false if we return early
      return;
    }

    setSubmitting(true);

    // Get title and content directly from the form event
    // This relies on PostForm having input fields with name="title" and name="content"
    const formElement = event.target;
    const title = formElement.title?.value || ''; // Optional title
    const content = formElement.content?.value || '';


    if (!selectedFile) {
      setError('Please select an image to upload.');
      setSubmitting(false);
      return;
    }
    if (!content && !title) { // Require at least one: content or title
      setError("Post content or a title is required.");
      setSubmitting(false);
      return;
    }

    const backendFormData = new FormData();
    backendFormData.append('userId', currentUser._id);
    backendFormData.append('desc', content || title); // Backend expects 'desc'
    backendFormData.append('postImages', selectedFile, selectedFile.name);
    if (title) { // If title exists and you want to send it separately
        backendFormData.append('title', title);
    }


    try {
      const response = await axios.post(`${API_BASE_URL}/api/posts`, backendFormData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          // 'Content-Type': 'multipart/form-data' is set by axios automatically for FormData
        }
      });

      console.log('Post created successfully:', response.data);
      setSuccessMessage('Post created successfully!');
      setSelectedFile(null); // Clear the selected file state
      
      // Reset form fields in PostForm by resetting its internal state
      // Since title and content are now in PostForm, we can't directly reset them from here
      // unless PostForm exposes a reset function or we re-render it with different initial values.
      // For simplicity, the formElement.reset() might work if PostForm doesn't prevent it.
      if(formElement.reset) formElement.reset();


      // Optionally navigate after a short delay to show success message
      // setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      console.error('Error creating post (PostPage):', err);
      let errorMessage = "Failed to create post.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (authIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 dark:border-gray-300"></div>
        <p className="ml-3 text-gray-700 dark:text-gray-300">Loading authentication...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-800">
            <p className="text-gray-700 dark:text-gray-300">Redirecting to login...</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-800 p-4 flex flex-col justify-center items-center font-sans">
      <div className="w-full max-w-lg bg-white/75 dark:bg-zinc-800/75 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-zinc-700/60 flex flex-col">
        {/* Assuming PostPageHeader is styled for glassmorphism or is simple */}
        <PostPageHeader title="Create New Post" onGoBack={handleGoBack} />
        
        <div className="p-4 sm:p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100/80 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-200 rounded-lg text-sm shadow" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100/80 dark:bg-green-900/50 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-200 rounded-lg text-sm shadow" role="alert">
              <p className="font-bold">Success</p>
              <p>{successMessage}</p>
            </div>
          )}
          <PostForm
            onSubmit={handleSubmit}
            selectedFile={selectedFile}
            onFileChange={handleFileSelectedFromInput} // Pass the correct handler
            isSubmitting={submitting}
            // To reset PostForm's internal title/content, you could pass a key to PostForm
            // that changes on successful submission, forcing it to re-mount with initial values.
            // key={successMessage} // Example: using successMessage to trigger re-render
          />
        </div>
      </div>
       <p className="mt-8 text-center text-xs text-gray-600 dark:text-gray-400">
            Share your moments. &copy; {new Date().getFullYear()} Style App.
        </p>
    </div>
  );
};

export default PostPage;

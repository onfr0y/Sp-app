// src/pages/PostPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostPageHeader from '../components/PostPageHeader';
import PostForm from '../components/PostForm';
import axios from 'axios'; // Import axios

const PostPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null); // Stores the File object
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // IMPORTANT: Get the actual logged-in user's ID from your auth system.
  // Example: If you store user info in localStorage after login:
  // const userId = JSON.parse(localStorage.getItem('user'))?.id;
  // Replace the line below with your actual user ID retrieval logic.
  const userId = JSON.parse(localStorage.getItem('user'))?.id || null;
  // Use Vite's import.meta.env for environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleFileSelected = (file) => {
    setSelectedFile(file); // file should be the File object, or null
    setError(null); // Clear previous errors when file changes
    setSuccessMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage('');
    setSubmitting(true);

    const formElement = event.target;
    const textualFormData = new FormData(formElement); // Gets 'title' and 'content'

    const title = textualFormData.get('title');
    const content = textualFormData.get('content'); // 'content' is used in your form, map it to 'desc' for backend

    console.log('Submitting post...');
    console.log('Title:', title);
    console.log('Content (becomes desc):', content);
    console.log('Selected File Object:', selectedFile);

    if (!selectedFile) {
      setError('Please select an image to upload.');
      setSubmitting(false);
      return;
    }
    if (!userId) {
        setError("User ID is missing. Cannot create post.");
        setSubmitting(false);
        return;
    }
    if (!title || !content) {
        setError("Title and Content are required.");
        setSubmitting(false);
        return;
    }


    // --- Prepare FormData for backend ---
    const backendFormData = new FormData();
    backendFormData.append('userId', userId);
    backendFormData.append('desc', content); // Your backend Post model expects 'desc'
    backendFormData.append('postImages', selectedFile, selectedFile.name); // 'postImages' is the key your backend (multer) expects

    try {
      const response = await axios.post(`${API_BASE_URL}/api/posts`, backendFormData, {
        headers: {
          // 'Content-Type': 'multipart/form-data' is set by axios automatically
          // Add Authorization header if needed:
          // 'Authorization': `Bearer ${yourAuthToken}`
        }
      });

      console.log('Post created successfully on backend:', response.data);
      setSuccessMessage('Post created successfully!');
      setSelectedFile(null); // Clear the selected file
      // Optionally clear title and content fields if they are controlled components
      // or reset the form:
      formElement.reset(); // Resets native form fields

      // Optionally navigate away or trigger a feed refresh
      // navigate('/'); // Example: navigate to home after successful post
      // If you have an onPostCreated callback for feed refresh:
      // if (onPostCreated) onPostCreated(response.data);

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

  return (
    <div className="backdrop-blur-sm min-h-screen bg-gray-100 p-4 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden font-sans flex flex-col border border-white/30">
        <PostPageHeader title="Create New Post" onGoBack={handleGoBack} />
        <div className="p-4 sm:p-6 overflow-y-auto">
          {error && <p style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</p>}
          {successMessage && <p style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</p>}
          <PostForm
            onSubmit={handleSubmit}
            selectedFile={selectedFile}
            onFileChange={handleFileSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default PostPage;

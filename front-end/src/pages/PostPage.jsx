// src/pages/PostPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostPageHeader from '../components/PostPageHeader'; // Import Header
import PostForm from '../components/PostForm';          // Import Form

const PostPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null); // State remains here to be passed down

  const handleGoBack = () => {
    navigate(-1);
  };

  // Handler to update the selected file state when the child component triggers a change
  const handleFileSelected = (file) => {
    setSelectedFile(file); // Update state with file object (or null)
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(event.target); // Get text field data

    // Front-end: Log the data captured from the form and state
    console.log('Form submitted (front-end only)');
    console.log('Title:', formData.get('title'));
    console.log('Content:', formData.get('content'));
    console.log('Selected File Object:', selectedFile); // Log the file object from state

    // --- Backend-related logic removed ---
    // No API call or data preparation for backend here.

    // Optionally navigate away after submission (front-end action)
    // navigate('/');
    // alert('Post data logged to console. No backend submission configured.'); // Example feedback
  };

  return (
    // Responsive container
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">
      {/* Main content card */}
      <div className="w-full max-w-lg bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden font-sans flex flex-col border border-white/30">

        {/* 1. Top Navigation */}
        <PostPageHeader title="Create New Post" onGoBack={handleGoBack} />

        {/* Form Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <PostForm
            onSubmit={handleSubmit}
            selectedFile={selectedFile}
            onFileChange={handleFileSelected} // Pass the state updater function
          />
        </div>

      </div> {/* End Main Content Card */}
    </div> // End Responsive Container
  );
};

export default PostPage;

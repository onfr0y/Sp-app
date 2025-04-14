// src/pages/PostPage.jsx
import React, { useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom';

// Placeholder Icon Component (If needed for nav bar)
const IconPlaceholder = ({ name, className = '' }) => (
  <span className={`inline-block text-center text-xs font-mono px-1 border-none ${className}`}>
    {name}
  </span>
);

const PostPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file
  const [previewUrl, setPreviewUrl] = useState(null);   // State for the image preview URL

  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    // You can access the file via formData.get('photo') if needed for API submission
    console.log('Form submitted');
    console.log('Title:', formData.get('title'));
    console.log('Content:', formData.get('content'));
    console.log('File:', selectedFile); // Access the file from state

    // Add logic here to handle the post data (e.g., upload title, content, and file)

    // Optionally navigate away after submission
    // navigate('/');
  };

  return (
    // Responsive container - Simple light gray background
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-center">

      {/* Main content card with glassmorphism effect */}
      <div className="w-full max-w-lg bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden font-sans flex flex-col border border-white/30">

        {/* 1. Top Navigation */}
        <div className="flex justify-between items-center px-4 py-3 text-sm font-medium text-gray-800 border-b border-white/20 bg-white/20 backdrop-blur-sm sticky top-0 z-10 sm:px-6">
          <button onClick={handleGoBack} className="hover:text-black transition-colors">
            back
          </button>
          <span className="font-semibold">Create New Post</span>
          <div className="w-10 h-5"></div> {/* Spacer */}
        </div>

        {/* Form Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 block w-full px-3 py-2 rounded-md border border-white/40 bg-white/50 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-600/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Enter post title"
                required
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-800 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows="6" // Reduced rows slightly
                className="mt-1 block w-full px-3 py-2 rounded-md border border-white/40 bg-white/50 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-600/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Write your post content here..."
                required
              ></textarea>
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Photo (Optional)
              </label>
              <div className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-white/40 border-dashed rounded-md bg-white/30 backdrop-blur-sm">
                {/* Image Preview */}
                {previewUrl ? (
                  <div className="mb-4 relative group">
                    <img src={previewUrl} alt="Preview" className="max-h-40 rounded-md shadow-md" />
                    <button
                      type="button"
                      onClick={() => { setPreviewUrl(null); setSelectedFile(null); document.getElementById('photo-upload').value = null; }} // Clear preview, state and input value
                      className="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Remove image"
                    >
                     {/* Simple 'X' icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center mb-4">
                    {/* Placeholder Icon */}
                    <svg className="mx-auto h-12 w-12 text-gray-600/80" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                 {/* File Input Button - styled label */}
                <label htmlFor="photo-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 bg-white/60 px-3 py-1.5 text-sm transition duration-150 ease-in-out focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white/30 focus-within:ring-indigo-500">
                  <span>{selectedFile ? 'Change photo' : 'Upload a photo'}</span>
                  <input id="photo-upload" name="photo" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
                <p className="text-xs text-gray-700/90 mt-1">{selectedFile ? selectedFile.name : 'PNG, JPG, GIF up to 10MB'}</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600/80 backdrop-blur-sm border border-indigo-500/50 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white/30 transition duration-150 ease-in-out"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>

      </div> {/* End Main Content Card */}
    </div> // End Responsive Container
  );
};

export default PostPage;

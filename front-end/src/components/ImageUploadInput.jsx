// src/components/ImageUploadInput.jsx
import React, { useState, useEffect, useRef } from 'react';

const ImageUploadInput = ({ selectedFile, onFileChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null); // Ref to access the file input

  // Effect to update preview when selectedFile prop changes (Front-end preview)
  useEffect(() => {
    let reader; // Declare reader outside to potentially check state later if needed
    let isMounted = true; // Flag to prevent state update on unmounted component

    if (selectedFile) {
      reader = new FileReader(); // Browser API for reading files
      reader.onloadend = () => {
        // Only update state if the component is still mounted
        if (isMounted) {
          setPreviewUrl(reader.result); // Set local state for preview URL
        }
      };
      reader.readAsDataURL(selectedFile); // Generate a base64 data URL (front-end)
    } else {
      setPreviewUrl(null); // Clear preview if no file
    }

    // Cleanup function
    return () => {
      isMounted = false; // Set flag to false when component unmounts
      // Optional: Could add reader.abort() here if reading is in progress,
      // but onloadend should handle most cases. Data URLs don't need explicit revocation.
    };
  }, [selectedFile]); // Re-run effect if selectedFile changes

  // Handles the actual file input change event (Front-end event)
  const handleLocalFileChange = (event) => {
    const file = event.target.files[0];
    onFileChange(file || null); // Pass the file (or null) up to the parent component's state handler
  };

  // Handles removing the selected image (Front-end UI/State action)
  const handleRemoveImage = () => {
    onFileChange(null); // Tell parent component to clear its file state
    setPreviewUrl(null); // Clear local preview state
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset the actual file input element visually
    }
  };

  // JSX for rendering the component (Front-end UI)
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        Photo (Optional)
      </label>
      <div className="mt-1 flex flex-col items-center px-6 pt-5 pb-6 border-2 border-white/40 border-dashed rounded-md bg-white/30 backdrop-blur-sm">
        {/* Image Preview Area */}
        {previewUrl ? (
          <div className="mb-4 relative group">
            <img src={previewUrl} alt="Preview" className="max-h-40 rounded-md shadow-md" />
            <button
              type="button"
              onClick={handleRemoveImage}
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
        {/* File Input Trigger */}
        <label htmlFor="photo-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 bg-white/60 px-3 py-1.5 text-sm transition duration-150 ease-in-out focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white/30 focus-within:ring-indigo-500">
          <span>{selectedFile ? 'Change photo' : 'Upload a photo'}</span>
          {/* The actual file input, hidden */}
          <input
            id="photo-upload"
            name="photo" // Name might be used by parent for FormData, but it's a front-end attribute
            type="file"
            className="sr-only"
            onChange={handleLocalFileChange}
            accept="image/*" // Browser hint for file type
            ref={fileInputRef}
          />
        </label>
        <p className="text-xs text-gray-700/90 mt-1">{selectedFile ? selectedFile.name : 'PNG, JPG, GIF up to 10MB'}</p>
      </div>
    </div>
  );
};

export default ImageUploadInput;


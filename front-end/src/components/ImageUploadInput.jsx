// src/components/ImageUploadInput.jsx
import React, { useState, useEffect } from 'react';

// Simple icon for upload button
const UploadIcon = () => (
  <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
  </svg>
);


const ImageUploadInput = ({ selectedFile, onFileChange, disabled }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <div>
      <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Upload Photo
      </label>
      <div className="mt-2">
        <label
          htmlFor="imageUpload"
          className={`group relative flex justify-center items-center w-full px-4 py-3 border-2 border-dashed border-gray-300/80 dark:border-zinc-600/80 rounded-xl cursor-pointer bg-white/30 dark:bg-zinc-700/30 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors duration-200 ease-in-out
                      ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="space-y-1 text-center">
            <UploadIcon />
            <div className="flex text-sm text-gray-600 dark:text-gray-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
              <span className="font-medium">
                {selectedFile ? 'Change file' : 'Upload a file'}
              </span>
              <input
                id="imageUpload"
                name="postImages" // Ensure name matches what backend (Multer) expects
                type="file"
                accept="image/png, image/jpeg, image/gif, image/webp"
                onChange={onFileChange} // This should trigger handleFileSelected in PostPage
                className="sr-only" // Hide the default input, styling is on the label
                disabled={disabled}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              PNG, JPG, GIF, WEBP up to 10MB
            </p>
          </div>
        </label>
      </div>

      {previewUrl && selectedFile && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg shadow-inner">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview:</p>
          <img
            src={previewUrl}
            alt="Selected preview"
            className="max-h-60 w-auto rounded-md shadow-md object-contain mx-auto border border-gray-200 dark:border-zinc-700"
          />
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        </div>
      )}
      {!previewUrl && selectedFile && (
          <p className="mt-2 text-xs text-red-500 dark:text-red-400">Could not generate preview for {selectedFile.name}.</p>
      )}
    </div>
  );
};

export default ImageUploadInput;

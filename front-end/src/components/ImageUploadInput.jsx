// src/components/ImageUploadInput.jsx
import React, { useState, useEffect } from 'react';

const ImageUploadInput = ({ selectedFile, onFileChange, disabled }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Effect to create a preview URL when a file is selected
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return; // No file selected, clear preview
    }

    // Create an object URL for the selected file
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Cleanup function to revoke the object URL when the component unmounts
    // or when the selectedFile changes, to prevent memory leaks.
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]); // Re-run this effect if selectedFile changes

  return (
    <div>
      <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-800 mb-1">
        Upload Photo
      </label>
      <div className="mt-1 flex items-center space-x-4">
        {/* File Input */}
        <input
          type="file"
          id="imageUpload"
          name="imageUpload" // Optional name attribute
          accept="image/png, image/jpeg, image/gif" // Specify acceptable file types
          onChange={onFileChange} // This calls handleFileChange in PostForm
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        />
      </div>

      {/* Image Preview Section */}
      {previewUrl && selectedFile && (
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-1">Image Preview:</p>
          <img
            src={previewUrl}
            alt="Selected preview"
            className="max-h-60 w-auto rounded-md shadow-md object-contain" // Adjust styling as needed
          />
          <p className="mt-1 text-xs text-gray-500">
            Filename: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
          </p>
        </div>
      )}
      {!previewUrl && selectedFile && (
          // This case might happen if URL.createObjectURL fails or selectedFile is invalid
          <p className="mt-2 text-xs text-red-500">Could not generate preview for {selectedFile.name}.</p>
      )}
    </div>
  );
};

export default ImageUploadInput;

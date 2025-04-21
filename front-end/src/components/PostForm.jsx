// src/components/PostForm.jsx
import React from 'react';
import ImageUploadInput from './ImageUploadInput'; // Import the new component

const PostForm = ({ onSubmit, selectedFile, onFileChange }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title" // Name is used by parent's onSubmit to get data via FormData
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
          name="content" // Name is used by parent's onSubmit to get data via FormData
          rows="6"
          className="mt-1 block w-full px-3 py-2 rounded-md border border-white/40 bg-white/50 backdrop-blur-sm shadow-sm text-gray-900 placeholder-gray-600/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          placeholder="Write your post content here..."
          required
        ></textarea>
      </div>

      {/* Photo Upload Section - Using the ImageUploadInput component */}
      <ImageUploadInput
        selectedFile={selectedFile} // Pass down state from parent
        onFileChange={onFileChange} // Pass down handler from parent
      />

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit" // Triggers the onSubmit passed from the parent
          className="px-6 py-2 bg-indigo-600/80 backdrop-blur-sm border border-indigo-500/50 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white/30 transition duration-150 ease-in-out"
        >
          Create Post
        </button>
      </div>
    </form>
  );
};

export default PostForm;

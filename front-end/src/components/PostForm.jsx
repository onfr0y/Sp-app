// src/components/PostForm.jsx
import React from 'react';
import ImageUploadInput from './ImageUploadInput'; // We'll use the user-provided one

// This component is now simpler, mainly for laying out the form fields.
// State for title (optional) and content is managed here.
// Submission logic is handled by the parent (PostPage.jsx).
function PostForm({
  onSubmit,      // Function from PostPage to handle the actual submission
  selectedFile,  // File object from PostPage's state
  onFileChange,  // Function from PostPage to update selectedFile state
  isSubmitting,  // Boolean from PostPage to disable form during submission
  initialContent = '', // Optional: for editing in the future
  initialTitle = ''    // Optional
}) {
  const [title, setTitle] = React.useState(initialTitle);
  const [content, setContent] = React.useState(initialContent);

  const handleInternalSubmit = (event) => {
    event.preventDefault();
    // The parent's onSubmit will extract values from event.target
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <form onSubmit={handleInternalSubmit} className="space-y-6">
      {/* Optional Title Field - Kept for potential future use */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title (Optional)
        </label>
        <input
          type="text"
          id="title"
          name="title" // Name attribute is important for FormData
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          className="mt-1 block w-full px-4 py-2.5 rounded-xl border border-gray-300/50 dark:border-zinc-600/50 bg-white/60 dark:bg-zinc-700/60 backdrop-blur-sm shadow-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm transition-colors duration-150"
          placeholder="Enter a catchy title"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Caption / Description
        </label>
        <textarea
          id="content"
          name="content" // Name attribute is important for FormData
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          required
          className="mt-1 block w-full px-4 py-2.5 rounded-xl border border-gray-300/50 dark:border-zinc-600/50 bg-white/60 dark:bg-zinc-700/60 backdrop-blur-sm shadow-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm transition-colors duration-150"
          placeholder="What's on your mind?"
        />
      </div>

       <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
         Style
        </label>
        <textarea
          id="content"
          name="content" // Name attribute is important for FormData
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          required
          className="mt-1 block w-full px-4 py-2.5 rounded-xl border border-gray-300/50 dark:border-zinc-600/50 bg-white/60 dark:bg-zinc-700/60 backdrop-blur-sm shadow-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 text-sm transition-colors duration-150"
          placeholder="What's on your mind?"
        />
      </div>

      {/* Using the ImageUploadInput provided by the user */}
      <ImageUploadInput
        selectedFile={selectedFile}
        onFileChange={onFileChange}
        disabled={isSubmitting}
      />

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !selectedFile}
          className={`px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-white/50 dark:focus:ring-offset-zinc-800/50 transition-all duration-150 ease-in-out text-sm
                      ${(isSubmitting || !selectedFile) ? 'opacity-60 cursor-not-allowed' : 'opacity-100 transform hover:scale-105 active:scale-95'}`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          ) : (
            'Create Post'
          )}
        </button>
      </div>
    </form>
  );
}
export default PostForm;

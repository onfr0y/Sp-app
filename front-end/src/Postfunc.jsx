import React, { useState, useEffect } from 'react';
import PostResult from './postresultbox';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Use useEffect to handle side effects
  useEffect(() => {
    // You could load saved posts from localStorage here
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (imagePreview) {
      const post = {
        id: Date.now(),
        caption: caption,
        image: imagePreview,
        timestamp: new Date().toLocaleString()
      };
      
      setPosts([post, ...posts]);
      setCaption('');
      setImagePreview(null);
      setImageFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Create a Photo Post</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-4">
          <label htmlFor="image-upload" className="block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition w-max">
            {imagePreview ? 'Change Image' : 'Select Image'}
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        
        {imagePreview && (
          <div className="mb-4">
            <img src={imagePreview} alt="Preview" className="max-h-96 rounded-lg mb-2" />
            <button 
              type="button" 
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
                const fileInput = document.getElementById('image-upload');
                if (fileInput) fileInput.value = '';
              }}
            >
              Remove
            </button>
          </div>
        )}
        
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption..."
          className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
          rows="2"
        />
        
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition"
          disabled={!imagePreview}
        >
          Post Photo
        </button>
      </form>

      {/* show the foto kub */}
      <PostResult posts={posts} />
      
    </div>
  );
}

// Export only the component, we can't export hooks outside components
export default Posts;
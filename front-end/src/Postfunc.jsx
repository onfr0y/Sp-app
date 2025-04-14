import React, { useState } from 'react';
import { uploadImage } from './imageapi';

function Postfunc({ onPostSuccess }) {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await uploadImage(image);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload image');
      }
      
      console.log('Upload successful:', result.data);
      
      // Reset form
      setImage(null);
      setPreviewUrl(null);
      
      // Call the callback function if it exists
      if (onPostSuccess) {
        onPostSuccess();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="post-form">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="image">Choose Image</label>
          <input 
            type="file" 
            id="image" 
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        
        {previewUrl && (
          <div className="image-preview">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}
        
        <button 
          type="submit" 
          className="submit-button" 
          disabled={isLoading || !image}
        >
          {isLoading ? 'Uploading...' : 'Post Image'}
        </button>
      </form>
    </div>
  );
}

export default Postfunc;

import React, { useState, useEffect } from 'react';
import { getImages } from './imageapi';

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      console.log("Fetching images...");
      const result = await getImages();
      console.log("Result:", result);
      
      if (result.success) {
        setImages(result.data);
        console.log("Images after setting:", result.data);
      } else {
        setError(result.error || 'Failed to fetch images');
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-40 text-gray-500">Loading images...</div>;
  if (error) return <div className="bg-red-100 p-4 rounded text-red-700 my-4">Error: {error}</div>;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(images) ? images.map((image) => (
          <div key={image.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <img src={image.imageUrl} alt="Stored content" className="w-full h-56 object-cover" />
          </div>
        )) : <div className="col-span-full text-center py-8 text-gray-500">No images to display</div>}
      </div>
    </div>
  );
}

export default ImageGallery; 
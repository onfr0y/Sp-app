import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

function Photobuble() {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate('/PhotoPage');
  };

  return (
    <section className="p-5">
      <div className="grid grid-cols-2 gap-4">
        
        {/* Image Card 1 */}
        <div 
          className="relative rounded-xl overflow-hidden shadow-md cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src="https://i.pinimg.com/736x/65/29/a0/6529a0cb924a5ed92a8ab6162f6b93dd.jpg"
            alt="shoe"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-white/70 text-gray-700 rounded-full px-2 py-1 text-xs">
            250
          </div>
        </div>

        {/* Image Card 2 */}
        <div 
          className="relative rounded-xl overflow-hidden shadow-md cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src="https://i.pinimg.com/736x/20/0c/3a/200c3ad369ae9c243d74f31619ee5198.jpg"
            alt="shoe"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-white/70 text-gray-700 rounded-full px-2 py-1 text-xs">
            190
          </div>
        </div>

        {/* Image Card 3 */}
        <div 
          className="relative rounded-xl overflow-hidden shadow-md cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src="https://i.pinimg.com/736x/9b/79/14/9b79145c91e0d0af4fe1aa8c5640a719.jpg"
            alt="shoe"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-white/70 text-gray-700 rounded-full px-2 py-1 text-xs">
            190
          </div>
        </div>

        {/* Image Card 4 */}
        <div 
          className="relative rounded-xl overflow-hidden shadow-md cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src="https://i.pinimg.com/736x/d4/5e/22/d45e22cda63faac4ef442092bc8e84ea.jpg"
            alt="shoe"
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-white/70 text-gray-700 rounded-full px-2 py-1 text-xs">
            190
          </div>
        </div>

      </div>
    </section>
  );
}

export default Photobuble;

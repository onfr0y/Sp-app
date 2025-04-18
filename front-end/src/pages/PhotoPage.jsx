import React from 'react';

// --- Icon Components (Placeholders) ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;


// --- Main Photo Page Component ---
const PhotoPage = () => {

  // --- Dummy Data (URLs removed from here too, structure kept) ---
  const featuredImage = {
    // url: '', // Removed placeholder URL
    title: 'VEDAS PERCEPTION OF THE ABSTRACT ART.'
  };

  const galleryImages = [
    { id: 1 /*, url: '' */ }, // Removed placeholder URL
    { id: 2 /*, url: '' */ },
    { id: 3 /*, url: '' */ },
    { id: 4 /*, url: '' */ },
    { id: 5 /*, url: '' */ },
    { id: 6 /*, url: '' */ },
  ];

  // --- Event Handlers (Placeholders) ---
  const handleMenuClick = () => console.log('Menu clicked');
  const handleCollectionClick = (type) => console.log(`${type} clicked`);
  const handleImageClick = (idOrUrl = 'featured') => console.log(`Image clicked: ${idOrUrl}`);


  // --- Render ---
  return (
    // Main container: Light background, full height
    <div className="bg-white min-h-screen text-black font-sans">
      {/* Optional: Add max-width and margin-auto for large screens */}
      <div className="max-w-7xl mx-auto">

        {/* --- Header --- */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <button onClick={handleMenuClick} aria-label="Open menu">
            <MenuIcon />
          </button>
          <nav className="flex items-center space-x-4 md:space-x-6">
            {/* Using buttons for potential interactivity */}
            <button
              onClick={() => handleCollectionClick('New Collection')}
              className="uppercase font-bold text-sm md:text-base tracking-wider text-black" // Active style
            >
              New Collection
            </button>
            <button
              onClick={() => handleCollectionClick('Popular')}
              className="uppercase font-medium text-sm md:text-base tracking-wider text-gray-400 hover:text-gray-600" // Inactive style
            >
              Popular
            </button>
          </nav>
        </header>

        {/* --- Main Content Area --- */}
        <main className="p-4 md:p-6">

          {/* --- Featured Section --- */}
          <section className="mb-8 md:mb-12">
            <div
              className="relative overflow-hidden rounded-lg mb-4 cursor-pointer group bg-gray-200" // Added background color for placeholder
              onClick={() => handleImageClick()} // Pass no specific URL/ID if src is empty
            >
              <img
                src="" // Removed placeholder URL
                alt={featuredImage.title}
                className="w-full h-auto object-cover aspect-[3/4] md:aspect-video lg:aspect-[16/9] group-hover:opacity-90 transition-opacity" // Adjust aspect ratio for responsiveness
              />
              {/* Optional: Add overlay or icon on hover */}
            </div>
            <h2 className="uppercase font-bold text-lg md:text-xl lg:text-2xl text-center tracking-wide leading-tight">
              {featuredImage.title}
            </h2>
          </section>

          {/* --- Image Gallery Grid --- */}
          <section>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-200" // Added background color for placeholder
                  onClick={() => handleImageClick(image.id)}
                >
                  <img
                    src="" // Removed placeholder URL
                    alt={`Gallery image ${image.id}`}
                    className="w-full h-full object-cover aspect-square group-hover:opacity-90 transition-opacity" // Square aspect ratio for grid items
                  />
                   {/* Optional: Add overlay or icon on hover */}
                </div>
              ))}
            </div>
          </section>

        </main>

      </div> {/* End max-width container */}
    </div> // End main container
  );
};

export default PhotoPage;

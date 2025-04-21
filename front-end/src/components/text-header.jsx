// src/components/TextHeader.jsx
import React from 'react';
import AnimateInView from './AnimateInView'; // Import the animation component (adjust path if needed)
// Removed: import './index.css'; // Assuming Tailwind handles styles

function TextHeader() {
  // Define the common styles for the headings based on your original code
  // Note: Original code had 'text-3xl' inside, but outer div had responsive sizes.
  // Applying responsive sizes here for consistency with that intention.
  const headingClasses = "text-2xl md:text-4xl lg:text-6xl font-mono font-bold";

  return (
    // Outer div for positioning (margins) - kept from original
    // We don't need responsive text size here if applied to each h1 below
    <div className='ml-10 mt-10'>

      {/* Wrap each original H1 with AnimateInView */}

      {/* First line: "Explore" */}
      <AnimateInView
        tag="h1" // Use h1 tag
        // Apply original font/bold styles + responsive size + bottom margin
        className={`${headingClasses} mb-4`}
        // Optional: Customize animation for this line
        // rootMargin="-50px" // Trigger slightly earlier/later
        // config={{ tension: 200, friction: 30 }}
      >
        Explore
      </AnimateInView>

      {/* Second line: "Your" */}
      <AnimateInView
        tag="h1"
        // Apply original font/bold styles + responsive size + bottom margin
        className={`${headingClasses} mb-4`}
        // Optional: Customize animation for this line
        // rootMargin="-75px" // Trigger slightly later
        // config={{ tension: 200, friction: 30 }}
      >
        Your
      </AnimateInView>

      {/* Third line: "Style..." */}
      <AnimateInView
        tag="h1"
        // Apply original font/bold styles + responsive size (NO bottom margin)
        className={headingClasses}
        // Optional: Customize animation for this line
        // rootMargin="-100px" // Trigger even later
        // config={{ tension: 200, friction: 30 }}
      >
        Style...
      </AnimateInView>

    </div>
  );
}

export default TextHeader;

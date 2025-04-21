import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';

// --- Photobuble Component ---
function Photobuble({ data = [] }) {
  // --- State and Effects for Responsive Columns ---
  const [columns, setColumns] = useState(2); // Start with 2 columns for mobile

  useEffect(() => {
    const updateColumns = () => {
      // Using common Tailwind-like breakpoints
      if (window.matchMedia('(min-width: 1280px)').matches) { // xl and up
        setColumns(5);
      } else if (window.matchMedia('(min-width: 1024px)').matches) { // lg
        setColumns(4);
      } else if (window.matchMedia('(min-width: 768px)').matches) { // md
        setColumns(3);
      } else { // sm and mobile
        setColumns(2); // Default to 2 columns on smaller screens
      }
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // --- State and Effects for Container Width ---
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
        if (ref.current) {
            setWidth(ref.current.offsetWidth);
        }
    }, 100); // Debounce resize handling slightly

    if (ref.current) {
        setWidth(ref.current.offsetWidth); // Initial width
    }
    window.addEventListener('resize', debouncedHandleResize);
    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, []);

  // --- Masonry Calculation Logic ---
  // This part calculates positions based on container width, columns, and item heights
  const [heights, gridItems] = useMemo(() => {
    let columnHeights = new Array(columns).fill(0); // Tracks the height of each column
    let items = data.map((child) => {
      const column = columnHeights.indexOf(Math.min(...columnHeights)); // Find the shortest column
      const itemWidth = width / columns; // Calculate width based on container and columns
      // --- Use the height directly from data ---
      // ASSUMPTION: child.height is the intended display height for the masonry layout.
      const itemHeight = child.height;
      // --- Calculate positions ---
      const x = itemWidth * column; // Horizontal position based on column index
      // Vertical position is the current height of the shortest column
      const y = columnHeights[column];
      // --- Update the height of the column this item was added to ---
      columnHeights[column] += itemHeight; // Add item's height to the column height tracker

      return { ...child, x, y, width: itemWidth, height: itemHeight };
    });
    return [columnHeights, items]; // Return updated column heights and positioned items
  }, [columns, data, width]); // Recalculate when these change

  // --- Animation Logic ---
  const transitions = useTransition(gridItems, {
    keys: (item) => item.id, // Unique key for animation tracking
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }), // Handles resize/column changes
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25, // Stagger the animation slightly
  });

  // --- Render ---
  return (
    // Section container: Takes full width available from parent.
    // Padding 'p-5' removed from here; let parent control outer spacing.
    // Added min-height for initial rendering or empty data.
    <section
      ref={ref} // Attach ref to measure width
      className="relative w-full h-full min-h-[200px]" // Ensure it takes space
      // Set height dynamically based on the tallest calculated column
      style={{ height: heights.length > 0 ? Math.max(...heights) : 'auto' }}
    >
      {transitions((style, item) => (
        <a.div
          key={item.id}
          style={style} // Apply animated styles (position, size, opacity)
          // Reduced padding for tighter item spacing: p-1 (4px) or p-1.5 (6px)
          className="absolute p-1.5 [will-change:transform,width,height,opacity]"
          // onClick={() => handleItemClick(item.id)} // Add click handler if needed
        >
          {/* Inner div for styling and background image */}
          <div
            className="relative w-full h-full overflow-hidden rounded-lg shadow-md cursor-pointer bg-gray-200" // Adjusted rounding, kept shadow/cursor
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover', // Cover the area without distortion
              backgroundPosition: 'center',
            }}
          />
        </a.div>
      ))}
    </section>
  );
}

export default Photobuble;

// Simple debounce function helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

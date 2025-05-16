// src/components/photobuble.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';

// Simple debounce function helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function Photobuble({ data = [], onItemClick }) { // Added onItemClick prop
  // console.log("Photobuble received data:", data);

  const [columns, setColumns] = useState(2);
  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia('(min-width: 1280px)').matches) setColumns(5);
      else if (window.matchMedia('(min-width: 1024px)').matches) setColumns(4);
      else if (window.matchMedia('(min-width: 768px)').matches) setColumns(3);
      else setColumns(2);
    };
    updateColumns();
    const debouncedUpdateColumns = debounce(updateColumns, 150);
    window.addEventListener('resize', debouncedUpdateColumns);
    return () => window.removeEventListener('resize', debouncedUpdateColumns);
  }, []);

  const ref = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const measureContainer = () => {
      if (ref.current) {
        // console.log("Photobuble: Measuring container, new width:", ref.current.offsetWidth);
        setContainerWidth(ref.current.offsetWidth);
      }
    };

    measureContainer(); // Initial measurement
    const debouncedMeasureContainer = debounce(measureContainer, 150);
    window.addEventListener('resize', debouncedMeasureContainer);

    // Fallback measurement if initial offsetWidth is 0
    let fallbackTimeout;
    if (ref.current && ref.current.offsetWidth === 0) {
        fallbackTimeout = setTimeout(() => {
            if (ref.current && ref.current.offsetWidth !== 0) {
                // console.log("Photobuble: Fallback measurement, width:", ref.current.offsetWidth);
                setContainerWidth(ref.current.offsetWidth);
            } else if (ref.current) {
                // console.warn("Photobuble: Fallback measurement failed, ref.current.offsetWidth is still 0.");
            }
        }, 200); // Wait a bit longer for layout to settle
    }


    return () => {
      window.removeEventListener('resize', debouncedMeasureContainer);
      clearTimeout(fallbackTimeout);
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const [heights, gridItems] = useMemo(() => {
    // console.log("Photobuble useMemo: Calculating gridItems. Data length:", data.length, "containerWidth:", containerWidth, "columns:", columns);
    if (containerWidth === 0 || data.length === 0 || columns === 0) {
      // console.log("Photobuble useMemo: Bailing early - zero width, no data, or zero columns.");
      return [[], []];
    }

    let columnHeights = new Array(columns).fill(0);
    let items = data.map((childPostData, index) => { // childPostData is the full post object
      // Basic validation for essential fields
      if (!childPostData || typeof childPostData.id === 'undefined' || typeof childPostData.image !== 'string' || typeof childPostData.height !== 'number') {
        console.warn(`Photobuble useMemo: Item at index ${index} is invalid or missing required fields (id, image, height):`, childPostData);
        return null; // Skip invalid items
      }

      const column = columnHeights.indexOf(Math.min(...columnHeights));
      // Ensure itemWidth is not zero to prevent division by zero or layout issues
      const itemWidth = (containerWidth > 0 && columns > 0) ? containerWidth / columns : 200; // Fallback width

      const itemHeight = childPostData.height || 200; // Use child.height or a fallback

      const x = itemWidth * column;
      const y = columnHeights[column];
      columnHeights[column] += itemHeight;
      return {
        ...childPostData, // Spread the whole post object to be available in 'item'
        x,
        y,
        width: itemWidth,
        height: itemHeight,
        displayUrl: childPostData.image // Keep using 'image' as it's mapped by HomePage
      };
    }).filter(item => item !== null); // Filter out any null items from invalid data

    // console.log("Photobuble useMemo: Calculated gridItems count:", items.length, "Column heights:", columnHeights);
    return [columnHeights, items];
  }, [columns, data, containerWidth]);

  const transitions = useTransition(gridItems, {
    keys: (item) => item.id, // item.id should be unique post ID
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  if (containerWidth === 0 && data.length > 0) {
    // console.log("Photobuble: Container width is 0, data is present. Rendering placeholder or waiting for width.");
    // Optionally render a loading state or minimal placeholder until width is measured
  }

  return (
    <section
      ref={ref}
      className="relative w-full h-full min-h-[200px]" // Ensure min-height for initial render
      style={{ height: heights && heights.length > 0 ? Math.max(0, ...heights) : 'auto' }}
    >
      {transitions((style, item) => { // 'item' here is the full post object
        if (!item || !item.id) return null; // Basic check
        return (
            <a.div
              key={item.id} // Use the unique post ID
              style={style}
              className="absolute p-1 sm:p-1.5 [will-change:transform,width,height,opacity] cursor-pointer group"
              onClick={() => onItemClick && onItemClick(item)} // MODIFIED: Call onItemClick with the full item (post data)
            >
              <div
                className="relative w-full h-full overflow-hidden rounded-lg shadow-md bg-gray-200 dark:bg-zinc-700 group-hover:shadow-xl transition-shadow duration-200"
                style={{
                  backgroundImage: `url(${item.displayUrl || 'https://placehold.co/300x400/e2e8f0/94a3b8?text=Loading...'})`, // Fallback placeholder
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* You could add a subtle hover overlay here if desired */}
              {/* <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div> */}
            </a.div>
        );
    })}
    </section>
  );
}

export default Photobuble;

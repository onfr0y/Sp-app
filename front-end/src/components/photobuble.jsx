// src/components/photobuble.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';

// Simple debounce function helper (keep this as is)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => { clearTimeout(timeout); func(...args); };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function Photobuble({ data = [] }) { // data will be fetched by parent and passed here
  console.log("Photobuble received data:", data); // Log received data

  const [columns, setColumns] = useState(2);
  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia('(min-width: 1280px)').matches) setColumns(5);
      else if (window.matchMedia('(min-width: 1024px)').matches) setColumns(4);
      else if (window.matchMedia('(min-width: 768px)').matches) setColumns(3);
      else setColumns(2);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const ref = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      if (ref.current) {
        console.log("Photobuble: Resizing, new containerWidth:", ref.current.offsetWidth);
        setContainerWidth(ref.current.offsetWidth);
      }
    }, 100);

    if (ref.current) {
      console.log("Photobuble: Initial containerWidth:", ref.current.offsetWidth);
      setContainerWidth(ref.current.offsetWidth);
    } else {
        const initialMeasurementTimeout = setTimeout(() => {
            if (ref.current) {
                console.log("Photobuble: Delayed initial containerWidth:", ref.current.offsetWidth);
                setContainerWidth(ref.current.offsetWidth);
            } else {
                console.warn("Photobuble: ref.current is still null after delay for width measurement.");
            }
        }, 50); // Increased delay slightly for safety
        return () => clearTimeout(initialMeasurementTimeout);
    }
    window.addEventListener('resize', debouncedHandleResize);
    return () => window.removeEventListener('resize', debouncedHandleResize);
  }, []);

  const [heights, gridItems] = useMemo(() => {
    console.log("Photobuble useMemo: Calculating gridItems. Data length:", data.length, "containerWidth:", containerWidth, "columns:", columns);
    if (containerWidth === 0 || data.length === 0 || columns === 0) {
      console.log("Photobuble useMemo: Bailing early due to zero width, no data, or zero columns.");
      return [[], []];
    }

    let columnHeights = new Array(columns).fill(0);
    let items = data.map((child, index) => {
      if (!child || typeof child.id === 'undefined' || typeof child.image === 'undefined') {
        console.warn(`Photobuble useMemo: Item at index ${index} is invalid (missing id or image):`, child);
        return null; // Skip invalid items
      }

      const column = columnHeights.indexOf(Math.min(...columnHeights));
      const itemWidth = containerWidth / columns;

      // --- SIMPLIFIED: Use child.height directly as provided by backend ---
      const itemHeight = child.height || 200; // Use child.height or a fallback if it's missing/zero
      // console.log(`Photobuble useMemo - item ${index} ('${child.id}'): itemWidth=${itemWidth}, itemHeight=${itemHeight}`);


      const x = itemWidth * column;
      const y = columnHeights[column];
      columnHeights[column] += itemHeight;
      return {
        ...child,
        x,
        y,
        width: itemWidth,
        height: itemHeight,
        displayUrl: child.image
      };
    }).filter(item => item !== null); // Filter out any null items from invalid data

    console.log("Photobuble useMemo: Calculated gridItems count:", items.length, "Column heights:", columnHeights);
    return [columnHeights, items];
  }, [columns, data, containerWidth]);

  const transitions = useTransition(gridItems, {
    keys: (item) => item.id,
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  // Enhanced check for rendering
  if (containerWidth === 0 && data.length > 0) {
    console.log("Photobuble: Container width is 0, likely waiting for measurement. Data is present.");
    // You might want to render a minimal placeholder or nothing until width is measured
    // to avoid a flash of unstyled content or errors if gridItems calculation depends heavily on width.
  }


  return (
    <section
      ref={ref}
      className="relative w-full h-full min-h-[200px]" // Ensure min-height
      style={{ height: heights && heights.length > 0 ? Math.max(0, ...heights) : 'auto' }}
    >
      {transitions((style, item) => {
        // Defensive check for item, though useTransition should handle empty gridItems
        if (!item) return null;
        return (
            <a.div
              key={item.id}
              style={style}
              className="absolute p-1 sm:p-1.5 [will-change:transform,width,height,opacity]"
            >
              <div
                className="relative w-full h-full overflow-hidden rounded-lg shadow-md cursor-pointer bg-gray-200"
                style={{
                  backgroundImage: `url(${item.displayUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </a.div>
        );
    })}
    </section>
  );
}

export default Photobuble;

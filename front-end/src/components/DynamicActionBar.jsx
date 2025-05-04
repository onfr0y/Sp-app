import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the breakpoint (Tailwind's md breakpoint)
const MOBILE_BREAKPOINT = 768;

// Define base heights/offsets for consistency
const MOBILE_BOTTOM_OFFSET = '1rem'; // bottom-4
const DESKTOP_BOTTOM_OFFSET = '3.5rem'; // bottom-14
const ACTION_BAR_MOBILE_HEIGHT = '3.5rem'; // h-14 approx
const ACTION_BAR_DESKTOP_HEIGHT = '3rem'; // h-12

export default function DynamicActionBar() {
  const containerRef = useRef(null);
  const detailsRef = useRef([]);
  const itemsRef = useRef([]);
  const actionBarRef = useRef(null);
  const navigate = useNavigate();

  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  const duration = 0.75;
  const duration2 = 0.3;

  // --- Screen Resize Detection ---
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      // Collapse if switching between mobile/desktop while expanded
      if (mobile !== isMobile && expandedIndex !== -1) {
          collapseDetails();
      }
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, expandedIndex]); // Add dependencies

  // --- Helpers ---
  const getResponsiveValue = (mobileValue, desktopValue) => {
    return isMobile ? mobileValue : desktopValue;
  };

  // --- Handlers ---
  const handleItemClick = (index) => {
      // Prevent expansion for non-configured items (like 'Post')
      if (index === 1) {
          handlePostClick();
          return;
      }
      // Add checks for other non-expandable items if any

    if (expandedIndex === index) {
      collapseDetails();
      return;
    }
    // Collapse previous if open
    if (expandedIndex !== -1) {
        collapseDetails(false); // Don't reset index yet
    }
    setExpandedIndex(index);
    expandItem(index);
  };

  // --- Animation Logic ---
  const expandItem = (index) => {
    if (!containerRef.current) return;

    // Target height calculation - needs content adjustment
    const targetHeight = () => {
      const baseActionHeight = getResponsiveValue(
          parseFloat(ACTION_BAR_MOBILE_HEIGHT) * 16, // Convert rem to px
          parseFloat(ACTION_BAR_DESKTOP_HEIGHT) * 16
      );
      switch (index) {
        // These heights are relative to the base, plus content space
        // Adjust these based on your content for each section
        case 0: return baseActionHeight + 222; // Original content height + base
        case 2: return baseActionHeight + 136; // Original content height + base
        default: return baseActionHeight; // Default to base height
      }
    };

    // Update the container: Height grows, lifts slightly on desktop
    containerRef.current.style.height = `${targetHeight()}px`;
    containerRef.current.style.transform = `translateY(${getResponsiveValue(0, -17)}px)`;
    containerRef.current.style.borderRadius = '24px';

    // Show the correct details
    detailsRef.current.forEach((detail, idx) => {
      if (!detail) return;
      detail.style.opacity = index === idx ? '1' : '0';
      detail.style.zIndex = index === idx ? '2' : '1';
    });
  };

  const collapseDetails = (resetIdx = true) => {
    if (!containerRef.current) return;

    if (resetIdx) {
      setExpandedIndex(-1);
    }

    // Return to base height for the current screen size
    containerRef.current.style.height = getResponsiveValue(ACTION_BAR_MOBILE_HEIGHT, ACTION_BAR_DESKTOP_HEIGHT);
    containerRef.current.style.transform = 'translateY(0)';
    containerRef.current.style.borderRadius = `${getResponsiveValue(16, 16)}px`;

    // Hide all details
    detailsRef.current.forEach((detail) => {
      if (!detail) return;
      detail.style.opacity = '0';
      detail.style.zIndex = '1';
    });
  };

  const handlePostClick = () => {
    if (expandedIndex !== -1) {
      collapseDetails();
    }
    navigate('/post');
  };

  const handleLoginRegClick = () => {
    if (expandedIndex !== -1) {
      collapseDetails();
    }
    navigate('/login');
  };

  // --- Parent Padding Reminder ---
  // <main className="pb-28"> ... page content ... </main>

  return (
    <>
      {/* Expanding Container (Fixed Position with MX) */}
      <div
        ref={containerRef}
        // Added mx-4 for mobile horizontal margin, md:mx-0 resets it for desktop centering
        className={`
          fixed overflow-hidden
          z-40                                      bg-black/5 dark:bg-white/10 backdrop-blur-xl rounded-2xl
          left-0 right-0 mx-4 h-14              mx-22    md:mx-0 md:left-1/2 md:right-auto md:h-12 md:w-[410px] md:-translate-x-1/2
          transition-[height] duration-100         `
        }
         style={{
            bottom: getResponsiveValue(MOBILE_BOTTOM_OFFSET, DESKTOP_BOTTOM_OFFSET),
         }}
      >
        {/* Details Content Area */}
        {[0, 2].map(index => (
          <div
            key={index}
            ref={(el) => (detailsRef.current[index] = el)}
            className="
              absolute left-0 right-0 top-0
              p-4 opacity-0 details overflow-y-auto
            "
            style={{
                bottom: getResponsiveValue(ACTION_BAR_MOBILE_HEIGHT, ACTION_BAR_DESKTOP_HEIGHT)
             }}
          >
            {/* --- Details Content --- */}
             {index === 0 && (
                 <>
                   <div onClick={handleLoginRegClick} className="w-[95%] flex items-center gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl py-3 px-3 duration-300">
              
                     <div className="w-full flex flex-col items-start"><p className="font-bold">Login</p><p className="opacity-80">Make your dream reach</p></div>

                   </div>
                   <div onClick={handleLoginRegClick} className="w-[95%] flex items-center gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl py-3 px-3 duration-300">
             
                     <div className="w-full flex flex-col items-start"><p className="font-bold">Register</p><p className="opacity-80">Communication App</p></div>
                    </div>
                   <div className="h-[1px] w-[95%] bg-black/10 dark:bg-white/10 mt-4 mx-auto"></div>
                 </>
             )}
             {index === 2 && (
                 <>
                    <div className="w-full group">
                      <div className="flex items-center justify-between w-full gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl py-2 px-3 duration-300 mx-auto">
                        <div className="flex items-center gap-3">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/></svg>
                           <span className="font-bold">Your profile</span>
                        </div>
                        <span>Jun, 24</span>
                      </div>
                    </div>
                   
                   <div className="h-[1px] w-[95%] bg-black/10 dark:bg-white/10 mt-4 mx-auto"></div>
                 </>
             )}
            {/* --- End Details Content --- */}
          </div>
        ))}
      </div>

      {/* Action Bar (Fixed Position with MX) */}
      <div
        ref={actionBarRef}
        
        className="
          fixed flex items-center justify-center rounded-full
          z-50                                    border border-gray-200/50 dark:border-gray-700/50 rounded-2xl bg-neutral-100/80 mx-20  backdrop-blur-md
          left-0 right-0 mx-4 p-1                 md:mx-0 md:p-0 md:gap-2 md:left-1/2 md:right-auto md:w-[410px] md:-translate-x-1/2
        "
         style={{ bottom: getResponsiveValue(MOBILE_BOTTOM_OFFSET, DESKTOP_BOTTOM_OFFSET) }}
      >
        {/* Item 0 - Apps */}
        <button
          ref={(el) => (itemsRef.current[0] = el)}
          onClick={() => handleItemClick(0)}
          className={`flex items-center justify-center gap-2 duration-300 transition-colors py-3 px-4 rounded-xl md:rounded-2xl hover:bg-zinc-950/10 dark:hover:bg-zinc-700/20 ${expandedIndex === 0 ? 'bg-zinc-950/10 dark:bg-zinc-700/20' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>
          <span className="font-bold hidden md:inline">Apps</span>
        </button>

        {/* Item 1 - Post */}
        <button
          ref={(el) => (itemsRef.current[1] = el)}
          onClick={handlePostClick}
          className="flex items-center justify-center gap-2 duration-300 transition-colors py-3 px-4 rounded-xl md:rounded-2xl hover:bg-zinc-950/10 dark:hover:bg-zinc-700/20"
        >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
         <span className="font-bold hidden md:inline">Post</span>
        </button>

        {/* Item 2 - Share */}
        <button
          ref={(el) => (itemsRef.current[2] = el)}
          onClick={() => handleItemClick(2)}
          className={`flex items-center justify-center gap-2 duration-300 transition-colors py-3 px-4 rounded-xl md:rounded-2xl hover:bg-zinc-950/10 dark:hover:bg-zinc-700/20 ${expandedIndex === 2 ? 'bg-zinc-950/10 dark:bg-zinc-700/20' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>
          <span className="font-bold hidden md:inline">USER</span>
        </button>
      </div>
    </>
  );
}
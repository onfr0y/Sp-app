// src/components/DetailedPostModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSpring, animated, config } from '@react-spring/web';

// --- Icon Components (Adjust colors for light theme) ---
const BackArrowIcon = () => <svg className="w-6 h-6 text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
const HeartIcon = ({ filled, small = false }) => (
  <svg className={`transition-colors duration-200 ${small ? 'w-5 h-5' : 'w-7 h-7'} ${filled ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'}`} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);
const ShareIcon = () => <svg className="w-7 h-7 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4m0 0l-4 4m4-4v12" /></svg>;
// --- End Icon Components ---

function DetailedPostModal({ post, onClose, author, currentUser, relatedPosts = [], onRelatedPostClick }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPostData, setCurrentPostData] = useState(post);
  const [currentAuthorData, setCurrentAuthorData] = useState(author);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    setCurrentPostData(post);
    setCurrentAuthorData(author);
  }, [post, author]);

  useEffect(() => {
    if (currentPostData) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [currentPostData]);

  useEffect(() => {
    if (currentPostData && currentUser && currentPostData.likes && currentPostData.likes.includes(currentUser?._id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [currentPostData, currentUser]);

  const modalAnimation = useSpring({
    opacity: showModal ? 1 : 0,
    transform: showModal ? 'scale(1)' : 'scale(0.95)',
    config: config.gentle, // A slightly softer spring configuration
  });
  
  const contentAnimation = useSpring({
    opacity: showModal ? 1 : 0,
    transform: showModal ? 'translateY(0px)' : 'translateY(15px)', // Reduced translateY for a quicker feel
    delay: showModal ? 100 : 0, // Reduced delay
    config: { ...config.stiff, tension: 220, friction: 22 }, // Custom stiff config
  });

   if (!currentPostData && !showModal && modalAnimation.opacity.get() === 0) return null;

  let mainImageUrl = 'https://placehold.co/600x800/E2E8F0/4A5568?text=Loading...';
  if (currentPostData?.img && Array.isArray(currentPostData.img) && currentPostData.img.length > 0 && currentPostData.img[0].url) {
    mainImageUrl = currentPostData.img[0].url;
  } else if (typeof currentPostData?.image === 'string' && currentPostData.image) {
    mainImageUrl = currentPostData.image;
  }

  const postName = currentPostData?.desc || currentPostData?.title || "Untitled Post";

  const handleLikeToggle = async () => {
    if (!currentUser || !currentPostData || !currentPostData.id) return;
    setIsLoadingLike(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/posts/${currentPostData.id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.data) {
        setIsLiked(!isLiked);
        setCurrentPostData(prev => ({...prev, likes: response.data.likes}));
        if (typeof currentPostData.onLikeUpdate === 'function') {
            currentPostData.onLikeUpdate(currentPostData.id, response.data.likes);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error.response ? error.response.data : error.message);
    } finally {
      setIsLoadingLike(false);
    }
  };
  
  const handleClose = () => {
      setShowModal(false);
      setTimeout(() => {
          onClose(); 
      }, 250); // Slightly reduced timeout to match faster animation feel
  }

  const handleRelatedClick = (relatedP) => {
    if (onRelatedPostClick) {
        onRelatedPostClick(relatedP);
    }
  }

  const displayAuthorName = currentAuthorData ? currentAuthorData.username : (currentPostData?.userId === currentUser?._id ? currentUser?.username : 'User');

  return (
    <animated.div
      style={modalAnimation}
      // Enhanced Glassmorphism:
      // - Reduced opacity for more translucency: bg-white/75 dark:bg-zinc-900/75
      // - Increased backdrop blur: backdrop-blur-3xl (Tailwind's largest default, approx 40px)
      // - Added a very subtle border to the modal itself for definition
      className="fixed inset-0 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-3xl flex flex-col z-[100] overflow-y-auto border border-white/20 dark:border-zinc-700/20"
    >
      {/* Top Bar with Back Button */}
      <div className="absolute top-0 left-0 p-3 sm:p-4 z-20">
        <button
          onClick={handleClose}
          // Slightly more pronounced background for the button for better tap target visibility
          className="p-2 rounded-full bg-black/15 dark:bg-white/15 hover:bg-black/25 dark:hover:bg-white/25 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-300 focus:ring-opacity-50"
        >
          <BackArrowIcon />
        </button>
      </div>
        
      <animated.div style={contentAnimation} className="w-full flex-grow flex flex-col items-center pt-16 sm:pt-20 pb-8">
        {/* Main Image */}
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto px-2 sm:px-0 mb-2">
          <img
            src={mainImageUrl}
            alt={postName}
            // Slightly softer shadow, maintained border
            className="w-full h-auto object-contain rounded-xl shadow-xl max-h-[60vh] sm:max-h-[65vh] border border-gray-200/70 dark:border-zinc-700/70"
          />
        </div>

        {/* Info and Actions Bar - Below Image */}
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl p-3 sm:p-4 mt-1 flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate" title={postName}>
              {postName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate" title={displayAuthorName}>
              By {displayAuthorName}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button 
              onClick={handleLikeToggle} 
              disabled={isLoadingLike} 
              className="p-2.5 rounded-full hover:bg-gray-500/10 dark:hover:bg-white/10 active:bg-gray-500/20 dark:active:bg-white/20 transition-all duration-150 transform active:scale-90 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-300 focus:ring-opacity-30"
            >
              <HeartIcon filled={isLiked} />
            </button>
            <button className="p-2.5 rounded-full hover:bg-gray-500/10 dark:hover:bg-white/10 active:bg-gray-500/20 dark:active:bg-white/20 transition-all duration-150 transform active:scale-90 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-300 focus:ring-opacity-30">
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* "Other Photos" Grid */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl p-2 sm:p-4 mt-3 sm:mt-5">
            <h3 className="text-base sm:text-md font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 px-1">More like this</h3>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {relatedPosts.map((relatedP) => {
                  if (relatedP.id === currentPostData?.id) return null;

                  let relatedImageUrl = 'https://placehold.co/300x300/CBD5E0/4A5568?text=Photo';
                  if (relatedP.img && Array.isArray(relatedP.img) && relatedP.img.length > 0 && relatedP.img[0].url) {
                    relatedImageUrl = relatedP.img[0].url;
                  } else if (typeof relatedP.image === 'string' && relatedP.image) {
                    relatedImageUrl = relatedP.image;
                  }
                return (
                  <animated.div 
                    key={relatedP.id} 
                    // Enhanced hover effect for related items
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/60 dark:border-zinc-700/60 hover:border-gray-300/80 dark:hover:border-zinc-600/80 transform hover:-translate-y-1"
                    onClick={() => handleRelatedClick(relatedP)}
                  >
                    <img
                      src={relatedImageUrl}
                      alt={relatedP.desc || 'Related post'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center space-x-1 bg-black/70 p-1 px-1.5 rounded-md text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <HeartIcon 
                            filled={currentUser && relatedP.likes && relatedP.likes.includes(currentUser._id)} 
                            small={true} 
                        />
                        <span className="font-medium">{relatedP.likes?.length || 0}</span>
                    </div>
                  </animated.div>
                );
              })}
            </div>
          </div>
        )}
      </animated.div>
    </animated.div>
  );
}

export default DetailedPostModal;

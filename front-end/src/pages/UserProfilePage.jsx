// src/pages/UserProfilePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DetailedPostModal from '../components/DetailedPostModal.jsx';

// --- Icon Components (Styled for the new theme) ---
const SettingsIcon = () => <svg className="w-6 h-6 text-white/80 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const GridIcon = ({ isActive }) => <svg aria-label="Posts" className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 16h4v4h-4v-4zm6 16h4v4h-4v-4z"></path></svg>;
const SavedIcon = ({ isActive }) => <svg aria-label="Saved" className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>;
const TaggedIcon = ({ isActive }) => <svg aria-label="Tagged" className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const HeartIcon = ({ filled, small = false }) => (
    <svg className={`transition-colors duration-200 ${small ? 'w-5 h-5' : 'w-6 h-6'} ${filled ? 'text-red-500 fill-current' : 'text-white/90 group-hover:text-red-400'}`} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);
// --- End Icon Components ---

function UserProfilePage() {
  const { userId } = useParams();
  const { currentUser, authToken } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  const [selectedPostForModal, setSelectedPostForModal] = useState(null);
  const [authorDetailsForModal, setAuthorDetailsForModal] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const isCurrentUserProfile = currentUser?._id === userId;

  const openDetailedPostModal = async (postData) => {
    if (!postData || !postData.userId) {
        console.error("UserProfilePage: Cannot open modal, post data or userId is missing.", postData);
        return;
    }
    setSelectedPostForModal(postData);
    if (postData.userId === profileUser?._id) {
        setAuthorDetailsForModal(profileUser);
    } else {
        try {
            setAuthorDetailsForModal(null);
            const userResponse = await axios.get(`${API_BASE_URL}/api/users/${postData.userId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setAuthorDetailsForModal(userResponse.data);
        } catch (err) {
            console.error("UserProfilePage: Error fetching author details for modal:", err);
            setAuthorDetailsForModal({ username: 'User N/A', profilePicture: '' });
        }
    }
  };

  const closeDetailedPostModal = () => {
    setSelectedPostForModal(null);
    setAuthorDetailsForModal(null);
  };

  const fetchProfileData = useCallback(async () => {
    if (!userId) {
      setError("User ID is missing in the URL.");
      setIsLoading(false);
      return;
    }
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        setError(`Invalid User ID format: "${userId}". Profile cannot be loaded.`);
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const userRes = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setProfileUser(userRes.data);

      const postsRes = await axios.get(`${API_BASE_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      const allPosts = Array.isArray(postsRes.data) ? postsRes.data : [];
      const filteredPosts = allPosts.filter(post => post.userId === userId);
      setUserPosts(filteredPosts);

    } catch (err) {
      console.error("UserProfilePage: Error during fetchProfileData for userId:", userId, err);
      setError(err.response?.data?.message || err.message || "Failed to load profile data.");
      if (err.response?.status === 404) {
        navigate('/not-found', { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, authToken, API_BASE_URL, navigate]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleFollow = async () => {
    if (!currentUser || !profileUser || isCurrentUserProfile || !authToken) {
        if (!authToken) navigate('/login');
        return;
    }
    const isFollowing = currentUser.followings?.includes(profileUser._id);
    const action = isFollowing ? 'unfollow' : 'follow';
    try {
        await axios.put(`${API_BASE_URL}/api/users/${profileUser._id}/${action}`,
            { userId: currentUser._id },
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        // Optimistically update profileUser state for immediate UI feedback
        setProfileUser(prev => {
            if (!prev) return null;
            const currentFollowers = prev.followers || [];
            return {
                ...prev,
                followers: action === 'follow'
                    ? [...currentFollowers, currentUser._id]
                    : currentFollowers.filter(id => id !== currentUser._id)
            };
        });
        // Optionally, update currentUser context if it stores followings
        // This part depends on how your AuthContext is structured
        // For example:
        // if (typeof updateCurrentUserFollowings === 'function') {
        //    updateCurrentUserFollowings(profileUser._id, action);
        // }

    } catch (err) {
        console.error(`UserProfilePage: Error ${action} user:`, err.response?.data?.message || err.message);
        // Revert optimistic update on error if necessary
        fetchProfileData(); // Or more specific error handling
    }
  };


  // Note: Ensure "Open Sans" is imported in your project's main CSS or index.html
  // <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white font-['Open_Sans',_sans-serif]">
        {/* Optional: Add the background image and overlay here too for consistency */}
        {/* <div className="fixed inset-0 bg-[url('https://i.pinimg.com/736x/74/d9/b6/74d9b62c4603875276c53e75e7b93cd5.jpg')] bg-cover bg-center z-[-2]"></div> */}
        {/* <div className="fixed inset-0 bg-black/70 z-[-1]"></div> */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white/50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white font-['Open_Sans',_sans-serif] p-4 text-center">
        {/* <div className="fixed inset-0 bg-[url('https://i.pinimg.com/736x/74/d9/b6/74d9b62c4603875276c53e75e7b93cd5.jpg')] bg-cover bg-center z-[-2]"></div> */}
        {/* <div className="fixed inset-0 bg-black/70 z-[-1]"></div> */}
        <h2 className="text-2xl font-semibold text-red-400 mb-3">Oops!</h2>
        <p className="text-red-300 text-md mb-6 max-w-md">{error}</p>
        <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2.5 bg-white/20 border border-white/40 rounded-full font-semibold hover:bg-white/30 transition-colors duration-300"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  if (!profileUser) {
    // This state might be brief or indicate an issue post-loading/pre-error.
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-black text-white font-['Open_Sans',_sans-serif] p-4">
         {/* <div className="fixed inset-0 bg-[url('https://i.pinimg.com/736x/74/d9/b6/74d9b62c4603875276c53e75e7b93cd5.jpg')] bg-cover bg-center z-[-2]"></div> */}
        {/* <div className="fixed inset-0 bg-black/70 z-[-1]"></div> */}
        <p className="text-lg">User profile could not be loaded.</p>
         <button onClick={() => navigate('/')} className="mt-4 px-6 py-2.5 bg-white/20 border border-white/40 rounded-full font-semibold hover:bg-white/30 transition-colors duration-300">
          Go Home
        </button>
      </div>
    );
  }

  const profilePicUrl = profileUser.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.username)}&background=252525&color=FFF&size=150&font-size=0.33&bold=true&rounded=true`;
  const postCount = userPosts.length;
  const followerCount = profileUser.followers?.length || 0;
  const followingCount = profileUser.followings?.length || 0;
  const isFollowing = currentUser?.followings?.includes(profileUser._id);


  return (
    <div className="min-h-screen font-['Open_Sans',_sans-serif] text-white leading-relaxed relative">
      {/* Background Image */}
      <div className="fixed inset-0 bg-[url('https://i.pinimg.com/736x/de/d3/45/ded3457a372af8ee97e0c7ef0f2a8f1d.jpg')] bg-cover bg-center z-[-2]"></div>
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[-1]"></div>

      {/* Header with glassmorphism */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between p-4 md:p-5 mx-2 my-2 md:mx-4 md:my-3 rounded-[24px] border border-white/20 bg-black/30 backdrop-blur-lg shadow-xl"
      >
        <button
            onClick={() => navigate(-1)}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-100">{profileUser.username}</h1>
        {isCurrentUserProfile ? (
          <Link to="/settings/account" aria-label="Options" className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10">
            <SettingsIcon />
          </Link>
        ) : (
          <div className="w-9 h-9"></div> // Placeholder for alignment
        )}
      </header>

      {/* Main content area - container for the glassmorphic card */}
      <main className="max-w-4xl mx-auto py-6 px-3 sm:px-4">
        {/* Glassmorphic card for profile details and posts */}
        <div className="bg-black/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          {/* Profile Header Section */}
          <section className="flex flex-col sm:flex-row items-center sm:items-start p-5 sm:p-6 md:p-8 gap-5 sm:gap-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-2 border-white/20">
              <img src={profilePicUrl} alt={profileUser.username} className="w-full h-full object-cover"
                   onError={(e) => { e.target.onerror = null; e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.username)}&background=333&color=FFF&size=150&rounded=true`}}/>
            </div>

            <div className="flex-grow text-center sm:text-left w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:space-x-4 mb-3">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-50">{profileUser.username}</h2>
                {!isCurrentUserProfile && (
                  <div className="flex gap-2 sm:gap-3">
                    <button
                        onClick={handleFollow}
                        disabled={!authToken && !currentUser} // Disable if not logged in
                        className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/50 ${
                            (!authToken && !currentUser)
                                ? 'bg-gray-500/30 text-gray-400/80 cursor-not-allowed border border-gray-600/50'
                                : isFollowing
                                    ? 'bg-transparent border border-white/50 text-white hover:bg-white/10'
                                    : 'bg-white/90 hover:bg-white text-black border border-transparent' // More prominent follow
                        }`}
                    >
                      {(!authToken && !currentUser) ? 'Login to Follow' : isFollowing ? 'Following' : 'Follow'}
                    </button>
                     {authToken && (
                      <button className="px-5 py-2 text-sm font-semibold border border-white/40 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shadow-md">
                        Message
                      </button>
                     )}
                  </div>
                )}
              </div>

              <div className="flex justify-center sm:justify-start space-x-6 mb-3 text-sm text-gray-300">
                <div><span className="font-semibold text-gray-100">{postCount}</span> posts</div>
                <div><span className="font-semibold text-gray-100">{followerCount}</span> followers</div>
                <div><span className="font-semibold text-gray-100">{followingCount}</span> following</div>
              </div>

              {profileUser.desc && (
                <p className="text-sm text-gray-300/90 leading-relaxed max-w-md mx-auto sm:mx-0">{profileUser.desc}</p>
              )}
            </div>
          </section>

          {/* Tabs */}
          <div className="border-t border-white/10 px-2 sm:px-4 md:px-6">
            <div className="flex justify-center items-center -mb-px">
              {[
                { id: 'posts', label: 'Posts', icon: GridIcon, condition: true },
                { id: 'saved', label: 'Saved', icon: SavedIcon, condition: isCurrentUserProfile },
                { id: 'tagged', label: 'Tagged', icon: TaggedIcon, condition: true }
              ].map(tab => tab.condition && (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none sm:px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ease-in-out focus:outline-none
                              flex items-center justify-center gap-2
                            ${ activeTab === tab.id
                                ? 'text-white border-b-2 border-white'
                                : 'text-white/60 hover:text-white border-b-2 border-transparent hover:border-white/30'
                            }`}
                >
                  <tab.icon isActive={activeTab === tab.id} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Post Grid / Content Area */}
          <section className="p-2 sm:p-3 md:p-4">
            {activeTab === 'posts' && (
              userPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                  {userPosts.map(post => {
                    const thumbnailUrl = post.image || `https://placehold.co/300x300/1a1a1a/3b3b3b?text=${profileUser.username?.[0] || 'P'}`;
                    return (
                      <div
                          key={post._id || post.id}
                          className="aspect-square block group relative overflow-hidden rounded-xl cursor-pointer 
                                     bg-gradient-radial from-white/10 to-transparent/5 via-transparent/0
                                     border border-white/10 hover:border-white/20 shadow-lg hover:shadow-white/10 transition-all duration-300"
                          onClick={() => openDetailedPostModal(post)}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && openDetailedPostModal(post)}
                      >
                        <img
                          src={thumbnailUrl}
                          alt={post.desc || 'User post'}
                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                          onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/300x300/1a1a1a/3b3b3b?text=Error`}}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 ease-in-out flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
                          <div className="flex items-center space-x-1.5 text-xs sm:text-sm">
                            <HeartIcon filled={currentUser && post.likes?.includes(currentUser._id)} small={true}/>
                            <span className="font-medium">{post.likes?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-16">
                  <GridIcon isActive={false} />
                  <h3 className="text-xl font-semibold text-gray-200 mt-5">No Posts Yet</h3>
                  {isCurrentUserProfile && <p className="text-gray-400/80 mt-2">Share your first creation!</p>}
                </div>
              )
            )}
            {activeTab === 'saved' && isCurrentUserProfile && (
              <div className="text-center py-12 sm:py-16 text-gray-400/80">
                  <SavedIcon isActive={false} />
                  <h3 className="text-xl font-semibold text-gray-200 mt-5">Saved</h3>
                  <p className="mt-1">Your saved creations will appear here.</p>
              </div>
            )}
            {activeTab === 'tagged' && (
               <div className="text-center py-12 sm:py-16 text-gray-400/80">
                  <TaggedIcon isActive={false} />
                  <h3 className="text-xl font-semibold text-gray-200 mt-5">Tagged</h3>
                  <p className="mt-1">Creations you're tagged in will show up here.</p>
               </div>
            )}
          </section>
        </div>
      </main>

      {selectedPostForModal && (
        <DetailedPostModal
          post={selectedPostForModal}
          author={authorDetailsForModal}
          currentUser={currentUser}
          onClose={closeDetailedPostModal}
          // Pass theme-related props if your modal needs to adapt, e.g., isDarkMode={true}
        />
      )}
    </div>
  );
}

export default UserProfilePage;
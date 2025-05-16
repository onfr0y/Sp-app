// src/pages/UserProfilePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';// Import DetailedPostModal
import DetailedPostModal from '../components/DetailedPostModal.jsx'; // Import the modal

// --- Icon Components ---
const SettingsIcon = () => <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const GridIcon = () => <svg aria-label="Posts" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 16h4v4h-4v-4zm6 16h4v4h-4v-4z"></path></svg>;
const SavedIcon = () => <svg aria-label="Saved" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>;
const TaggedIcon = () => <svg aria-label="Tagged" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const HeartIcon = ({ filled, small = false }) => (
    <svg className={`transition-colors duration-200 ${small ? 'w-4 h-4' : 'w-6 h-6'} ${filled ? 'text-red-500 fill-current' : 'text-gray-100 hover:text-red-400'}`} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    
    const action = currentUser.followings?.includes(profileUser._id) ? 'unfollow' : 'follow';
    try {
        await axios.put(`${API_BASE_URL}/api/users/${profileUser._id}/${action}`, 
            { userId: currentUser._id }, 
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
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
    } catch (err) {
        console.error(`UserProfilePage: Error ${action} user:`, err.response?.data?.message || err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-900 p-4 text-center">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-3">Oops! Something went wrong.</h2>
        <p className="text-red-500 dark:text-red-300 text-md mb-6 max-w-md">{error}</p>
        <button 
            onClick={() => navigate('/')} 
            className="mt-4 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-900 p-4">
        <p className="text-gray-700 dark:text-gray-300 text-lg">User profile could not be loaded.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Go Home
        </button>
      </div>
    );
  }
  
  const profilePicUrl = profileUser.profilePicture || 
                        `https://placehold.co/150x150/E2E8F0/4A5568?text=${profileUser.username?.[0]?.toUpperCase()||'U'}`;
  const postCount = userPosts.length;
  const followerCount = profileUser.followers?.length || 0;
  const followingCount = profileUser.followings?.length || 0;

  return (
    // The main page background. Glassmorphism will be applied to elements on top of this.
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-slate-900 dark:to-sky-800">
      {/* Header with glassmorphism */}
      <header 
        className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg sticky top-0 z-[50] border-b border-gray-200/30 dark:border-zinc-700/50 shadow-sm"
      >
        <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
           <button 
            onClick={() => navigate(-1)} 
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1.5 rounded-md hover:bg-gray-500/10 dark:hover:bg-white/10"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{profileUser.username}</h1>
          {isCurrentUserProfile ? (
            <button aria-label="Options" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-md hover:bg-gray-500/10 dark:hover:bg-white/10">
              <SettingsIcon />
            </button>
          ) : (
            <div className="w-9 h-9"></div> 
          )}
        </div>
      </header>

      {/* Main content area - container for the glassmorphic card */}
      <main className="container mx-auto max-w-5xl py-6 px-4"> 
        {/* Glassmorphic card for profile details and posts */}
        <div className="bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-zinc-700/30">
          {/* Profile Header Section (inside the glass card) */}
          <section className="flex flex-col sm:flex-row items-center sm:items-start p-4 sm:p-6 md:p-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden mr-0 sm:mr-8 md:mr-10 mb-4 sm:mb-0 flex-shrink-0 shadow-lg border-2 border-white/50 dark:border-zinc-700/50">
              <img src={profilePicUrl} alt={profileUser.username} className="w-full h-full object-cover" 
                   onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/150x150/E2E8F0/4A5568?text=${profileUser.username?.[0]?.toUpperCase()||'U'}`}}/>
            </div>

            <div className="flex-grow text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-4 mb-3">
                <h2 className="text-2xl md:text-3xl font-light text-gray-800 dark:text-gray-100">{profileUser.username}</h2>
                {isCurrentUserProfile ? (
                  <Link to="/settings/edit-profile" className="px-4 py-1.5 text-sm font-semibold border border-gray-300/70 dark:border-zinc-600/70 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-zinc-700/70 transition-colors shadow-sm">
                    Edit Profile
                  </Link>
                ) : (
                  <button 
                      onClick={handleFollow}
                      disabled={!authToken} 
                      className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors shadow-sm ${
                          !authToken 
                              ? 'bg-gray-300/70 dark:bg-zinc-600/70 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                              : currentUser?.followings?.includes(profileUser._id)
                                  ? 'bg-gray-200/70 dark:bg-zinc-700/70 text-gray-800 dark:text-gray-200 hover:bg-gray-300/70 dark:hover:bg-zinc-600/70' 
                                  : 'bg-blue-500 hover:bg-blue-600 text-white' // Primary action button can stay solid
                      }`}
                  >
                    {!authToken ? 'Login to Follow' : currentUser?.followings?.includes(profileUser._id) ? 'Following' : 'Follow'}
                  </button>
                )}
                 {!isCurrentUserProfile && authToken && ( 
                  <button className="px-4 py-1.5 text-sm font-semibold border border-gray-300/70 dark:border-zinc-600/70 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-zinc-700/70 transition-colors shadow-sm">
                    Message
                  </button>
                 )}
              </div>

              <div className="flex justify-center sm:justify-start space-x-6 mb-3 text-sm text-gray-700 dark:text-gray-300">
                <div><span className="font-semibold text-gray-900 dark:text-gray-100">{postCount}</span> posts</div>
                <div><span className="font-semibold text-gray-900 dark:text-gray-100">{followerCount}</span> followers</div>
                <div><span className="font-semibold text-gray-900 dark:text-gray-100">{followingCount}</span> following</div>
              </div>

              {profileUser.desc && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 max-w-md mx-auto sm:mx-0">{profileUser.desc}</p>
              )}
            </div>
          </section>

          {/* Tabs (inside the glass card) */}
          <div className="border-t border-gray-300/50 dark:border-zinc-700/50 px-4 sm:px-6 md:px-8">
            <div className="flex justify-center space-x-8 -mb-px">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-3 text-sm font-medium uppercase tracking-wider border-t-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'posts' 
                  ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300' // Active tab highlight
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300/70 dark:hover:border-zinc-600/70'
                }`}
              >
                <GridIcon /><span className="hidden sm:inline">Posts</span>
              </button>
              {isCurrentUserProfile && ( 
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`py-3 text-sm font-medium uppercase tracking-wider border-t-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'saved' 
                    ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300/70 dark:hover:border-zinc-600/70'
                  }`}
                >
                  <SavedIcon /><span className="hidden sm:inline">Saved</span>
                </button>
              )}
              <button 
                onClick={() => setActiveTab('tagged')}
                className={`py-3 text-sm font-medium uppercase tracking-wider border-t-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'tagged' 
                  ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300/70 dark:hover:border-zinc-600/70'
                }`}
              >
               <TaggedIcon /><span className="hidden sm:inline">Tagged</span>
              </button>
            </div>
          </div>

          {/* Post Grid / Content Area (inside the glass card) */}
          <section className="p-4 sm:p-6 md:p-8 pt-6"> {/* Added padding to section for content spacing */}
            {activeTab === 'posts' && (
              userPosts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 md:gap-4">
                  {userPosts.map(post => {
                    const thumbnailUrl = post.image || `https://placehold.co/300x300/E2E8F0/4A5568?text=Post`;
                    return (
                      <div 
                          key={post.id} 
                          className="aspect-square block group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200/30 dark:border-zinc-700/30"
                          onClick={() => openDetailedPostModal(post)} 
                      >
                        <img 
                          src={thumbnailUrl} 
                          alt={post.desc || 'User post'} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-80" 
                          onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/300x300/E2E8F0/4A5568?text=Error`}}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
                          <div className="flex items-center space-x-2 text-xs sm:text-sm">
                            <HeartIcon filled={currentUser && post.likes?.includes(currentUser._id)} small={true}/> 
                            <span>{post.likes?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <GridIcon />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">No Posts Yet</h3>
                  {isCurrentUserProfile && <p className="text-gray-500 dark:text-gray-400 mt-2">Share your first photo!</p>}
                </div>
              )
            )}
            {activeTab === 'saved' && isCurrentUserProfile && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <SavedIcon />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Saved</h3>
                  <p className="mt-1">Saved posts will appear here. (Feature not fully implemented)</p>
              </div>
            )}
            {activeTab === 'tagged' && (
               <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <TaggedIcon />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-4">Tagged</h3>
                  <p className="mt-1">Photos of you will appear here. (Feature not fully implemented)</p>
              </div>
            )}
          </section>
        </div> {/* End of glassmorphic card for main content */}
      </main>

      {selectedPostForModal && (
        <DetailedPostModal
          post={selectedPostForModal}
          author={authorDetailsForModal} 
          currentUser={currentUser}
          onClose={closeDetailedPostModal}
        />
      )}
    </div>
  );
}

export default UserProfilePage;

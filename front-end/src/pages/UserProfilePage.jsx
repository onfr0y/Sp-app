// src/pages/UserProfilePage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // To get current user info

// --- Icon Components (Placeholder - use your actual icons or a library like Lucide React) ---
const SettingsIcon = () => <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const GridIcon = () => <svg aria-label="Posts" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 16h4v4h-4v-4zm6 16h4v4h-4v-4z"></path></svg>;
const SavedIcon = () => <svg aria-label="Saved" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>;
const TaggedIcon = () => <svg aria-label="Tagged" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const ChevronDownIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;
const UserPlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>; // Placeholder for follow suggestions
// --- End Icon Components ---


function UserProfilePage() {
  const { userId } = useParams(); // Get userId from URL
  const { currentUser, authToken } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'saved', 'tagged'

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const isCurrentUserProfile = currentUser?._id === userId;

  const fetchProfileData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      // Fetch user details
      const userRes = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setProfileUser(userRes.data);

      // Fetch posts by this user
      // TODO: Ideally, backend should have an endpoint like /api/posts/user/:userId
      // For now, fetching all and filtering client-side (inefficient for many posts)
      const postsRes = await axios.get(`${API_BASE_URL}/api/posts`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const filteredPosts = postsRes.data.filter(post => post.userId === userId);
      setUserPosts(filteredPosts);

    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError(err.response?.data?.message || err.message || "Failed to load profile.");
      if (err.response?.status === 404) {
        // Optionally navigate to a 404 page or show specific message
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
    if (!currentUser || !profileUser || isCurrentUserProfile) return;
    // Implement follow/unfollow logic here
    // You'll need an API endpoint e.g., PUT /api/users/:id/follow
    console.log(`Follow/Unfollow user: ${profileUser.username}`);
    try {
        // Determine if already following to toggle
        const isFollowing = currentUser.followings && currentUser.followings.includes(profileUser._id);
        const action = isFollowing ? 'unfollow' : 'follow';

        await axios.put(`${API_BASE_URL}/api/users/${profileUser._id}/${action}`, 
            { userId: currentUser._id }, // This is how your current backend expects it
            { headers: { Authorization: `Bearer ${authToken}` } }
        );
        // Refetch profileUser to update follower count and button state, or update locally
        // For immediate UI update, update local state then fetch for consistency
        setProfileUser(prev => ({
            ...prev,
            followers: isFollowing 
                ? prev.followers.filter(id => id !== currentUser._id) 
                : [...(prev.followers || []), currentUser._id]
        }));
        // Also update currentUser's followings list in AuthContext if possible, or trigger a refresh
    } catch (err) {
        console.error(`Error ${isFollowing ? 'unfollowing' : 'following'} user:`, err);
        // Handle error (e.g., show a toast message)
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
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-900 p-4">
        <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Go Home
        </button>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-900">
        <p className="text-gray-700 dark:text-gray-300">User not found.</p>
      </div>
    );
  }
  
  const profilePicUrl = profileUser.profilePicture || `https://placehold.co/150x150/E2E8F0/4A5568?text=${profileUser.username?.[0]?.toUpperCase()||'U'}`;
  const postCount = userPosts.length;
  const followerCount = profileUser.followers?.length || 0;
  const followingCount = profileUser.followings?.length || 0;


  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 sticky top-0 z-10">
        <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{profileUser.username}</h1>
          {isCurrentUserProfile && (
            <button aria-label="Options">
              <SettingsIcon />
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto max-w-5xl p-4 md:p-6">
        {/* Profile Header */}
        <section className="flex flex-col sm:flex-row items-center sm:items-start mb-6 md:mb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden mr-0 sm:mr-8 md:mr-10 mb-4 sm:mb-0 flex-shrink-0 shadow-md">
            <img src={profilePicUrl} alt={profileUser.username} className="w-full h-full object-cover" />
          </div>

          <div className="flex-grow text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-4 mb-3">
              <h2 className="text-2xl md:text-3xl font-light text-gray-800 dark:text-gray-100">{profileUser.username}</h2>
              {isCurrentUserProfile ? (
                <Link to="/settings/edit-profile" className="px-3 py-1.5 text-sm font-semibold border border-gray-300 dark:border-zinc-600 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                  Edit profile
                </Link>
              ) : (
                <button 
                    onClick={handleFollow}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                        currentUser?.followings?.includes(profileUser._id)
                            ? 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-600' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                  {currentUser?.followings?.includes(profileUser._id) ? 'Following' : 'Follow'}
                </button>
              )}
               {!isCurrentUserProfile && (
                <button className="px-3 py-1.5 text-sm font-semibold border border-gray-300 dark:border-zinc-600 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                  Message
                </button>
               )}
            </div>

            {/* Stats */}
            <div className="flex justify-center sm:justify-start space-x-6 mb-3 text-sm text-gray-700 dark:text-gray-300">
              <div><span className="font-semibold text-gray-900 dark:text-gray-100">{postCount}</span> posts</div>
              <div><span className="font-semibold text-gray-900 dark:text-gray-100">{followerCount}</span> followers</div>
              <div><span className="font-semibold text-gray-900 dark:text-gray-100">{followingCount}</span> following</div>
            </div>

            {/* Bio */}
            {profileUser.desc && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{profileUser.desc}</p>
            )}
            {/* You can add more profile info here like website, etc. */}
          </div>
        </section>

        {/* Tabs for Posts, Saved, Tagged */}
        <div className="border-t border-gray-300 dark:border-zinc-700">
          <div className="flex justify-center space-x-8 -mb-px">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-3 text-sm font-medium uppercase tracking-wider border-t-2 transition-colors ${
                activeTab === 'posts' 
                ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-zinc-600'
              }`}
            >
              <span className="flex items-center"><GridIcon /><span className="ml-2 hidden sm:inline">Posts</span></span>
            </button>
            {isCurrentUserProfile && ( // Only show Saved for current user
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-3 text-sm font-medium uppercase tracking-wider border-t-2 transition-colors ${
                  activeTab === 'saved' 
                  ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100' 
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-zinc-600'
                }`}
              >
                <span className="flex items-center"><SavedIcon /><span className="ml-2 hidden sm:inline">Saved</span></span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('tagged')}
              className={`py-3 text-sm font-medium uppercase tracking-wider border-t-2 transition-colors ${
                activeTab === 'tagged' 
                ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-zinc-600'
              }`}
            >
             <span className="flex items-center"><TaggedIcon /><span className="ml-2 hidden sm:inline">Tagged</span></span>
            </button>
          </div>
        </div>

        {/* Post Grid / Content Area */}
        <section className="mt-6">
          {activeTab === 'posts' && (
            userPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 sm:gap-1 md:gap-4">
                {userPosts.map(post => {
                  const imageUrl = (post.img && post.img.length > 0 && post.img[0].url) ? post.img[0].url : (post.image || 'https://placehold.co/300x300/E2E8F0/4A5568?text=Post');
                  return (
                    <Link to={`/post/${post.id}`} key={post.id} className="aspect-square block group relative overflow-hidden rounded-sm">
                      <img src={imageUrl} alt={post.desc || 'User post'} className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80" />
                      {/* Hover overlay for likes/comments - simplified */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-4">
                          <span className="flex items-center"><HeartIcon filled={false} small/> {post.likes?.length || 0}</span>
                          {/* <span className="flex items-center"><CommentIcon /> {post.comments?.length || 0}</span> Placeholder */}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Posts Yet</h3>
                {isCurrentUserProfile && <p className="text-gray-500 dark:text-gray-400 mt-2">Share your first photo!</p>}
              </div>
            )
          )}
          {activeTab === 'saved' && isCurrentUserProfile && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">Saved posts will appear here. (Feature not implemented)</div>
          )}
          {activeTab === 'tagged' && (
             <div className="text-center py-10 text-gray-500 dark:text-gray-400">Photos of you will appear here. (Feature not implemented)</div>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserProfilePage;

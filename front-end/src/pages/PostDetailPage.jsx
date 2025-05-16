// front-end/src/pages/PostDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DeletePostButton from '../components/DeletePostButton'; // Assuming you have this

// Placeholder for LikeButton and CommentsSection
const LikeButtonPlaceholder = ({ postId, initialLikes = [] }) => {
  const [likesCount, setLikesCount] = useState(initialLikes.length);
  // In a real app, you'd also manage if the current user has liked this post
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false); 
  const { authToken, currentUser } = useAuth();

  // TODO: Check if currentUser.id is in initialLikes to set isLikedByCurrentUser initially

  const handleLike = async () => {
    if (!authToken || !currentUser) {
      console.log("User not authenticated, cannot like.");
      // Optionally, navigate to login or show a message
      return;
    }
    // Optimistic update
    setIsLikedByCurrentUser(!isLikedByCurrentUser);
    setLikesCount(prev => isLikedByCurrentUser ? prev - 1 : prev + 1);

    try {
      await axios.put(`${API_BASE_URL}/api/posts/${postId}/like`, {}, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      // Fetch updated likes count or trust optimistic update for now
      console.log("Like status updated for post:", postId);
    } catch (error) {
      console.error("Failed to update like status:", error);
      // Revert optimistic update on error
      setIsLikedByCurrentUser(prev => !prev); // Toggle back
      setLikesCount(prev => isLikedByCurrentUser ? prev + 1 : prev - 1); // Revert count
    }
  };

  return (
    <div className="mt-4 flex items-center">
      <button
        onClick={handleLike}
        className={`px-4 py-2 rounded-md font-semibold mr-3 transition-colors ${
          isLikedByCurrentUser 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        {isLikedByCurrentUser ? 'Unlike' : 'Like'}
      </button>
      <span className="text-gray-600">{likesCount} Likes</span>
    </div>
  );
};

const CommentsSectionPlaceholder = ({ postId }) => {
  // TODO: Fetch and display comments, add comment form
  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Comments</h3>
      <p className="text-gray-500">Comments feature coming soon for post {postId}!</p>
      {/* Placeholder for actual comment list and input form */}
      {/* Example: <textarea className="w-full p-2 border rounded-md" placeholder="Add a comment..."></textarea> */}
      {/* <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Post Comment</button> */}
    </div>
  );
};


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function PostDetailPage() {
  const { postId } = useParams();
  const { currentUser, authToken } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const postResponse = await axios.get(`${API_BASE_URL}/api/posts/${postId}`);
        if (!postResponse.data) {
          throw new Error("Post not found");
        }
        setPost(postResponse.data);

        if (postResponse.data.userId) {
          try {
            const userResponse = await axios.get(`${API_BASE_URL}/api/users/${postResponse.data.userId}`);
            setAuthor(userResponse.data);
          } catch (userError) {
            console.error("Failed to fetch author details:", userError);
            setAuthor({ username: 'Unknown User', profilePicture: '' }); 
          }
        }
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError(err.response?.data?.message || err.message || "Failed to load post.");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId]);

  const handlePostDeleted = () => {
    console.log("Post deleted, navigating back to home.");
    navigate('/'); 
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen p-4"><p className="text-gray-600 text-lg">Loading post details...</p></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
        <p className="text-red-600 text-lg mb-4">Error: {error}</p>
        <Link to="/" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Go to Homepage
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 text-center">
        <p className="text-gray-600 text-lg mb-4">Post not found.</p>
        <Link to="/" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const mainImageUrl = post.img && post.img.length > 0 && post.img[0].url 
    ? post.img[0].url 
    : '/path/to/your/default-placeholder-image.png'; // Provide a fallback image path

  const canDeleteThisPost = currentUser && post && (currentUser._id === post.userId || currentUser.isAdmin);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-2 sm:px-4">
        <button
            onClick={() => navigate(-1)} 
            className="mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm flex items-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back
        </button>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <img
            src={mainImageUrl}
            alt={post.desc || "Post image"}
            className="w-full h-auto max-h-[75vh] object-contain bg-black" // bg-black for letterboxing if image is not filling
          />

          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              {author ? (
                <Link to={`/profile/${author._id}`} className="flex items-center group">
                  <img
                    src={author.profilePicture || '/default-avatar.png'}
                    alt={author.username || 'User'}
                    className="w-11 h-11 rounded-full mr-3 border-2 border-transparent group-hover:border-blue-400 transition-all"
                  />
                  <div>
                    <span className="font-semibold text-gray-800 group-hover:text-blue-600 block text-md">
                      {author.username || 'Anonymous'}
                    </span>
                    <p className="text-xs text-gray-500">
                      Posted on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ) : (
                 <div className="h-11"></div> // Placeholder for height if author is loading/missing
              )}
              {canDeleteThisPost && (
                <DeletePostButton postId={post._id} onPostDeleted={handlePostDeleted} className="text-gray-500 hover:text-red-600"/>
              )}
            </div>

            {post.desc && <p className="text-gray-700 my-4 leading-relaxed">{post.desc}</p>}

            <LikeButtonPlaceholder postId={post._id} initialLikes={post.likes || []} />

            <CommentsSectionPlaceholder postId={post._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;
import React from 'react'

function PostResult({ posts }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Photo Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No photo posts yet. Share your first photo!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img src={post.image} alt="Post" className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                {post.caption && <p className="text-gray-800 mb-2 line-clamp-2">{post.caption}</p>}
                <span className="text-xs text-gray-500">{post.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PostResult

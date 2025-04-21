// src/components/PostPageHeader.jsx
import React from 'react';

const PostPageHeader = ({ title, onGoBack }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 text-sm font-medium text-gray-800 border-b border-white/20 bg-white/20 backdrop-blur-sm sticky top-0 z-10 sm:px-6">
      <button onClick={onGoBack} className="hover:text-black transition-colors">
        back
      </button>
      <span className="font-semibold">{title}</span>
      <div className="w-10 h-5"></div> {/* Spacer */}
    </div>
  );
};

export default PostPageHeader;

import React, { useState } from 'react';

// Basic SVG Icons (replace with your preferred icon library if needed)
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const ArrowRightIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
</svg>
);


function AuthPageStyled() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Attempting login with:', { email, password });
    // Your actual auth logic here
    alert('Submit triggered (implement auth logic)');
  };

  return (
    // Full screen container, centers content. Background is now inherited.
    <div className="flex items-center justify-center min-h-screen px-4 py-8"> 
      {/* Auth Card with glassmorphism effect */}
      <div className="w-full max-w-sm p-8 bg-white/60 backdrop-blur-lg rounded-3xl shadow-lg text-zinc-900">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-lg font-medium text-zinc-700">Style Lebel</span>
          <a href="#" className="text-sm font-semibold text-zinc-800 hover:text-zinc-600">
            Sign up
          </a>
        </div>

        {/* Login Title and Facebook Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-zinc-900">
            Log in
          </h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 text-xs font-medium">
            <FacebookIcon />
            <span>Facebook</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
               <EmailIcon />
             </span>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-100/80 rounded-full shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white text-sm"
              placeholder="e-mail address"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
               <LockIcon />
             </span>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-24 py-3 border border-gray-200 bg-gray-100/80 rounded-full shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white text-sm"
              placeholder="password"
            />
             <a href="#" className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm hover:bg-gray-100 z-10">
              I forgot
            </a>
          </div>

          {/* Disclaimer and Submit Button Area */}
          <div className="flex items-end justify-between pt-4 space-x-4">
             <p className="text-xs text-gray-600 leading-tight flex-1">
                For use by adults only (18 years of age and older). Keep out of reach of children and pets. In case of accidental ingestion contact our <a href="#" className="underline font-medium">hotline</a>.
             </p>
             <button
                type="submit"
                className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-black rounded-full hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-lg"
              >
                <ArrowRightIcon />
              </button>
          </div>
        </form>

        {/* Footer Text */}
        <p className="mt-8 text-center text-xs text-gray-600">
          Please consume responsibly!
        </p>
      </div>
    </div>
  );
}

export default AuthPageStyled;

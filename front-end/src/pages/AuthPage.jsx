// src/components/AuthPageStyled.jsx (or AuthPage.jsx)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <-- MAKE SURE Link IS IMPORTED
import { useAuth  } from '../context/AuthContext';

// ... (keep existing icons and component logic) ...
const EmailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg> );
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> );
const ArrowRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg> );
const SpinnerIcon = () => ( <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> );


function AuthPageStyled() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);

  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('AuthPageStyled: Already authenticated, navigating to home.');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    const result = await login(email.trim(), password);

    if (result.success) {
      console.log('AuthPageStyled: Login successful via context, navigating to home.');
      navigate('/');
    } else {
      setFormError(result.error || 'Login failed. Please try again.');
    }
  };

  // Original loading state
  if (isLoading || isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[url('https://i.pinimg.com/736x/de/d3/45/ded3457a372af8ee97e0c7ef0f2a8f1d.jpg')]"> {/* Added bg for consistency if this state shows long */}
            <svg className="animate-spin h-8 w-8 text-zinc-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="mt-2 text-zinc-700">Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-[url('https://i.pinimg.com/736x/de/d3/45/ded3457a372af8ee97e0c7ef0f2a8f1d.jpg')] from-slate-100 to-sky-100">
      <div className=" w-full max-w-sm p-8 border-neutral-100 bg-transparent backdrop-blur-lg shadow-lg rounded-3xl shadow-xl text-zinc-900">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xl font-semibold text-zinc-800">Style Label</span>
          {/* MODIFIED: Sign up link using React Router Link */}
          <Link to="/signup" className="text-sm font-semibold text-zinc-700 hover:text-black transition-colors">Sign up</Link>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-zinc-900">Log in</h2>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md text-sm" role="alert">
            <p className="font-bold">Error</p> <p>{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"><EmailIcon /></span>
            <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}
              className="w-full pl-12 pr-4 py-3 border border-slate-300/70 bg-white/40 backdrop-blur-sm rounded-full shadow-md placeholder-slate-500 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:bg-white/60 text-sm transition-colors duration-300"
              placeholder="e-mail address" autoComplete="email" />
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"><LockIcon /></span>
            <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
              className="w-full pl-12 pr-24 py-3 border border-slate-300/70 bg-white/40 backdrop-blur-sm rounded-full shadow-md placeholder-slate-500 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-black focus:bg-white/60 text-sm transition-colors duration-300"
              placeholder="password" autoComplete="current-password" />
            <a href="/forgot-password" className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm text-zinc-700 hover:text-black rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm hover:bg-white/90 z-10 focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300">I forgot</a>
          </div>
          <div className="flex mx-70 justify-between pt-4 space-x-4">
            <button type="submit" disabled={isLoading}
              className={` flex-shrink-0 flex items-center justify-center w-12 h-12 bg-black rounded-full hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-lg transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
              {isLoading ? <SpinnerIcon /> : <ArrowRightIcon />}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-xs text-gray-600">Please consume responsibly! &copy; {new Date().getFullYear()} Style Label</p>
      </div>
    </div>
  );
}

export default AuthPageStyled;
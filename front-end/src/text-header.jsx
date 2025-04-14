// This component is used to display the text "Explore Your Style" in a header format.
import React from 'react';
import './index.css';


function TextHeader() {
  return (
    <>
      <div className='text-2xl md:text-4xl lg:text-6xl ml-10 mt-10 '>

      <h1 className='mt-0 font-mono text-3xl font-bold mb-4'>Explore</h1>
      <h1 className='mt-0 font-mono text-3xl font-bold mb-4'>Your </h1>
      <h1 className='mt-0 font-mono text-3xl font-bold mb-4'>Style...</h1>

      </div>
 
    </>
  );
}

export default TextHeader;


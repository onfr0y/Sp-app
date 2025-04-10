import React, { createContext, useContext, useState } from 'react'

const ImageDataContext = createContext();

export const useImageData = () => useContext(ImageDataContext);

function ImageProvider({children, imagePost}) {
  return (
    <ImageDataContext.Provider value={imagePost}>
      {children}
    </ImageDataContext.Provider>
  )
}

export default ImageProvider

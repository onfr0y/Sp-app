import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import TextHeader from './text-header.jsx'
import SearchBar from './searchbar.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
      <TextHeader />
      <SearchBar />
    </>
  )
}

export default App

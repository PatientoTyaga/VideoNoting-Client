import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { DarkModeContext } from '../contextProvider/DarkModeContext'

// Notfuond component definition
function NotFound() {

  // Get the 'isDarkMode' value from the DarkModeContext
  const {isDarkMode} = useContext(DarkModeContext)

  // JSX to render the 404 Not Found page
  return (
    <div className='not-found' style={{ color: isDarkMode ? 'white' : 'black' }}>
        <h1>OOPS</h1>
        <h3>404 - PAGE NOT FOUND </h3>
        <span>The page you are looking for might have been removed</span>
        <span>had its name changed, does not exist or is temporarily unavailable</span>
        <Link to="/" className='signup-btn not-found'>GO TO HOMEPAGE</Link>
    </div>
  )
}

export default NotFound

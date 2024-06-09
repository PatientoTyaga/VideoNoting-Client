import React from 'react'
import { useContext } from 'react'
import { DarkModeContext } from '../contextProvider/DarkModeContext'
import { Link } from 'react-router-dom'

// Footer component definition
function Footer() {

  // Get the 'isDarkMode' value from the DarkModeContext
  const { isDarkMode } = useContext(DarkModeContext);
  
  // JSX to render the footer content
  return (
    <footer className="web-footer" style={{ backgroundColor: isDarkMode ? '#333' : '#f8f8f8', color: isDarkMode ? 'white' : 'black' }}>
      <div className="footer-content">
        <div className="contact-info">
          <p>Contact us: <a href="mailto:patient.nd.enterprise@gmail.com" style={{ color: isDarkMode ? 'white' : 'blue' }}>patient.nd.enterprise@gmail.com</a></p>
        </div>
        <div className="social-media-links">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">Linkedin</a> | 
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> | 
        </div>
        <div className="navigation-links">
          <Link to="/about" style={{ color: isDarkMode ? 'white' : 'blue' }}>About Us</Link> | 
          <Link to="/privacy-policy" style={{ color: isDarkMode ? 'white' : 'blue' }}>Privacy Policy</Link> | 
          <Link to="/terms-of-service" style={{ color: isDarkMode ? 'white' : 'blue' }}>Terms of Service</Link>
        </div>
        
        <div className="copyright-info">
          <p>&copy; {new Date().getFullYear()} VideoNoting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

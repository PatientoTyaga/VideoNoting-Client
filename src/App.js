import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import logo from './images/logo-no-background.png'
import profileLogo from './images/profile.png'
import NavbarSearch from './components/NavbarSearch'
import { SearchContext } from './contextProvider/SearchContext'
import { ProfilePhotoContext } from './contextProvider/ProfilePhotoContext'
import { useEffect, useRef, useState } from 'react'
import Register from './components/Register'
import Login from './components/Login'
import UserProfile from './components/UserProfile'
import { AuthContext } from './contextProvider/AuthContext'
import Note from './components/Note'
import Home from './components/Home'
import Folders from './components/Folders'
import Folder from './components/Folder'
import EditFile from './components/EditFile'
import Footer from './components/Footer'
import Settings from './components/Settings'
import NotFound from './components/NotFound'
import { fetchProfilePhoto } from './components/Utils'
import { DarkModeContext } from './contextProvider/DarkModeContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  //state to store search results
  const [searchResults, setSearchResults] = useState([])

  //state to store the profile photo url
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('') 

  //state to manage authentication status
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false
  })

  //state to show dropdown visibility
  const [showDropDown, setShowDropDown] = useState(false)
  const dropDownRef = useRef(null)

  //state to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(false)

  //state to manage loading status
  const [loading, setLoading] = useState(true)

  let navigate = useNavigate()

  //function to handle clicks outside the dropdown menu
  const handleOutsideClick = (event) => {
    if(dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      setShowDropDown(false)
    }
  }

  useEffect(() => {
    //check for access token in local storage
    const accessToken = localStorage.getItem("accessToken")

    if(accessToken) {
      setAuthState(prevState => ({...prevState,status: true}))
      fetchProfilePhoto(accessToken).then((response) => {
        if(response.exists) {
          setProfilePhotoUrl(response.url)
        }
        
      })
    }

    //check for mode preference in local storage
    const darkMode = localStorage.getItem('darkMode')
    const isDark = darkMode === 'true'

    if(isDark) {
      document.body.classList.add('dark-mode')
      document.body.classList.remove('light-mode')
    }else {
      document.body.classList.add('light-mode')
      document.body.classList.remove('dark-mode')
    }

    setIsDarkMode(isDark)
    setLoading(false)
  }, [])

  useEffect(() => {
    //fetch profile photo if authenticated
    if (authState.status) {
      const accessToken = localStorage.getItem("accessToken");
      fetchProfilePhoto(accessToken).then((response) => {
        setProfilePhotoUrl(response.url)
      })
    }
  }, [authState])

  useEffect(() => {
    // Add event listener to handle clicks outside the dropdown menu
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    }
  }, [])

  useEffect(() => {
    // Load stored search results from local storage
    const storedResults = JSON.parse(localStorage.getItem('searchedVideos'))
    if (storedResults) {
      setSearchResults(storedResults)
    }
  }, [])
  
  // Handle case where search results are not an array
  if (!Array.isArray(searchResults)) {
    return <div>No search results found</div>;
  }

  // Function to handle user logout
  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("searchQuery")
    localStorage.removeItem("defaultQuery")
    localStorage.removeItem("videos")
    localStorage.removeItem("searchedVideos")
    setAuthState(prevState => ({
      ...prevState,
      username: "",
      id: 0,
      status: false
    }))
    navigate('/')
  }

  // Function to handle profile click. Redirect to either main introductory page or userprofile
  //depending on if user is authenticated
  const handleClick = () => {
    !localStorage.getItem("accessToken") ? navigate('/') : navigate('/userProfile')
  }


  // Function to toggle drop down menue
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown)
  }

  
  // Function to toggle dark mode
  const toggleDarkMode = () => {

    const newMode = !isDarkMode
  
    if (newMode) {
      document.body.classList.remove('light-mode')
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
      document.body.classList.add('light-mode')
    }
  
    localStorage.setItem('darkMode', newMode.toString())
    setIsDarkMode(newMode)
    setAuthState(prevState => ({
      ...prevState,
      isDarkMode: newMode
    }))
  }
  
  // Show loading screen if the app is still loading
  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">

      <div className='app-body'>
        <SearchContext.Provider value={{searchResults, setSearchResults}} >
          <AuthContext.Provider value ={{authState, setAuthState}} >
            <ProfilePhotoContext.Provider value={{profilePhotoUrl, setProfilePhotoUrl}} >
                <DarkModeContext.Provider value={{isDarkMode, setIsDarkMode}} >
                  <nav className= {`navbar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                    
                    <img src= {logo} alt='logo' className='logo' onClick={handleClick}/>

                    {authState.status && <NavbarSearch />}

                    <div className='nav-options'>

                      {!authState.status ?  (
                        <>
                          <Link to = '/register' className='register'>Register</Link>
                          <Link to = '/login' className='login'>Login</Link>
                        </>
                      ) : (
                        <>

                          <span className='light-mode'>Light</span>
                          <div className='toggle-mode' onClick={toggleDarkMode}>
                            <div className= {`change-mode ${isDarkMode ? 'dark' : 'light'}`}></div>
                          </div>
                          <span className='dark-mode'>Dark</span>

                          <div className='profile-container'>
                            {profilePhotoUrl ? (
                              <img
                                src={profilePhotoUrl}
                                alt="Profile"
                                className="profile-photo"
                                onClick={toggleDropDown}
                              />
                            ) : (
                              <div className="placeholder-photo">
                                <img src= {profileLogo} alt='logo' className='profile-logo' onClick={toggleDropDown}/>
                              </div>
                            )}
                            
                            {showDropDown && (
                              <div className="dropdown-menu">
                                <button onClick={() => navigate('/settings')}>Settings</button>
                                <button onClick={logout}>Logout</button>
                              </div>
                            )}
                          </div>
                          
                        </>
                      )}

                    </div>
                  </nav>

                  <Routes>
                    <Route path='/' exact element = {!authState.status ? <Home /> : <UserProfile />} />
                    <Route path='/register' exact element = {authState.status ? <UserProfile /> : <Register />} />
                    <Route path='/login' exact element = {authState.status ? <UserProfile /> : <Login />} />
                    <Route path='/userProfile' exact element = {<ProtectedRoute element={UserProfile} />} />
                    <Route path='/notes/:id' exact element = {<ProtectedRoute element={Note} />} />
                    <Route path='/folders' exact element = {<ProtectedRoute element={Folders} />} />
                    <Route path='/folder/:id' exact element = {<ProtectedRoute element={Folder} />} />
                    <Route path='/editFile/:id' exact element = {<ProtectedRoute element={EditFile} />} />
                    <Route path='/settings' exact element = {<ProtectedRoute element={Settings} />} />
                    <Route path = "*" exact element={<NotFound /> } />
                  </Routes>
                  

                </DarkModeContext.Provider>
              </ProfilePhotoContext.Provider>
          </AuthContext.Provider>
        </SearchContext.Provider>
      </div>
      
      <div className='app-footer'>
        <DarkModeContext.Provider value={{isDarkMode, setIsDarkMode}} >
          <Footer/>
        </DarkModeContext.Provider>
      </div>

    </div>
  );
}

export default App

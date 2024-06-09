import React, { useContext, useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import axios from 'axios'
import { SearchContext } from '../contextProvider/SearchContext'; 

// NavbarSearch component definition
function NavbarSearch() {

  const [searchQuery, setSearchQuery] = useState("")
  const { setSearchResults } = useContext(SearchContext)
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600)

  // useEffect hoot to handle window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 600)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // useEffect hook to load stored search results from localStorage
  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem('searchedVideos'))
    if (storedResults) {
      setSearchResults(storedResults)
    }
  }, [setSearchResults])


  // Function to handle batch search
  const handleBatchSearch = (userQueries, accessToken) => {

    if(userQueries.length > 0) {
      axios.post('https://videonoting.netlify.app/api/batch-search', { searchQueries: userQueries}, {headers: {accessToken: accessToken}}).then((response) => {
        
        if(response.data.error) {
          return alert(response.data.error)
        }
      
        const currentUser = userQueries[0].user
        const searchedVideos = response.data[currentUser]

        if(searchedVideos.length > 0) {
          setSearchResults(response.data[currentUser])
          localStorage.setItem('searchedVideos', JSON.stringify(response.data[currentUser]))
        }
          
      })
      .catch((error) => {
        console.error("Error fetching search results:", error)
      })
    }
  }

  // Function to toggle the search input visibility
  const handleToggleSearchInput = () => {
    setShowSearchInput(!showSearchInput)
  }


  // Function to handle search button click
  const handleSearchClick = () => {

    const accessToken = localStorage.getItem('accessToken')
    
    // Get the current user information
    axios.get("https://videonoting.netlify.app/auth/currentUser", {headers: {accessToken: accessToken}})
    .then((response) => {

      if(response.data.error) {
        console.log(response.data.error)
        return
      }

      const currentUser = response.data.user

      const userQueries = [
        { user: currentUser, query: searchQuery}
      ]

      // Used for setting search based on screen size
      // if small screen then first check if user has clicked on search icon and provided with the search input option
      // if not small screen then it means user can already just directly enter search query so just do the search 
      if (isSmallScreen) {
        if (showSearchInput) {
          handleBatchSearch(userQueries, accessToken)
        } else {
          handleToggleSearchInput()
        }
      } else {
        handleBatchSearch(userQueries, accessToken)
      }
    })

    
  }

  // JSX to render search bar
  return (
    <div className= {`search ${showSearchInput ? 'active' : ''}`}>
      {showSearchInput && <ArrowBackIcon onClick ={handleToggleSearchInput} className='back-icon' />}
      <input type='text' placeholder='Search' className='search-input' onChange={(event) => {setSearchQuery(event.target.value)}}/>
      <div className='search-box'>
       <SearchIcon onClick = {handleSearchClick} className='search-icon'/>
      </div>

    </div>
  )
}

export default NavbarSearch

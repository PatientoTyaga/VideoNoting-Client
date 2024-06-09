import React, { useContext, useEffect, useState } from 'react'
import { SearchContext } from '../contextProvider/SearchContext'
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// UserProfile component definition
function UserProfile() {

  const { searchResults, setSearchResults } = useContext(SearchContext)
  const [notes, setNotes] = useState([])

  // Helper function to decode HTML entities
  const decodeHtmlEntities = (html) => {
    const txt = document.createElement('textarea')
    txt.innerHTML = html;
    return txt.value;
  };

  const navigate = useNavigate()

  // Function to handle video click
  const handleClick = (item) => {

    console.log(item)
    
    axios.post("https://videonoting.netlify.app/videos", {video : item}, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {

      if(!response.data.error) {
        navigate(`/notes/${item.id.videoId}`)
      }else {
        console.log(response.data.error)
      }
    
    })
    .catch((error) => {
      console.log("error adding video", error)
    })
  }

  // useEffect hook to fetch notes and search results when the component mounts
  useEffect(() => {

    axios.get("https://videonoting.netlify.app/notes", {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
      setNotes(response.data)
      console.log(response.data)
    })
    .catch((error) => {
      console.log("error adding notes", error)
    })

    if(searchResults.length === 0) {
      const storedVideos = localStorage.getItem('searchedVideos') || localStorage.getItem('videos')
      
      if(storedVideos) {
        const videos = JSON.parse(storedVideos)
        setSearchResults(videos.items)
      }
    }
    
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Function to open the YouTube page for a video
  const openYoutubePage = (videoId) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(videoUrl, "_blank")
  }

  // JSX to render the user profile page
  return (
    <div className='user-profile-page'>

        <div className='saved-notes'>

          <button className='saved-notes-redirector' onClick={() => {navigate('/folders')}} disabled = {notes.length === 0}>
            <FolderIcon className='folder-icon'/>All Notes</button>

          {notes.length === 0 ?  
            <div className='no-notes-msg'>
              No Saved Notes Yet
            </div>

            :

            notes.map((note) => {
            return(
              <div className='note' key= {note.id}>
                <div className='saved-note-title'>{note.title}</div>
                <div className='saved-note-content'>
                  {note.content.length > 100
                    ? note.content.slice(0, 100) + '...'
                    : note.content}
                </div>
              </div>
                
            )
            })}
      </div>

      <div className='searched-videos'>
        {searchResults.map((item, index) => {
          console.log("item is " + item.snippet)
          const key = JSON.stringify(item)
          return(
            <div className='video' key={key}>
              <div className='title'>
                {decodeHtmlEntities(item.snippet.title).length > 50
                ? decodeHtmlEntities(item.snippet.title).slice(0, 50) + '...'
                : decodeHtmlEntities(item.snippet.title)}
              </div>
              <div className='body' onClick={() => {handleClick(item)}}>
                <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title}/>  
              </div>
              <div className='footer'>
                <button className='youtube-btn' onClick={() => openYoutubePage(item.id.videoId)}>Go to youtube page</button>
              </div>
            </div>
          )
        })}
      </div>

      
    </div>
  )
}

export default UserProfile

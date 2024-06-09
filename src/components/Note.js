import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Notepad from './Notepad'

// Note component definition
function Note() {

  // Get the 'id' parameter from the URL
  const {id } = useParams()

  // State variable to store video data
  const [videoData, setVideoData] = useState({})
  const navigate = useNavigate()

  // useEffect hook to fetch video data when the component mounts
  useEffect(() => {
    axios.get(`https://videonoting.netlify.app/videos/${id}`, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
      if(response.data.error) {

        // Log error if any
        console.log(response.data.error)
      }else if(response.data.noSuchVideo){

        // Alert and navigate back to home if no such video is found
        alert(response.data.noSuchVideo)
        navigate('/')
      }else {

        // Set the fetched video data to the state variable
        setVideoData(response.data)
      }
    })
    .catch((error) => {

      // Log and alert error if the request fails
      console.log("error retrieving video", error)
      alert('Apologies! Unable to find video. Please try again later.')
    })

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  // JST to render the video and the notepad
  return (
    <div className='video-notes-page'>

      <div className='videos-section'>

          {videoData && videoData.url && (
            <iframe
              title="YouTube Video"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoData.videoId}`}
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          )}        
      </div>

      <div className='saved-notes-section'>
        <Notepad />
      </div>

      
    </div>
  )
}

export default Note

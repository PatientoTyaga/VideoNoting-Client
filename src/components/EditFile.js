import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'


// EditFile component definition
function EditFile() {

    // Get the 'id' parameter from the URL and the 'navigate' function from the router
    const {id} = useParams()
    const navigate = useNavigate()

    //state variables for title and content of the note
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    // useEffect hook to fetch note data when the component mounts
    useEffect(() => {
        // Fetch the note data using the 'id' from the URL
        axios.get(`https://video-noting-web-app-80f672477ea7.herokuapp.com/notes/noteData/${id}`, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
            if(response.data.error) {
                //log error if any
                alert('Apologies! Unable to find file. Please try again later')
                console.log(response.data.error)
            }else if(response.data.message === "No such file found.") {

                // Alert and navigate back to the home page if no file is found
                alert(response.data.message)
                navigate('/')
            } else {

              // Set the fetched title and content to the state variables
              setTitle(response.data.title)
              setContent(response.data.content)
            }
        })
        .catch((error) => {

          // Log and alert error if the request fails
          console.log("there was an error fetching the note data!",error)
          alert('Apologies! Unable to find file.')
        })
        
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Handle form submission to update the note
    const handleSubmit = (event) => {
        event.preventDefault()
        const data = {title: title, content: content}

        // Send a PUT request to update the note data
        axios.put(`https://video-noting-web-app-80f672477ea7.herokuapp.com/notes/${id}`, data, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
            if(response.data.error) {

                // Log error if any
                alert('Apologies! Error updating file. Please try again later.')
                console.log(response.data.error)
            }else {

                // Alert the response message
                alert(response.data.message)
            }
        })
        .catch((error) => {

          // Log and alert error if the request fails
          console.log('Error: unable to update file', error)
          alert('Apologies! Error updating file. Please try again later.')
        })
    }
  

  // JSX to render the edit note form and back to folders button
  return (
    <div className='edit-file-page'>
       <form className='note-form-edit-page' onSubmit={(event) => {handleSubmit(event)}}>
        <input
          value={title}
          placeholder='Title'
          required
          className='note-title'
          onChange={(event) => {setTitle(event.target.value)}}
        >
        </input>

        <textarea
          value={content}
          placeholder='Content'
          rows={10}
          required
          className='note-text'
          onChange={(event) => {setContent(event.target.value)}}
        >
        </textarea>

        <button type='submit' className='update-note-btn'> Update Note</button>

      </form>

      <button type='submit' className='go-to-savednotes-btn' onClick={() => {navigate(`/folders`)}}> Back To Folders</button>
    </div>
  )
}

export default EditFile

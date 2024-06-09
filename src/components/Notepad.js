import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Notepad component definition
function Notepad() {

  // state variables to store form inputs and folders data
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('')
  const [folders, setFolders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newFolderName, setNewFolderName] = useState('')
  const [isNewFolderDisabled, setIsNewFolderDisabled] = useState(false)

  const navigate = useNavigate()

  // Form to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()

    const savedFolder = selectedFolder !== '' ? selectedFolder : newFolderName

    try {

      // Send a POST request to add a new note
      const response = await axios.post(
        "https://video-noting-web-app-80f672477ea7.herokuapp.com/notes",
        { title: title, content: content, folderId: selectedFolder,folderName: savedFolder },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )

      if (response.data.error) {
        console.log(response.data.error)
      } else {
        alert(response.data.message)
        setTitle("")
        setContent("")
        setNewFolderName('')
        setSelectedFolder('')
        setIsNewFolderDisabled(false)

        // Fetch the updated folders list after adding a note
        const updatedFoldersResponse = await axios.get("https://video-noting-web-app-80f672477ea7.herokuapp.com/folders", {
          headers: { accessToken: localStorage.getItem('accessToken') }
        })
        setFolders(updatedFoldersResponse.data)
      }
    } catch (error) {
      console.error('Error adding note or fetching updated folders:', error)
    }
  }

  // useEffect hook to fetch folders when the component mounts
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("https://video-noting-web-app-80f672477ea7.herokuapp.com/folders", {
          headers: { accessToken: localStorage.getItem('accessToken') }
        })
        setFolders(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchFolders()
  }, [])

  // Function to handle folder selection change
  const handleSelectChange = (event) => {
    if(event.target.value === '') {
      setSelectedFolder('')
      setIsNewFolderDisabled(false)
    }else {
      setSelectedFolder(event.target.value)
      setIsNewFolderDisabled(true)
    }
  }

  // JSX to render the notepad form
  return (
    <div className='notepad'>
      
      <form className='note-form' onSubmit={(event) => {handleSubmit(event)}}>
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

        <div className='folder-section'> 
          <label htmlFor='dropdown'>Select Folder</label>
          <select id='dropdown' value={selectedFolder} onChange={handleSelectChange} className='dropdown'>
            {isLoading && <option value="">Loading...</option> }
            {!isLoading && folders.length === 0 && <option value="">---No folders---</option>}
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}

            <option value=''>None</option>
          </select>
          <>Or create a new folder:</>
          <input
            type='text'
            placeholder='New folder name'
            value={newFolderName}
            onChange={(event) => {setNewFolderName(event.target.value)}}
            className='new-folder-input'
            disabled = {isNewFolderDisabled}
          />

        </div>

        <button type='submit' className='add-note-btn' disabled = {!selectedFolder.trim() && !newFolderName}> Add Note</button>

      </form>

            {console.log("folder length " + folders.length)}
      <button type='button' className='go-to-savednotes-btn' disabled = {folders.length === 0} onClick={() => {navigate('/folders')}}> Go To Saved Notes</button>

    </div>
  )
}

export default Notepad

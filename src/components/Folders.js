import axios from 'axios'
import React, { useEffect, useState } from 'react'
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from 'react-router-dom';

// Folders component definition
function Folders() {

  // State variables to store the list of folders
  const [folders, setFolders] = useState([])
  let navigate = useNavigate()

  // useEffect hook to fetch folders when the component mounts
  useEffect(() => {

    // Fetch folders data from the server
    axios.get("http://videonoting.netlify.app/folders", {headers: {accessToken: localStorage.getItem('accessToken')}})
    .then((response) => {
        if(response.data.error) {
            // Alert error if any
            alert(response.data.error)
        }else {

            // Set the fetched folders to the state variable
            setFolders(response.data)
        }
    })
    .catch((error) => {

      // Log and alert error if the request fails
      console.log("Error retrieving folders.", error)
      alert('Apologies! Unable to retrieve folders. Please try again later.')
    })
  }, [])

  // Handle delete folder action
  const handleDelete = (id) => {
    const proceed = window.confirm("Deleting folder will delete all files within it. Proceed?")

    if(proceed) {
      
      // Send a DELETE request to delete the folder by ID
      axios.delete(`http://videonoting.netlify.app/folders/${id}`, {headers: {accessToken: localStorage.getItem("accessToken")}})
      .then((response) => {
        console.log(response.data)
        // Filter out the deleted folder from the state variable
        setFolders(folders.filter(folder => folder.id !== id))
      })
      .catch((error) => {

        // Log and alert error if the request fails
        console.log("error deleting folder", error)
        alert("Apologies! Unable to delete folders. Please try again later.")
      })
    }
    
  }

  // JSX to render the folders and the action buttons
  return (
    <div className='folders-page'>
        {folders.map((folder) => (
            <div className='folder' key={folder.id}>
                <FolderIcon className='folder-icon' style={{ fontSize: 100 }} onClick = {() => {navigate(`/folder/${folder.id}`)}}/>
                {folder.name}
                <button className='delete-btn' onClick={() => {handleDelete(folder.id)}}>Delete</button>
            </div>
        ))}
        
    </div>
  )
}

export default Folders

import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contextProvider/AuthContext'
import { fetchProfilePhoto } from './Utils'
import { ProfilePhotoContext } from '../contextProvider/ProfilePhotoContext'
import { DarkModeContext } from '../contextProvider/DarkModeContext'

// Settings component definition
function Settings() {

  // State variables to manage form inputs and profile photo
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [imageUpload, setImageUpload] = useState(null)
  const [profilePhotoExists, setProfilePhotoExists] = useState(false)

  const {setAuthState} = useContext(AuthContext)
  const { setProfilePhotoUrl } = useContext(ProfilePhotoContext)
  const { setIsDarkMode } = useContext(DarkModeContext)

  const navigate = useNavigate()
  
  // Function to handle username update
  const handleUsernameUpdate = () => {
    
    const proceed = window.confirm("Proceed with new username?")

    if(proceed) {
        axios.put('http://localhost:3001/auth',{username: newUsername}, {headers: {accessToken: localStorage.getItem("accessToken")}})
        .then((response) => {
            if(response.data.error) {
                alert(response.data.error)
            }else {
                alert(response.data.message)
            }

            setNewUsername("")
        })
    }
    
  }  

  // Function to handle password update
  const hadlePasswordUpdate = (event) => {

    if (newPassword.length < 5 || newPassword.length > 20) {
      alert("New password must be between 5 and 20 characters long.");
      setCurrentPassword("")
      setNewPassword("")
      return;
    }

    event.preventDefault()
    const proceed = window.confirm("Change password?")

    if(proceed) {
      axios.post("http://localhost:3001/auth/update-password", {currentPassword: currentPassword, newPassword: newPassword}, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
        if(response.data.error) {
          alert(response.data.error)
        }else {
          alert(response.data.message)
        }

        setCurrentPassword("")
        setNewPassword("")
      })
      .catch((error) => {
        console.log("error updating password")
        alert('Apologies! Unable to update password. Please try again later.')
      })
    }
  }  

    
    
  
  // Function to handle account deletion
  const handleDelete = () => {

    const proceed = window.confirm("Do you want to proceed with deleting account?")

    if(proceed) {

      const accessToken = localStorage.getItem('accessToken')

      axios.delete("http://localhost:3001/upload-image", { headers: { accessToken } })
      .then((response) => {
        if(!response.data.error) {
          console.log("no error")
          axios.delete("http://localhost:3001/auth/delete-account", {headers: {accessToken: accessToken}})
          .then((response) => {
            if(response.data.error) {
              alert(response.data.error)
            }else {
              alert(response.data.message)

              localStorage.removeItem("accessToken")
              localStorage.removeItem("searchQuery")
              localStorage.removeItem("defaultQuery")
              localStorage.removeItem("videos")
              localStorage.removeItem("searchedVideos")

              const darkMode = localStorage.getItem('darkMode')
              localStorage.removeItem('darkMode')

              if(darkMode) {
                document.body.classList.add('light-mode')
                document.body.classList.remove('dark-mode')
              }

              setIsDarkMode(false)

              setAuthState(prevState => ({
                ...prevState,
                username: "",
                id: 0,
                status: false
              }))
              
              navigate('/')          
            }
          })
          .catch((error) => {
            console.error("Error deleting account", error)
            alert("An error occured while deleting the account. Please try again later.")
          })
        }
      })
    .catch((error) => {
      console.error("Error deleting account", error)
      alert("An error occured while deleting the account. Please try again later.")
    })
    }
    
  }

  // Function to handle image upload
  const uploadImage = () => {
    const formData = new FormData();

    if(!imageUpload) {
      return alert('Choose image to upload!')
    }
    
    //Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']
    if(!validImageTypes.includes(imageUpload.type)) {
      return alert('Invalid file type. Please upload an image file (jpeg, png, gif).')
    }

    formData.append('imageFile', imageUpload); 
    
    const accessToken = localStorage.getItem("accessToken")

    const upload = () => {

      axios.post("http://localhost:3001/upload-image", formData, {headers: {accessToken: accessToken}}).then((response) => {
        alert('Image uploaded successfully!')

        fetchProfilePhoto(accessToken).then(({url, exists}) => {
          setProfilePhotoUrl(url)
          setProfilePhotoExists(exists)
        })

      }).catch((error) => {
        console.error('Error uploading image:', error);
        alert('An error occurred while uploading the image');
      })

    }
  
    if (profilePhotoExists) {
      const proceed = window.confirm("There's already an existing profile picture. Do you want to proceed and update it?");
      if (proceed) {
        axios.delete("http://localhost:3001/upload-image", { headers: { accessToken } })
        .then(() => {
          upload()
        })
        .catch((error) => {
          console.error('Error deleting existing image:', error)
          alert('An error occurred while deleting the existing image')
        })
      }
    } else {
      upload()
    }

  }

  // Function to delete profile photo
  const deleteProfilePhoto = () => {

    const accessToken = localStorage.getItem("accessToken")

    fetchProfilePhoto(accessToken).then(({exists}) => {
      if(!exists) {
        alert("There is no existing profile picture to delete!")
        return
      } else {

        const proceed = window.confirm("Proceed with Deletion?");

        if(proceed) {
          axios.delete("http://localhost:3001/upload-image", { headers: { accessToken } })
          .then((response) => {
          if (response.data.error) {
              alert(response.data.error)
            } else {
              alert('Profile picture deleted successfully!')
              setProfilePhotoUrl('')
              setProfilePhotoExists(false)
            }
          })
          .catch((error) => {
            console.error('Error deleting profile picture:', error)
            alert('An error occurred while deleting the profile picture')
          })
        }
        
      }

    })
    
    
  }
  

  // JSX to render settings page
  return (
    <div className='settings-page'>

      <div className='username-update'>
        <label>Update Username</label>
        <input className='update-username-field' value={newUsername} placeholder='new username'  type='text' onChange={(event) => {setNewUsername(event.target.value)}}  />
        <button className='username-btn' disabled={newUsername.trim() === '' ? true : false} onClick={() => {handleUsernameUpdate()}}>Update Username</button>
      </div>

      <div className='password-update'>
        <label>Update Password</label>
        <input className='update-password-field' value={currentPassword} type='password' placeholder = 'current password' onChange={(event) => {setCurrentPassword(event.target.value)}} />
        <input className='update-password-field' value={newPassword} type='password' placeholder = 'new password' onChange={(event) => {setNewPassword(event.target.value)}} />
        <button className='password-btn' disabled = {currentPassword.trim() === '' || newPassword.trim() === '' ? true : false} onClick={(event) => {hadlePasswordUpdate(event)}}>Update Password</button>
      </div>

      <div className='upload-photo'>

        <div className='upload-profile-photo'>
          <input type='file' onChange={(event) => {setImageUpload(event.target.files[0])}}/>
          <button onClick={((uploadImage))} className='upload-btn'>Upload Profile Pic</button>
        </div>
        
        <div className='edit-profile-photo'>
          <button type='submit' className='delete-btn' onClick={deleteProfilePhoto}>Delete Profile Picture</button>
        </div>
      </div>

      <div className='delete-account'>
        <button type='submit' className='delete-btn' onClick={handleDelete}>Delete Account</button>
      </div>
    </div>
  )
}

export default Settings

import React, { useContext, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import loginLogo from '../images/loginLogo.png'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contextProvider/AuthContext'
import { SearchContext } from '../contextProvider/SearchContext'
import { fetchProfilePhoto } from './Utils'
import { ProfilePhotoContext } from '../contextProvider/ProfilePhotoContext'

function Register() {

  // Initial form values
  const initialValues = {
    username: "",
    password: ""
  }

  // Contexts for authentication, search results, and profile photo
  const { authState, setAuthState } = useContext(AuthContext)
  const { setSearchResults } = useContext(SearchContext)
  const { setProfilePhotoUrl } = useContext(ProfilePhotoContext)

  let navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")

  // Form submission handler
  const onSubmit = (data) => {

    setErrorMessage("")

    // Make a POST request to login the user
    axios.post("https://videonoting.netlify.app/auth/login", data).then((response) => {
        if(response.data.error) {
            setAuthState({...authState, status: false})
            setErrorMessage(response.data.error)
        }else {

            // Save the token and update authentication state
            localStorage.setItem("accessToken", response.data.token)
            setAuthState({
              username: response.data.username,
              id: response.data.id,
              status: true,
              isDarkMode: localStorage.getItem('darkMode') ? localStorage.getItem('darkMode') : false
            })

            // Fetch profile photo and set the URL
            fetchProfilePhoto(response.data.token).then((url) => {
              setProfilePhotoUrl(url)
            })

            // Fetch default query and search results
            axios.get(`https://videonoting.netlify.app/auth/${response.data.id}/defaultQuery`, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((queryResponse) => {
              const defaultQuery = queryResponse.data.defaultQuery
              console.log(defaultQuery)
              localStorage.setItem("defaultQuery", defaultQuery);
              
              axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyCDpRmPs7znAd0zxq0TI8LtdhGHLuiRvqA&q=${defaultQuery}&type=video&part=snippet&maxResults=50`)
              .then((response) => {
                if(response.data.error) {
                  console.log(response.data.error)
                }else {
                  setSearchResults(response.data.items)
                  localStorage.setItem('videos', JSON.stringify(response.data))
                }
                
              }).catch((error) => {
                console.error("Error fetching search results:", error)
              })
            })


            navigate('/userProfile')
        }
    })
  }

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(5).max(15).required("User name is required."),
    password: Yup.string().min(5).max(20).required("Password is required.")
  })

  return (
    <div className='registration-page'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        
        <Form className='registration-form'>
            <img src={loginLogo} alt='login-logo' className='login-logo' />

            <span className='login-error'> {errorMessage} </span>

            <ErrorMessage name='username' component= 'span' className='form-error-message' />
            <Field name = 'username' placeHolder = 'Username' className = 'form-field'/>

            <ErrorMessage name='password' component= 'span' className='form-error-message' />
            <Field type = 'password' name = 'password' placeHolder = 'Password' className = 'form-field'/>

            <button type='submit' className='signup-btn'>Login</button>
        </Form>
      </Formik>

      <Link to= "/register">No Account? Click here to Register</Link>
    </div>
  )
}

export default Register

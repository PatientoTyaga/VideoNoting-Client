import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import axios from 'axios'

// Register component definition
function Register() {

  // Initial form values
  const initialValues = {
    username: "",
    password: "",
    searchQuery: ""
  }

  const navigate = useNavigate()

  // Function to handle form submission
  const onSubmit = (data) => {
    axios.post("https://video-noting-web-app-80f672477ea7.herokuapp.com/auth", data).then((response) => {
      if(response.data.error) {
        alert(response.data.error)
        return
      }
        navigate('/login')
    })
    .catch((error) => {
      console.log("error with login.", error)
      alert('Apologies! issue with login. Please try again later.')
    })
  }

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(5).max(15).required("Please enter username."),
    password: Yup.string().min(5).max(20).required("Please enter password."),
    searchQuery: Yup.string().required("Please enter what you want to be the default search results.")
  })

  // JSX to render the registration form
  return (
    <div className='registration-page'>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        
        <Form className='registration-form'>
            <h1 className='register-title'>Register</h1>

            <label className='form-label'>Username: </label>
            <ErrorMessage name='username' component= 'span' className='form-error-message' />
            <Field name = 'username' placeHolder = 'Enter username ex. James..' className = 'form-field'/>

            <label className='form-label'>Password: </label>
            <ErrorMessage name='password' component= 'span' className='form-error-message' />
            <Field type = 'password' name = 'password' placeHolder = 'Enter password' className = 'form-field'/>

            <label className='form-label'>Enter your favorite topic to discover videos: </label>
            <ErrorMessage name='searchQuery' component= 'span' className='form-error-message' />
            <Field name = 'searchQuery' placeHolder = 'Enter what you want to be displayed upon login, ex..Algorithms tutorials...' className = 'form-field'/>

            <button type ='submit' className='signup-btn'>Register</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Register

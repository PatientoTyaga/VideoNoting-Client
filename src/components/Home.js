import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DarkModeContext } from '../contextProvider/DarkModeContext'
import emailjs from '@emailjs/browser';
import axios from 'axios'

// MainPage component definition
function MainPage() {

let navigate = useNavigate()
const { isDarkMode } = useContext(DarkModeContext)
const [demoVideoUrl, setDemoVideoUrl] = useState('')
const [email, setEmail] = useState('')
const [message, setMessage] = useState('')

// useEffect hook to fetch the demo video URL when the component mounts
useEffect(() => {
    const fetchVideoUrl = async () => {

        // Fetch the video URL from the server
        try {
            axios.get('https://videonoting.netlify.app/video-url').then((response) => {
                if(!response.data.error) {
                    setDemoVideoUrl(response.data)
                }
            })
            
        } catch (error) {
            console.error('Error fetching video URL:', error)
        }
    };

    fetchVideoUrl()
}, [])

// useRef hook to store a reference to the form element
const form = useRef()

// Function to handle form submission and send an email
const sendEmail = (e) => {
    e.preventDefault()

    emailjs
    .sendForm('service_lo6zvea', 'template_7zk2iq3', form.current, {
        publicKey: 'CZ4xpo9dCxE30rXEC',
    })
    .then(
        () => {
            alert('Message sent successfully!')
            setEmail('')
            setMessage('')

        },
        (error) => {
            console.log(error.text)
            alert('Apologies, there is an error in sending email. Please try again later.')
        },
    )
}
  
  // JSX to render the main page content
  return (
    <div className='home-page' style={{ color: isDarkMode ? 'white' : 'black' }}>
        <div className='welcome'>
            <div className='app-description'>
                <h1>Welcome to VideoNoting</h1>
                <div className='about-details'>
                    <p>
                        This is just a simple web app that is designed to carter to all types of users. 
                        Whether you want to use this app for learning, noting and saving recipes, 
                        and so on, then this is for you
                    </p>

                    <p>
                        You will have the option to take and save notes while watching a video. Search something
                        in the search bar above to get a list of videos displayed below matching your search. Click on 
                        the video you want, then make notes as you watch. Simple!
                    </p>
                </div>
                <button className='signup-btn' onClick={() => {navigate('/register')}}>Create Your Account</button>
            </div>
            
            {demoVideoUrl ? (
                <video className='home-logo' controls>
                    <source src={demoVideoUrl} type='video/mp4' />
                    Your browser does not support the video tag.
                </video>
            ) : (
                <p>Loading demo video...</p>
            )}
            

        </div>

        <div className='contact-us'>

            <div className='contact-us-details'>
                <h2>Have something to report ? Or simply want to leave a feedback?</h2>
                <ul className='list-items'>
                    <li>Report any error you experienced.</li>
                    <li>Leave feedback on your user experience.</li>
                    <li>Suggestions on improvements one can make are welcome.</li>
                    <li>Any questions regarding VideoNoting are welcomed as well.</li>
                </ul>
            </div>

            <form ref={form} className='contact-us-form' onSubmit={sendEmail} >

                <input
                    type='email'
                    value={email}
                    name='from_name'
                    placeholder='Email'
                    required
                    className='note-title feedback-title'
                    onChange={(e) =>{setEmail(e.target.value)}}
                    >
                </input>

                <textarea
                    name='message'
                    value={message}
                    placeholder='Your bug report/message/feedback'
                    rows={10}
                    required
                    className='note-text contact-form'
                    onChange={(e) => {setMessage(e.target.value)}}
                    >
                </textarea>

            <input type='submit' className='submit-btn' value= 'Send'/>

        </form>
        </div>

    </div>
  )
}



export default MainPage

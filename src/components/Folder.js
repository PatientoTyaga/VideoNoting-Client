import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet} from '@react-pdf/renderer'

// Folder component definition
function Folder() {

  // Get the 'id' parameter from the URL and the 'navigate' function from the router
  const {id} = useParams()
  const [notes, setNotes] = useState([])
  const navigate = useNavigate()


  // useEffect hook to fetch notes when the component mounts
  useEffect(() => {

    // Fetch notes by folder ID
    axios.get(`http://localhost:3001/notes/byid/${id}`, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
        if(response.data.error) {
        
            // Log error if any
            console.log(response.data.error)
        }else if(response.data.noSuchFolder) {

          // Alert and navigate back to home if no such folder is found
          alert(response.data.noSuchFolder)
          navigate('/')
        }else if(response.data.noNotesFound) {

          // Alert and navigate back to folders if no notes are found
          alert(response.data.noNotesFound)
          navigate('/folders')
        }else {

          // Log and alert error if the request fails
          setNotes(response.data)
        }
    })
    .catch((error) => {

      // Log and alert error if the request fails
      console.log("Error retrieving folder", error)
      alert('Apologies! Unable to retrieve folder. Please try again later.')
    })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  // Handle delete note action
  const handleDelete = (id) => {
    const proceed = window.confirm("Delete file?")

    if(proceed) {

      // Send a DELETE request to delete the note by ID
      axios.delete(`http://localhost:3001/notes/${id}`, {headers: {accessToken: localStorage.getItem("accessToken")}}).then((response) => {
        console.log(response.data)
        // Filter out the deleted note from the state variable
        setNotes(notes.filter(note => note.id !== id))
      })
      .catch((error) => {

        // Log and alert error if the request fails
        console.log("Error in deleting folder", error)
        alert('Apologies! Unable to delete folder. Please try again later')
      })
    }
  }

  // Styles for the PDF document
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 20
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      fontWeight: 'bold'
    },
    content: {
      fontSize: 12,
    }
  })

  // Function to generate the PDF download link
  const downloadPDF = (title, content) => {

    // Define the document structure
    const doc = (
      <Document>
        <Page size = "A4">
          <View style={styles.page}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{content}</Text>
          </View>
        </Page>
      </Document>
    )

    // Return the PDF download link component
    const asPdf = <PDFDownloadLink document={doc} fileName={`${title}.pdf`} className='pdf-link'>
      {({ loading }) => loading ? 'Loading document...' : 'Download PDF'}
    </PDFDownloadLink>

    return asPdf
  }


  // JSX to render the notes and the action buttons
  return (
    <div className='files-page'>
        {notes.map((note) => {
            return(
              <div className='file-note' key= {note.id}>
                <div className='saved-note-title'>{note.title}</div>
                <div className='saved-note-content'>
                  {note.content.length > 100
                    ? note.content.slice(0, 100) + '...'
                    : note.content}
                </div>
                <div className='files-footer'>
                    {downloadPDF(note.title, note.content)}
                    <button className='edit-btn' onClick={() => {navigate(`/editFile/${note.id}`)}}>Edit</button>
                    <button className='delete-btn' onClick={() => {handleDelete(note.id)}}>Delete</button>
                </div>
              </div>
                
            )
        })}
    </div>
  )
}

export default Folder

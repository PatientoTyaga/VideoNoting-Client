import axios from 'axios';

// Function to fetch the profile photo
export const fetchProfilePhoto = (token) => {

  // Send a GET request to the server to fetch the profile photo
  return axios.get("https://video-noting-web-app-80f672477ea7.herokuapp.com/upload-image", { headers: { accessToken: token } })
    .then((response) => {
      if (!response.data.error) {
        
        // If there's no error in the response, return the URL and a flag indicating the photo exists
        return {url: response.data.url, exists: true}
      } else {

        // If there's an error, return an empty URL and a flag indicating the photo does not exist
        return {url: '', exists: false}
      }
    })
    .catch((error) => {

      // Log any error that occurs during the request and return an empty URL and a flag indicating the photo does not exist
      console.log('Error fetching profile picture', error);
      return {url: '', exists: false}
    })
}

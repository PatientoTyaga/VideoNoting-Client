import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
  apiKey: "AIzaSyCDpRmPs7znAd0zxq0TI8LtdhGHLuiRvqA",
  authDomain: "videonoting.firebaseapp.com",
  projectId: "videonoting",
  storageBucket: "videonoting.appspot.com",
  messagingSenderId: "43858482297",
  appId: "1:43858482297:web:69683442b26cb502cc30a8",
  measurementId: "G-3S8DS13P9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app)
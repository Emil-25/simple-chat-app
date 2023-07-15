import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore'

// ... other firebase imports

export const firebaseApp = initializeApp({
  // your application settings
  apiKey: "AIzaSyA0qU5ytk4EJB870Ylp6KD6IGwOLzZOdtg",
  authDomain: "chitchat-e0ca3.firebaseapp.com",
  projectId: "chitchat-e0ca3",
  storageBucket: "chitchat-e0ca3.appspot.com",
  messagingSenderId: "986667587308",
  appId: "1:986667587308:web:962a51eb3862a4019f37c9",
  measurementId: "G-3JKDYQ2HGY"
})

const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const usersRef = collection(db, 'users');
export const chatRoomsRef = collection(db, 'chatrooms');



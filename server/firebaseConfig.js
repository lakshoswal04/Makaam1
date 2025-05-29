// Firebase configuration for server
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBmT7KZ-f73XCd8XVCWJgU9zIQGZ5KW0kk",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "makaam-app.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "makaam-app",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "makaam-app.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.FIREBASE_APP_ID || "1:1234567890:web:1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };

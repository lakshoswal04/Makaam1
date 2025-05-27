import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBt30Cjy00bM6s2Rik97I7Z_EDa8sG3UIc",
  authDomain: "pathfinder-makaam.firebaseapp.com",
  projectId: "pathfinder-makaam",
  storageBucket: "pathfinder-makaam.appspot.com",
  messagingSenderId: "830877360802",
  appId: "1:830877360802:web:05c4c79f176feed43f6dfb",
  measurementId: "G-78FCR1D1F7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; 
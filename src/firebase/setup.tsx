import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,FacebookAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyC6vKciUcljQWAXHu5tZTd9ppPYzXx_GyU",
  authDomain: "udaan-community-portal.firebaseapp.com",
  projectId: "udaan-community-portal",
  storageBucket: "udaan-community-portal.appspot.com",
  messagingSenderId: "703103612418",
  appId: "1:703103612418:web:d942365c194cbf8098d91b",
  measurementId: "G-FJJ3C9T43Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()
export const storage = getFirestore(app)

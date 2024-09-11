import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
 


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIu5pYJLtCtnjh7XnQFDuo2R6isa-jWik",
    authDomain: "tickets-29703.firebaseapp.com",
    projectId: "tickets-29703",
    storageBucket: "tickets-29703.appspot.com",
    messagingSenderId: "564336494759",
    appId: "1:564336494759:web:dba372277612a83fdbb382"
  };


  const firebaseApp = initializeApp(firebaseConfig)

  const auth = getAuth(firebaseApp)
  
  const storage = getStorage(firebaseApp)

  const db = getFirestore(firebaseApp)


  export {auth, storage, db}
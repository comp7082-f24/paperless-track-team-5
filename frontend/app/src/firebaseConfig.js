import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration object for Receipt Tracker project
const firebaseConfig = {
    apiKey: "AIzaSyC91pHHMJfeS3c-9-ZKJSnDsBWJ-MaaxjI",
    authDomain: "receipt-tracker-72f3d.firebaseapp.com",
    projectId: "receipt-tracker-72f3d",
    storageBucket: "receipt-tracker-72f3d.appspot.com",
    messagingSenderId: "824273519528",
    appId: "1:824273519528:web:8b567edd9b4f718d77939d"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set authentication persistence to 'local' (i.e., persists across sessions)
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Error setting persistence: ", error); // Log any error in persistence setting
    });

// Initialize Firestore database
const firestore = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export Firebase services for use in other parts of the app
export { auth, firestore, storage, signInWithEmailAndPassword };

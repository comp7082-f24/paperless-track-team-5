import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"; // Import persistence functions

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC91pHHMJfeS3c-9-ZKJSnDsBWJ-MaaxjI",
    authDomain: "receipt-tracker-72f3d.firebaseapp.com",
    projectId: "receipt-tracker-72f3d",
    storageBucket: "receipt-tracker-72f3d.appspot.com",
    messagingSenderId: "824273519528",
    appId: "1:824273519528:web:8b567edd9b4f718d77939d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to local
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Error setting persistence: ", error);
    });

export { auth };

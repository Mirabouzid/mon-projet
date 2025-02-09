// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRe-2UuhddkMEtlRvNxd5idDoUogtRVp8",
    authDomain: "realtor-clone-react-fba75.firebaseapp.com",
    projectId: "realtor-clone-react-fba75",
    storageBucket: "realtor-clone-react-fba75.firebasestorage.app",
    messagingSenderId: "205863917355",
    appId: "1:205863917355:web:1b237e029e9bd0873cd76e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()
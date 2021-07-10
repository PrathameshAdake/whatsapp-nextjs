import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyC0tQBTBM-OmEyEUKeZvSJiIAz4KSuYa90",
    authDomain: "whatsapp-446bf.firebaseapp.com",
    projectId: "whatsapp-446bf",
    storageBucket: "whatsapp-446bf.appspot.com",
    messagingSenderId: "402477895878",
    appId: "1:402477895878:web:e2d320930061d346e407c7"
};

const app = !firebase.apps.length 
    ? firebase.initializeApp(firebaseConfig) 
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
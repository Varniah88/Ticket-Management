// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyDElmhDFZS6GoPMSEyMAsNSfHqCKby-mp8",
    authDomain: "fir-store-react.firebaseapp.com",
    databaseURL: "https://fir-store-react.firebaseio.com",
    projectId: "fir-store-react",
    storageBucket: "fir-store-react.appspot.com",
    messagingSenderId: "276665361089",
    appId: "1:276665361089:web:562e742875a105af83aa40",
    measurementId: "G-C6V8Q0Q3Y3"
});
  
const db=firebaseConfig.firestore();

  export {db};
import firebase from 'firebase';


  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyALOTHzGYESZ7cuVRmetXXQyJH9QDXGgMo",
    authDomain: "flubbies-4e871.firebaseapp.com",
    projectId: "flubbies-4e871",
    storageBucket: "flubbies-4e871.appspot.com",
    messagingSenderId: "976409281367",
    appId: "1:976409281367:web:d2efaec1538cd80a993412"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();
  export default firebase;
